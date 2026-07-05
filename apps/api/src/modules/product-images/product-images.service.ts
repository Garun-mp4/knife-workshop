import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { randomUUID } from "crypto";
import { PrismaService } from "../../prisma/prisma.service";
import { CurrentUserPayload } from "../../common/current-user.decorator";
import { AuditLogService } from "../audit-log/audit-log.service";
import { StorageService } from "../storage/storage.service";
import { UploadService } from "../upload/upload.service";
import { UploadProductImageDto, UpdateProductImageDto } from "./dto/product-image.dto";

@Injectable()
export class ProductImagesService {
  constructor(private readonly prisma: PrismaService, private readonly storage: StorageService, private readonly upload: UploadService, private readonly audit: AuditLogService) {}

  async uploadImage(productId: string, file: Express.Multer.File, dto: UploadProductImageDto, user?: CurrentUserPayload) {
    const product = await this.prisma.product.findUnique({ where: { id: productId }, include: { images: true } });
    if (!product) throw new NotFoundException("Товар не найден");
    const detected = await this.upload.validateImage(file);
    const imageId = randomUUID();
    const base = `products/${productId}/${imageId}`;
    const originalKey = `${base}/original.${detected.ext}`;
    const largeKey = `${base}/large.webp`;
    const mediumKey = `${base}/medium.webp`;
    const thumbKey = `${base}/thumb.webp`;
    const placeholderKey = `${base}/placeholder.webp`;
    const createdKeys: string[] = [];
    try {
      const variants = await this.upload.variants(file.buffer);
      await this.storage.put(originalKey, file.buffer, detected.mime); createdKeys.push(originalKey);
      await this.storage.put(largeKey, variants.large, "image/webp"); createdKeys.push(largeKey);
      await this.storage.put(mediumKey, variants.medium, "image/webp"); createdKeys.push(mediumKey);
      await this.storage.put(thumbKey, variants.thumb, "image/webp"); createdKeys.push(thumbKey);
      await this.storage.put(placeholderKey, variants.placeholder, "image/webp"); createdKeys.push(placeholderKey);
      const makeMain = dto.isMain || product.images.length === 0;
      const image = await this.prisma.$transaction(async (tx) => {
        if (makeMain) await tx.productImage.updateMany({ where: { productId }, data: { isMain: false } });
        return tx.productImage.create({ data: { id: imageId, productId, originalName: file.originalname, alt: dto.alt, bucket: this.storage.bucket, originalKey, largeKey, mediumKey, thumbKey, placeholderKey, mimeType: detected.mime, sizeBytes: file.size, width: detected.width, height: detected.height, isMain: makeMain, sortOrder: dto.sortOrder ?? product.images.length } });
      });
      await this.audit.log({ userId: user?.id, action: "UPLOAD_IMAGE", entity: "ProductImage", entityId: image.id, metadata: { productId } });
      return image;
    } catch (error) {
      await this.storage.deleteMany(createdKeys).catch(() => undefined);
      throw error;
    }
  }

  async update(productId: string, imageId: string, dto: UpdateProductImageDto) {
    const image = await this.prisma.productImage.findUnique({ where: { id: imageId } });
    if (!image || image.productId !== productId) throw new NotFoundException("Фото не найдено");
    return this.prisma.productImage.update({ where: { id: imageId }, data: dto });
  }

  async setMain(productId: string, imageId: string) {
    const image = await this.prisma.productImage.findUnique({ where: { id: imageId } });
    if (!image || image.productId !== productId) throw new NotFoundException("Фото не найдено");
    await this.prisma.$transaction([
      this.prisma.productImage.updateMany({ where: { productId }, data: { isMain: false } }),
      this.prisma.productImage.update({ where: { id: imageId }, data: { isMain: true } })
    ]);
    return this.prisma.productImage.findUnique({ where: { id: imageId } });
  }

  async reorder(productId: string, items: Array<{ id: string; sortOrder: number }>) {
    return Promise.all(items.map((item) => this.prisma.productImage.updateMany({ where: { id: item.id, productId }, data: { sortOrder: item.sortOrder } })));
  }

  async delete(productId: string, imageId: string, user?: CurrentUserPayload) {
    const image = await this.prisma.productImage.findUnique({ where: { id: imageId } });
    if (!image || image.productId !== productId) throw new NotFoundException("Фото не найдено");
    const keys = [image.originalKey, image.largeKey, image.mediumKey, image.thumbKey, image.placeholderKey].filter(Boolean) as string[];
    await this.prisma.productImage.update({ where: { id: imageId }, data: { pendingDelete: true } });
    try {
      await this.storage.deleteMany(keys);
    } catch (e) {
      throw new BadRequestException("Не удалось удалить файлы из хранилища. Фото помечено для повторного удаления worker-ом.");
    }
    await this.prisma.productImage.delete({ where: { id: imageId } });
    if (image.isMain) {
      const next = await this.prisma.productImage.findFirst({ where: { productId }, orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }] });
      if (next) await this.prisma.productImage.update({ where: { id: next.id }, data: { isMain: true } });
    }
    await this.audit.log({ userId: user?.id, action: "DELETE_IMAGE", entity: "ProductImage", entityId: imageId, metadata: { productId, keys } });
    return { deleted: true };
  }
}
