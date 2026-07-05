import { Body, Controller, Delete, Param, Patch, Post, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { memoryStorage } from "multer";
import { CurrentUser } from "../../common/current-user.decorator";
import { JwtAuthGuard } from "../../common/jwt-auth.guard";
import { StaffOnly } from "../../common/roles.decorator";
import { RolesGuard } from "../../common/roles.guard";
import { ProductImagesService } from "./product-images.service";
import { UploadProductImageDto, UpdateProductImageDto } from "./dto/product-image.dto";

@Controller("admin/products/:productId/images")
@UseGuards(JwtAuthGuard, RolesGuard)
@StaffOnly()
export class ProductImagesController {
  constructor(private readonly service: ProductImagesService) {}
  @Post()
  @UseInterceptors(FileInterceptor("file", { storage: memoryStorage(), limits: { fileSize: Number(process.env.MAX_IMAGE_SIZE_MB ?? 8) * 1024 * 1024 } }))
  upload(@Param("productId") productId: string, @UploadedFile() file: Express.Multer.File, @Body() dto: UploadProductImageDto, @CurrentUser() user: any) {
    return this.service.uploadImage(productId, file, dto, user);
  }
  @Patch("reorder") reorder(@Param("productId") productId: string, @Body() body: { items: Array<{ id: string; sortOrder: number }> }) { return this.service.reorder(productId, body.items ?? []); }
  @Patch(":imageId") update(@Param("productId") productId: string, @Param("imageId") imageId: string, @Body() dto: UpdateProductImageDto) { return this.service.update(productId, imageId, dto); }
  @Patch(":imageId/main") main(@Param("productId") productId: string, @Param("imageId") imageId: string) { return this.service.setMain(productId, imageId); }
  @Delete(":imageId") delete(@Param("productId") productId: string, @Param("imageId") imageId: string, @CurrentUser() user: any) { return this.service.delete(productId, imageId, user); }
}
