import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { toPublicProduct } from "../../common/to-public-product";
import { PrismaService } from "../../prisma/prisma.service";

const cartInclude = {
  items: {
    include: {
      product: { include: { category: true, images: true } }
    },
    orderBy: { createdAt: "asc" as const }
  }
} satisfies Prisma.CartInclude;

@Injectable()
export class CartService {
  constructor(private readonly prisma: PrismaService) {}

  private async ensureCart(userId: string) {
    return this.prisma.cart.upsert({
      where: { userId },
      create: { userId },
      update: {},
      include: cartInclude
    });
  }

  private toDto(cart: Prisma.CartGetPayload<{ include: typeof cartInclude }>) {
    const items = cart.items.map((item) => {
      const product = toPublicProduct(item.product);
      const price = Number(product.price ?? 0);
      const available = item.product.status === "IN_STOCK" && Boolean(item.product.price);
      return {
        id: item.id,
        product,
        quantity: 1,
        price: product.price,
        subtotal: price.toFixed(2),
        available,
        unavailableReason: available ? null : "Товар уже недоступен для онлайн-заказа"
      };
    });
    const total = items.reduce((sum, item) => sum + Number(item.subtotal), 0);
    return { id: cart.id, items, total: total.toFixed(2), count: items.length };
  }

  async get(userId: string) {
    return this.toDto(await this.ensureCart(userId));
  }

  async add(userId: string, productId: string) {
    const product = await this.prisma.product.findUnique({ where: { id: productId } });
    if (!product) throw new NotFoundException("Товар не найден");
    if (product.status !== "IN_STOCK") throw new BadRequestException("В корзину можно добавить только товар в наличии");
    if (!product.price) throw new BadRequestException("Товар без цены нельзя оплатить онлайн");
    const cart = await this.ensureCart(userId);
    await this.prisma.cartItem.upsert({
      where: { cartId_productId: { cartId: cart.id, productId } },
      create: { cartId: cart.id, productId, quantity: 1 },
      update: { quantity: 1 }
    });
    return this.get(userId);
  }

  async remove(userId: string, itemId: string) {
    const cart = await this.ensureCart(userId);
    await this.prisma.cartItem.deleteMany({ where: { id: itemId, cartId: cart.id } });
    return this.get(userId);
  }

  async clear(userId: string) {
    const cart = await this.ensureCart(userId);
    await this.prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
    return this.get(userId);
  }
}
