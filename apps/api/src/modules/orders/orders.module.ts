import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { PrismaModule } from "../../prisma/prisma.module";
import { AdminOrdersController, AccountOrdersController, YooKassaWebhookController } from "./orders.controller";
import { OrdersService } from "./orders.service";
import { YooKassaService } from "./yookassa.service";

@Module({
  imports: [PrismaModule, JwtModule.register({})],
  controllers: [AccountOrdersController, AdminOrdersController, YooKassaWebhookController],
  providers: [OrdersService, YooKassaService],
  exports: [OrdersService]
})
export class OrdersModule {}
