import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { PageDto } from "./dto/page.dto";
@Injectable()
export class PagesService {
  constructor(private readonly prisma: PrismaService) {}
  async publicBySlug(slug: string) { const page = await this.prisma.page.findFirst({ where: { slug, status: "PUBLISHED" } }); if (!page) throw new NotFoundException("Страница не найдена"); return page; }
  list() { return this.prisma.page.findMany({ orderBy: { updatedAt: "desc" } }); }
  create(dto: PageDto) { return this.prisma.page.create({ data: dto }); }
  async update(id: string, dto: Partial<PageDto>) { return this.prisma.page.update({ where: { id }, data: dto }); }
  async delete(id: string) { return this.prisma.page.delete({ where: { id } }); }
}
