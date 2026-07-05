import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { ProductStatus, Prisma } from "@prisma/client";
import slugify from "slugify";
import { PrismaService } from "../../prisma/prisma.service";
import { toPublicProduct } from "../../common/to-public-product";
import { StorageService } from "../storage/storage.service";
import { CreateProductDto, UpdateProductDto } from "./dto/product.dto";

const publicStatuses: ProductStatus[] = ["IN_STOCK", "MADE_TO_ORDER", "SOLD", "COMING_SOON"];
const include = { category: true, images: true } satisfies Prisma.ProductInclude;

@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService, private readonly storage: StorageService) {}
  private slug(value: string) { return slugify(value, { lower: true, strict: true, locale: "ru" }); }
  private data(dto: CreateProductDto | UpdateProductDto) { return { ...dto, slug: dto.slug || (dto.title ? this.slug(dto.title) : undefined) } as Prisma.ProductUncheckedCreateInput; }

  async publicList(query: Record<string, string | undefined>) {
    const where: Prisma.ProductWhereInput = { status: { in: publicStatuses } };
    if (query.category) where.category = { slug: query.category };
    if (query.status && publicStatuses.includes(query.status as ProductStatus)) where.status = query.status as ProductStatus;
    if (query.search) where.OR = [{ title: { contains: query.search, mode: "insensitive" } }, { description: { contains: query.search, mode: "insensitive" } }, { steel: { contains: query.search, mode: "insensitive" } }];
    if (query.isFeatured === "true") where.isFeatured = true;
    if (query.minPrice || query.maxPrice) where.price = { gte: query.minPrice, lte: query.maxPrice } as any;
    const page = Math.max(Number(query.page ?? 1), 1);
    const limit = Math.min(Math.max(Number(query.limit ?? 12), 1), 50);
    const orderBy = query.sort === "price-asc" ? [{ price: "asc" as const }] : query.sort === "price-desc" ? [{ price: "desc" as const }] : query.sort === "featured" ? [{ isFeatured: "desc" as const }, { sortOrder: "asc" as const }] : [{ status: "asc" as const }, { createdAt: "desc" as const }];
    const [items, total] = await this.prisma.$transaction([
      this.prisma.product.findMany({ where, include, skip: (page - 1) * limit, take: limit, orderBy }),
      this.prisma.product.count({ where })
    ]);
    return { items: items.map(toPublicProduct), meta: { page, limit, total, pages: Math.ceil(total / limit) } };
  }

  async featured() {
    const items = await this.prisma.product.findMany({ where: { status: { in: publicStatuses }, isFeatured: true }, include, orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }], take: 8 });
    return items.map(toPublicProduct);
  }

  async bySlug(slug: string) {
    const product = await this.prisma.product.findFirst({ where: { slug, status: { in: publicStatuses } }, include });
    if (!product) throw new NotFoundException("Товар не найден");
    return toPublicProduct(product);
  }

  async byCategory(categorySlug: string, query: Record<string, string | undefined>) { return this.publicList({ ...query, category: categorySlug }); }

  adminList(query: Record<string, string | undefined>) {
    const where: Prisma.ProductWhereInput = {};
    if (query.categoryId) where.categoryId = query.categoryId;
    if (query.status) where.status = query.status as ProductStatus;
    if (query.search) where.OR = [{ title: { contains: query.search, mode: "insensitive" } }, { slug: { contains: query.search, mode: "insensitive" } }];
    return this.prisma.product.findMany({ where, include, orderBy: [{ updatedAt: "desc" }] }).then((items) => items.map(toPublicProduct));
  }

  async find(id: string) { const product = await this.prisma.product.findUnique({ where: { id }, include }); if (!product) throw new NotFoundException("Товар не найден"); return toPublicProduct(product); }
  create(dto: CreateProductDto) { return this.prisma.product.create({ data: this.data(dto), include }).then(toPublicProduct); }
  async update(id: string, dto: UpdateProductDto) { await this.find(id); return this.prisma.product.update({ where: { id }, data: this.data(dto) as any, include }).then(toPublicProduct); }
  async setStatus(id: string, status: ProductStatus) { await this.find(id); return this.prisma.product.update({ where: { id }, data: { status }, include }).then(toPublicProduct); }
  async setFeatured(id: string, isFeatured: boolean) { await this.find(id); return this.prisma.product.update({ where: { id }, data: { isFeatured }, include }).then(toPublicProduct); }
  async setSort(id: string, sortOrder: number) { await this.find(id); return this.prisma.product.update({ where: { id }, data: { sortOrder }, include }).then(toPublicProduct); }

  async delete(id: string, hard = false, role?: string) {
    const product = await this.prisma.product.findUnique({ where: { id }, include: { images: true } });
    if (!product) throw new NotFoundException("Товар не найден");
    if (!hard) return this.prisma.product.update({ where: { id }, data: { status: "ARCHIVED" }, include }).then(toPublicProduct);
    if (role !== "OWNER") throw new BadRequestException("Hard delete доступен только владельцу");
    for (const image of product.images) await this.storage.deleteMany([image.originalKey, image.largeKey, image.mediumKey, image.thumbKey, image.placeholderKey].filter(Boolean) as string[]);
    return this.prisma.product.delete({ where: { id } });
  }
}
