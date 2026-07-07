import { Body, Controller, Delete, Get, Param, Post, UseGuards } from "@nestjs/common";
import { CurrentUser } from "../../common/current-user.decorator";
import { JwtAuthGuard } from "../../common/jwt-auth.guard";
import { CartService } from "./cart.service";
import { AddCartItemDto } from "./dto/cart.dto";

@Controller("account/cart")
@UseGuards(JwtAuthGuard)
export class CartController {
  constructor(private readonly service: CartService) {}

  @Get()
  get(@CurrentUser() user: any) {
    return this.service.get(user.id);
  }

  @Post("items")
  add(@CurrentUser() user: any, @Body() dto: AddCartItemDto) {
    return this.service.add(user.id, dto.productId);
  }

  @Delete("items/:itemId")
  remove(@CurrentUser() user: any, @Param("itemId") itemId: string) {
    return this.service.remove(user.id, itemId);
  }

  @Delete()
  clear(@CurrentUser() user: any) {
    return this.service.clear(user.id);
  }
}
