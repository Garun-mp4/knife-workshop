import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from "@nestjs/common";
import { ProductStatus } from "@prisma/client";
import { CurrentUser } from "../../common/current-user.decorator";
import { JwtAuthGuard } from "../../common/jwt-auth.guard";
import { RolesGuard } from "../../common/roles.guard";
import { CreateProductDto, UpdateProductDto } from "./dto/product.dto";
import { ProductsService } from "./products.service";

@Controller("public/products")
export class PublicProductsController {
  constructor(private readonly service: ProductsService) {}
  @Get() list(@Query() query: Record<string, string>) { return this.service.publicList(query); }
  @Get("featured") featured() { return this.service.featured(); }
  @Get(":slug") bySlug(@Param("slug") slug: string) { return this.service.bySlug(slug); }
}

@Controller("public/categories/:slug/products")
export class PublicCategoryProductsController {
  constructor(private readonly service: ProductsService) {}
  @Get() list(@Param("slug") slug: string, @Query() query: Record<string, string>) { return this.service.byCategory(slug, query); }
}

@Controller("admin/products")
@UseGuards(JwtAuthGuard, RolesGuard)
export class ProductsController {
  constructor(private readonly service: ProductsService) {}
  @Get() list(@Query() query: Record<string, string>) { return this.service.adminList(query); }
  @Post() create(@Body() dto: CreateProductDto) { return this.service.create(dto); }
  @Get(":id") get(@Param("id") id: string) { return this.service.find(id); }
  @Patch(":id") update(@Param("id") id: string, @Body() dto: UpdateProductDto) { return this.service.update(id, dto); }
  @Delete(":id") delete(@Param("id") id: string, @Query("hard") hard: string, @CurrentUser() user: any) { return this.service.delete(id, hard === "true", user?.role); }
  @Patch(":id/status") status(@Param("id") id: string, @Body() body: { status: ProductStatus }) { return this.service.setStatus(id, body.status); }
  @Patch(":id/featured") featured(@Param("id") id: string, @Body() body: { isFeatured: boolean }) { return this.service.setFeatured(id, body.isFeatured); }
  @Patch(":id/sort") sort(@Param("id") id: string, @Body() body: { sortOrder: number }) { return this.service.setSort(id, body.sortOrder); }
}
