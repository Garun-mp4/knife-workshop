import { Module } from "@nestjs/common";
import { PrismaModule } from "../../prisma/prisma.module";
import { AdminOrdersController, AccountOrdersController, YooKassaWebhookController } from "./orders.controller";
import { OrdersService } from "./orders.service";
import { YooKassaService } from "./yookassa.service";

@Module({
  imports: [PrismaModule],
  controllers: [AccountOrdersController, AdminOrdersController, YooKassaWebhookController],
  providers: [OrdersService, YooKassaService],
  exports: [OrdersService]
})
export class OrdersModule {}
