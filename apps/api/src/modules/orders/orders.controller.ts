import { Body, Controller, Get, Param, Patch, Post, UseGuards } from "@nestjs/common";
import { CurrentUser } from "../../common/current-user.decorator";
import { JwtAuthGuard } from "../../common/jwt-auth.guard";
import { StaffOnly } from "../../common/roles.decorator";
import { RolesGuard } from "../../common/roles.guard";
import { CheckoutDto, UpdateOrderStatusDto } from "./dto/order.dto";
import { OrdersService } from "./orders.service";

@Controller("account/orders")
@UseGuards(JwtAuthGuard)
export class AccountOrdersController {
  constructor(private readonly service: OrdersService) {}

  @Get()
  list(@CurrentUser() user: any) {
    return this.service.listForUser(user.id);
  }

  @Get(":id")
  get(@CurrentUser() user: any, @Param("id") id: string) {
    return this.service.findForUser(user.id, id);
  }

  @Post("checkout")
  checkout(@CurrentUser() user: any, @Body() dto: CheckoutDto) {
    return this.service.checkout(user.id, dto);
  }
}

@Controller("payments/yookassa")
export class YooKassaWebhookController {
  constructor(private readonly service: OrdersService) {}

  @Post("webhook")
  webhook(@Body() payload: any) {
    return this.service.handleYooKassaWebhook(payload);
  }
}

@Controller("admin/orders")
@UseGuards(JwtAuthGuard, RolesGuard)
@StaffOnly()
export class AdminOrdersController {
  constructor(private readonly service: OrdersService) {}

  @Get()
  list() {
    return this.service.adminList();
  }

  @Get(":id")
  get(@Param("id") id: string) {
    return this.service.adminFind(id);
  }

  @Patch(":id/status")
  status(@Param("id") id: string, @Body() dto: UpdateOrderStatusDto) {
    return this.service.updateStatus(id, dto.status);
  }
}
