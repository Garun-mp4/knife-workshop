import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { ProductsController, PublicProductsController, PublicCategoryProductsController } from "./products.controller";
import { ProductsService } from "./products.service";
import { AuditLogModule } from "../audit-log/audit-log.module";
import { StorageModule } from "../storage/storage.module";
@Module({ imports: [JwtModule.register({}), AuditLogModule, StorageModule], controllers: [ProductsController, PublicProductsController, PublicCategoryProductsController], providers: [ProductsService], exports: [ProductsService] })
export class ProductsModule {}
