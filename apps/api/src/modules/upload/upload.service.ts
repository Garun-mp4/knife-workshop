import { BadRequestException, Injectable } from "@nestjs/common";
import sharp from "sharp";

const allowed = (process.env.ALLOWED_IMAGE_MIME_TYPES ?? "image/jpeg,image/png,image/webp").split(",");

@Injectable()
export class UploadService {
  async validateImage(file: Express.Multer.File) {
    if (!file) throw new BadRequestException("Файл обязателен");
    const maxMb = Number(process.env.MAX_IMAGE_SIZE_MB ?? 8);
    if (file.size > maxMb * 1024 * 1024) throw new BadRequestException(`Файл больше ${maxMb} MB`);
    const { fileTypeFromBuffer } = await import("file-type");
    const detected = await fileTypeFromBuffer(file.buffer);
    if (!detected || !allowed.includes(detected.mime)) throw new BadRequestException("Разрешены только JPG, PNG и WebP изображения");
    const meta = await sharp(file.buffer).metadata().catch(() => null);
    if (!meta?.width || !meta.height) throw new BadRequestException("Изображение повреждено или не читается");
    return { mime: detected.mime, ext: detected.ext === "jpg" ? "jpg" : detected.ext, width: meta.width, height: meta.height };
  }
  async variants(buffer: Buffer) {
    const large = await sharp(buffer).rotate().resize({ width: 1600, height: 1600, fit: "inside", withoutEnlargement: true }).webp({ quality: 86 }).toBuffer();
    const medium = await sharp(buffer).rotate().resize({ width: 900, height: 900, fit: "inside", withoutEnlargement: true }).webp({ quality: 84 }).toBuffer();
    const thumb = await sharp(buffer).rotate().resize({ width: 400, height: 400, fit: "inside", withoutEnlargement: true }).webp({ quality: 80 }).toBuffer();
    const placeholder = await sharp(buffer).rotate().resize({ width: 32, height: 32, fit: "inside", withoutEnlargement: true }).blur(6).webp({ quality: 40 }).toBuffer();
    return { large, medium, thumb, placeholder };
  }
}
