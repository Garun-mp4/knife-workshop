import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { CategoriesController, PublicCategoriesController } from "./categories.controller";
import { CategoriesService } from "./categories.service";
import { AuditLogModule } from "../audit-log/audit-log.module";
@Module({ imports: [JwtModule.register({}), AuditLogModule], controllers: [CategoriesController, PublicCategoriesController], providers: [CategoriesService], exports: [CategoriesService] })
export class CategoriesModule {}
