import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { ReviewDto } from "./dto/review.dto";
@Injectable()
export class ReviewsService {
  constructor(private readonly prisma: PrismaService) {}
  publicList() { return this.prisma.review.findMany({ where: { isPublished: true }, orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }] }); }
  adminList() { return this.prisma.review.findMany({ orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }] }); }
  create(dto: ReviewDto) { return this.prisma.review.create({ data: dto }); }
  async update(id: string, dto: ReviewDto) { await this.find(id); return this.prisma.review.update({ where: { id }, data: dto }); }
  async find(id: string) { const r = await this.prisma.review.findUnique({ where: { id } }); if (!r) throw new NotFoundException("Отзыв не найден"); return r; }
  async delete(id: string) { await this.find(id); return this.prisma.review.delete({ where: { id } }); }
}
