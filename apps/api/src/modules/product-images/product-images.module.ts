import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { ProductImagesController } from "./product-images.controller";
import { ProductImagesService } from "./product-images.service";
import { StorageModule } from "../storage/storage.module";
import { UploadModule } from "../upload/upload.module";
import { AuditLogModule } from "../audit-log/audit-log.module";
@Module({ imports: [JwtModule.register({}), StorageModule, UploadModule, AuditLogModule], controllers: [ProductImagesController], providers: [ProductImagesService], exports: [ProductImagesService] })
export class ProductImagesModule {}
