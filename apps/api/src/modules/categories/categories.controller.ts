import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../../common/jwt-auth.guard";
import { StaffOnly } from "../../common/roles.decorator";
import { RolesGuard } from "../../common/roles.guard";
import { CategoriesService } from "./categories.service";
import { CreateCategoryDto, UpdateCategoryDto } from "./dto/category.dto";

@Controller("public/categories")
export class PublicCategoriesController { constructor(private readonly service: CategoriesService) {} @Get() list() { return this.service.publicList(); } }

@Controller("admin/categories")
@UseGuards(JwtAuthGuard, RolesGuard)
@StaffOnly()
export class CategoriesController {
  constructor(private readonly service: CategoriesService) {}
  @Get() list() { return this.service.adminList(); }
  @Post() create(@Body() dto: CreateCategoryDto) { return this.service.create(dto); }
  @Get(":id") get(@Param("id") id: string) { return this.service.find(id); }
  @Patch("reorder") reorder(@Body() body: { items: Array<{ id: string; sortOrder: number }> }) { return this.service.reorder(body.items ?? []); }
  @Patch(":id") update(@Param("id") id: string, @Body() dto: UpdateCategoryDto) { return this.service.update(id, dto); }
  @Delete(":id") delete(@Param("id") id: string) { return this.service.delete(id); }
}
