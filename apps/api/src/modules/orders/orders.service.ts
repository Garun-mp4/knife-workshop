import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { OrderStatus, PaymentStatus, Prisma, ProductStatus } from "@prisma/client";
import { toPublicProduct } from "../../common/to-public-product";
import { PrismaService } from "../../prisma/prisma.service";
import { CheckoutDto } from "./dto/order.dto";
import { YooKassaService } from "./yookassa.service";

const orderInclude = {
  user: { select: { id: true, email: true, name: true, phone: true, telegram: true, whatsapp: true, city: true, avatarUrl: true } },
  items: { include: { product: { include: { images: true, category: true } }, review: true }, orderBy: { createdAt: "asc" as const } },
  payments: { orderBy: { createdAt: "desc" as const } }
} satisfies Prisma.OrderInclude;

function normalize(value: string | null | undefined) {
  const next = value?.trim();
  return next || null;
}

function paymentStatus(status: string): PaymentStatus {
  if (status === "succeeded") return "SUCCEEDED";
  if (status === "canceled") return "CANCELED";
  return "PENDING";
}

@Injectable()
export class OrdersService {
  constructor(private readonly prisma: PrismaService, private readonly yookassa: YooKassaService) {}

  private async deliveryText() {
    const row = await this.prisma.siteSetting.findUnique({ where: { key: "site" } });
    const site = (row?.value ?? {}) as Record<string, unknown>;
    return String(site.cartDeliveryText || site.deliveryText || "Доставка оплачивается отдельно после согласования с мастерской.");
  }

  private toDto(order: Prisma.OrderGetPayload<{ include: typeof orderInclude }>) {
    return {
      ...order,
      totalAmount: order.totalAmount.toString(),
      items: order.items.map((item) => ({
        ...item,
        price: item.price.toString(),
        product: item.product ? toPublicProduct(item.product) : null
      })),
      payments: order.payments.map((payment) => ({ ...payment, amount: payment.amount.toString() }))
    };
  }

  private async restoreProducts(orderId: string, from: ProductStatus = "RESERVED", to: ProductStatus = "IN_STOCK") {
    const items = await this.prisma.orderItem.findMany({ where: { orderId, productId: { not: null } }, select: { productId: true } });
    await Promise.all(
      items
        .map((item) => item.productId)
        .filter(Boolean)
        .map((productId) => this.prisma.product.updateMany({ where: { id: productId as string, status: from }, data: { status: to } }))
    );
  }

  async checkout(userId: string, dto: CheckoutDto) {
    const deliveryText = await this.deliveryText();
    const order = await this.prisma.$transaction(async (tx) => {
      const user = await tx.user.findUniqueOrThrow({ where: { id: userId } });
      const cart = await tx.cart.findUnique({
        where: { userId },
        include: { items: { include: { product: { include: { images: true } } }, orderBy: { createdAt: "asc" } } }
      });
      if (!cart?.items.length) throw new BadRequestException("Корзина пуста");

      let total = 0;
      for (const item of cart.items) {
        if (item.product.status !== "IN_STOCK") throw new BadRequestException(`Товар "${item.product.title}" уже недоступен`);
        if (!item.product.price) throw new BadRequestException(`У товара "${item.product.title}" нет цены для онлайн-оплаты`);
        const reserved = await tx.product.updateMany({ where: { id: item.productId, status: "IN_STOCK" }, data: { status: "RESERVED" } });
        if (reserved.count !== 1) throw new BadRequestException(`Товар "${item.product.title}" уже резервируется другим покупателем`);
        total += Number(item.product.price);
      }

      const created = await tx.order.create({
        data: {
          userId,
          totalAmount: total,
          customerName: normalize(dto.customerName) || user.name,
          email: user.email,
          phone: normalize(dto.phone) || user.phone,
          telegram: normalize(dto.telegram) || user.telegram,
          whatsapp: normalize(dto.whatsapp) || user.whatsapp,
          city: normalize(dto.city) || user.city,
          deliveryAddress: normalize(dto.deliveryAddress) || user.deliveryAddress,
          deliveryComment: normalize(dto.deliveryComment) || user.deliveryComment,
          deliveryText,
          items: {
            create: cart.items.map((item) => {
              const firstImage = item.product.images.sort((a, b) => Number(b.isMain) - Number(a.isMain) || a.sortOrder - b.sortOrder)[0];
              return {
                productId: item.productId,
                title: item.product.title,
                slug: item.product.slug,
                price: item.product.price!,
                quantity: 1,
                imageUrl: firstImage?.thumbKey ? `${process.env.S3_PUBLIC_ENDPOINT ?? "http://localhost:9000"}/${process.env.S3_BUCKET ?? "knife-workshop-media"}/${firstImage.thumbKey}` : null
              };
            })
          }
        }
      });
      return created;
    });

    try {
      const returnUrl = new URL(dto.returnUrl || `${process.env.PUBLIC_SITE_URL ?? "http://localhost:8080"}/cart/result`);
      returnUrl.searchParams.set("orderId", order.id);
      const payment = await this.yookassa.createPayment({
        orderId: order.id,
        amount: Number(order.totalAmount).toFixed(2),
        returnUrl: returnUrl.toString(),
        description: `Заказ ${order.id}`
      });
      await this.prisma.payment.create({
        data: {
          orderId: order.id,
          providerPaymentId: payment.id,
          status: paymentStatus(payment.status),
          amount: order.totalAmount,
          confirmationUrl: payment.confirmation?.confirmation_url,
          raw: payment as any
        }
      });
      const cart = await this.prisma.cart.findUnique({ where: { userId } });
      if (cart) await this.prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
      return { order: await this.findForUser(userId, order.id), confirmationUrl: payment.confirmation?.confirmation_url };
    } catch (error) {
      await this.prisma.order.update({ where: { id: order.id }, data: { status: "PAYMENT_FAILED" } }).catch(() => undefined);
      await this.restoreProducts(order.id).catch(() => undefined);
      throw error;
    }
  }

  async listForUser(userId: string) {
    const orders = await this.prisma.order.findMany({ where: { userId }, include: orderInclude, orderBy: { createdAt: "desc" } });
    return orders.map((order) => this.toDto(order));
  }

  async findForUser(userId: string, id: string) {
    const order = await this.prisma.order.findFirst({ where: { id, userId }, include: orderInclude });
    if (!order) throw new NotFoundException("Заказ не найден");
    return this.toDto(order);
  }

  async adminList() {
    const orders = await this.prisma.order.findMany({ include: orderInclude, orderBy: { createdAt: "desc" } });
    return orders.map((order) => this.toDto(order));
  }

  async adminFind(id: string) {
    const order = await this.prisma.order.findUnique({ where: { id }, include: orderInclude });
    if (!order) throw new NotFoundException("Заказ не найден");
    return this.toDto(order);
  }

  async updateStatus(id: string, status: OrderStatus) {
    await this.adminFind(id);
    if (status === "CANCELLED" || status === "PAYMENT_FAILED") await this.restoreProducts(id);
    const order = await this.prisma.order.update({ where: { id }, data: { status }, include: orderInclude });
    return this.toDto(order);
  }

  async handleYooKassaWebhook(payload: any) {
    const object = payload?.object;
    const providerPaymentId = object?.id;
    if (!providerPaymentId) throw new BadRequestException("Некорректное уведомление ЮKassa");
    const paymentData = process.env.YOOKASSA_SHOP_ID && process.env.YOOKASSA_SECRET_KEY
      ? await this.yookassa.fetchPayment(providerPaymentId)
      : object;
    const payment = await this.prisma.payment.findUnique({ where: { providerPaymentId }, include: { order: { include: { items: true } } } });
    if (!payment) throw new NotFoundException("Платеж не найден");
    const nextPaymentStatus = paymentStatus(paymentData.status);

    if (nextPaymentStatus === "SUCCEEDED") {
      await this.prisma.$transaction(async (tx) => {
        await tx.payment.update({ where: { id: payment.id }, data: { status: "SUCCEEDED", raw: paymentData as any } });
        await tx.order.update({ where: { id: payment.orderId }, data: { status: "PAID" } });
        await Promise.all(
          payment.order.items
            .map((item) => item.productId)
            .filter(Boolean)
            .map((productId) => tx.product.updateMany({ where: { id: productId as string, status: "RESERVED" }, data: { status: "SOLD" } }))
        );
      });
      return { ok: true };
    }

    if (nextPaymentStatus === "CANCELED") {
      await this.prisma.payment.update({ where: { id: payment.id }, data: { status: "CANCELED", raw: paymentData as any } });
      await this.updateStatus(payment.orderId, "PAYMENT_FAILED");
      return { ok: true };
    }

    await this.prisma.payment.update({ where: { id: payment.id }, data: { status: nextPaymentStatus, raw: paymentData as any } });
    return { ok: true };
  }
}
