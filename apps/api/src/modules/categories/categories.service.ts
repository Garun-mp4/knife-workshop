import { Injectable, NotFoundException } from "@nestjs/common";
import slugify from "slugify";
import { PrismaService } from "../../prisma/prisma.service";
import { CreateCategoryDto, UpdateCategoryDto } from "./dto/category.dto";
@Injectable()
export class CategoriesService {
  constructor(private readonly prisma: PrismaService) {}
  private slug(value: string) { return slugify(value, { lower: true, strict: true, locale: "ru" }); }
  publicList() { return this.prisma.category.findMany({ where: { isActive: true }, orderBy: [{ sortOrder: "asc" }, { name: "asc" }] }); }
  adminList() { return this.prisma.category.findMany({ orderBy: [{ sortOrder: "asc" }, { name: "asc" }], include: { _count: { select: { products: true } } } }); }
  async create(dto: CreateCategoryDto) { return this.prisma.category.create({ data: { ...dto, slug: dto.slug || this.slug(dto.name) } }); }
  async update(id: string, dto: UpdateCategoryDto) { await this.find(id); return this.prisma.category.update({ where: { id }, data: { ...dto, slug: dto.slug || (dto.name ? this.slug(dto.name) : undefined) } }); }
  async find(id: string) { const c = await this.prisma.category.findUnique({ where: { id } }); if (!c) throw new NotFoundException("Категория не найдена"); return c; }
  async delete(id: string) { await this.find(id); return this.prisma.category.update({ where: { id }, data: { isActive: false } }); }
  async reorder(items: Array<{ id: string; sortOrder: number }>) { return Promise.all(items.map((i) => this.prisma.category.update({ where: { id: i.id }, data: { sortOrder: i.sortOrder } }))); }
}
