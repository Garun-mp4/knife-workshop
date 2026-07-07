import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { CreateAccountReviewDto, ReviewDto } from "./dto/review.dto";

@Injectable()
export class ReviewsService {
  constructor(private readonly prisma: PrismaService) {}

  publicList(productId?: string) {
    return this.prisma.review.findMany({
      where: { isPublished: true, ...(productId ? { productId } : {}) },
      include: { product: { select: { id: true, title: true, slug: true } } },
      orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }]
    });
  }

  adminList() {
    return this.prisma.review.findMany({
      include: {
        product: { select: { id: true, title: true, slug: true } },
        user: { select: { id: true, name: true, email: true } },
        orderItem: true
      },
      orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }]
    });
  }

  create(dto: ReviewDto) {
    if (!dto.clientName || !dto.text) throw new BadRequestException("Укажите клиента и текст отзыва");
    return this.prisma.review.create({ data: { ...dto, clientName: dto.clientName, text: dto.text } });
  }

  async update(id: string, dto: ReviewDto) {
    await this.find(id);
    return this.prisma.review.update({ where: { id }, data: dto });
  }

  async find(id: string) {
    const review = await this.prisma.review.findUnique({ where: { id } });
    if (!review) throw new NotFoundException("Отзыв не найден");
    return review;
  }

  async delete(id: string) {
    await this.find(id);
    return this.prisma.review.delete({ where: { id } });
  }

  async eligibleForUser(userId: string) {
    const items = await this.prisma.orderItem.findMany({
      where: {
        order: { userId, status: { in: ["PAID", "CONFIRMED", "READY", "SHIPPED", "COMPLETED"] } },
        productId: { not: null },
        review: null
      },
      include: { order: true },
      orderBy: { createdAt: "desc" }
    });
    return items.map((item) => ({
      id: item.id,
      orderId: item.orderId,
      title: item.title,
      productId: item.productId,
      createdAt: item.createdAt,
      orderStatus: item.order.status
    }));
  }

  async createForUser(userId: string, dto: CreateAccountReviewDto) {
    const item = await this.prisma.orderItem.findFirst({
      where: {
        id: dto.orderItemId,
        productId: { not: null },
        order: { userId, status: { in: ["PAID", "CONFIRMED", "READY", "SHIPPED", "COMPLETED"] } }
      },
      include: { order: { include: { user: true } }, review: true }
    });
    if (!item) throw new BadRequestException("Отзыв можно оставить только на оплаченный товар");
    if (item.review) throw new BadRequestException("Отзыв на этот товар уже отправлен");
    return this.prisma.review.create({
      data: {
        orderItemId: item.id,
        productId: item.productId,
        userId,
        clientName: item.order.user.name,
        city: item.order.user.city,
        text: dto.text,
        rating: dto.rating,
        isPublished: false
      }
    });
  }
}
