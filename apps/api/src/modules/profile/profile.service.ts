import { Injectable } from "@nestjs/common";
import { randomUUID } from "crypto";
import { PrismaService } from "../../prisma/prisma.service";
import { StorageService } from "../storage/storage.service";
import { UploadService } from "../upload/upload.service";
import { UpdateProfileDto } from "./dto/profile.dto";

const profileSelect = {
  id: true,
  email: true,
  name: true,
  role: true,
  phone: true,
  telegram: true,
  whatsapp: true,
  city: true,
  deliveryAddress: true,
  deliveryComment: true,
  avatarUrl: true
};

function clean(value: string | undefined) {
  const next = value?.trim();
  return next ? next : null;
}

@Injectable()
export class ProfileService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly storage: StorageService,
    private readonly upload: UploadService
  ) {}

  get(userId: string) {
    return this.prisma.user.findUniqueOrThrow({ where: { id: userId }, select: profileSelect });
  }

  update(userId: string, dto: UpdateProfileDto) {
    return this.prisma.user.update({
      where: { id: userId },
      data: {
        name: dto.name?.trim(),
        phone: clean(dto.phone),
        telegram: clean(dto.telegram),
        whatsapp: clean(dto.whatsapp),
        city: clean(dto.city),
        deliveryAddress: clean(dto.deliveryAddress),
        deliveryComment: clean(dto.deliveryComment)
      },
      select: profileSelect
    });
  }

  async uploadAvatar(userId: string, file: Express.Multer.File) {
    await this.upload.validateImage(file);
    const variants = await this.upload.variants(file.buffer);
    const key = `avatars/${userId}/${randomUUID()}.webp`;
    await this.storage.put(key, variants.thumb, "image/webp");
    return this.prisma.user.update({
      where: { id: userId },
      data: { avatarUrl: this.storage.publicUrl(key) },
      select: profileSelect
    });
  }
}
