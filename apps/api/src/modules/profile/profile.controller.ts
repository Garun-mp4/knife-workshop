import { Body, Controller, Get, Patch, Post, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { memoryStorage } from "multer";
import { CurrentUser } from "../../common/current-user.decorator";
import { JwtAuthGuard } from "../../common/jwt-auth.guard";
import { UpdateProfileDto } from "./dto/profile.dto";
import { ProfileService } from "./profile.service";

@Controller("account/profile")
@UseGuards(JwtAuthGuard)
export class ProfileController {
  constructor(private readonly service: ProfileService) {}

  @Get()
  get(@CurrentUser() user: any) {
    return this.service.get(user.id);
  }

  @Patch()
  update(@CurrentUser() user: any, @Body() dto: UpdateProfileDto) {
    return this.service.update(user.id, dto);
  }

  @Post("avatar")
  @UseInterceptors(FileInterceptor("file", { storage: memoryStorage(), limits: { fileSize: Number(process.env.MAX_IMAGE_SIZE_MB ?? 8) * 1024 * 1024 } }))
  avatar(@CurrentUser() user: any, @UploadedFile() file: Express.Multer.File) {
    return this.service.uploadAvatar(user.id, file);
  }
}
