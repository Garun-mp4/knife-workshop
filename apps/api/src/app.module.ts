import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { BullModule } from "@nestjs/bullmq";
import { ThrottlerModule } from "@nestjs/throttler";
import { PrismaModule } from "./prisma/prisma.module";
import { AuthModule } from "./modules/auth/auth.module";
import { UsersModule } from "./modules/users/users.module";
import { ProductsModule } from "./modules/products/products.module";
import { CategoriesModule } from "./modules/categories/categories.module";
import { ProductImagesModule } from "./modules/product-images/product-images.module";
import { LeadsModule } from "./modules/leads/leads.module";
import { ReviewsModule } from "./modules/reviews/reviews.module";
import { PagesModule } from "./modules/pages/pages.module";
import { SettingsModule } from "./modules/settings/settings.module";
import { StorageModule } from "./modules/storage/storage.module";
import { UploadModule } from "./modules/upload/upload.module";
import { NotificationsModule } from "./modules/notifications/notifications.module";
import { HealthModule } from "./modules/health/health.module";
import { AuditLogModule } from "./modules/audit-log/audit-log.module";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ThrottlerModule.forRoot([{ ttl: 60_000, limit: 30 }]),
    BullModule.forRoot({ connection: { host: process.env.REDIS_HOST ?? "redis", port: Number(process.env.REDIS_PORT ?? 6379) } }),
    PrismaModule,
    AuthModule,
    UsersModule,
    ProductsModule,
    CategoriesModule,
    ProductImagesModule,
    LeadsModule,
    ReviewsModule,
    PagesModule,
    SettingsModule,
    StorageModule,
    UploadModule,
    NotificationsModule,
    HealthModule,
    AuditLogModule
  ]
})
export class AppModule {}
