import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../../common/jwt-auth.guard";
import { StaffOnly } from "../../common/roles.decorator";
import { RolesGuard } from "../../common/roles.guard";
import { PageDto } from "./dto/page.dto";
import { PagesService } from "./pages.service";
@Controller("public/pages")
export class PublicPagesController { constructor(private readonly service: PagesService) {} @Get(":slug") get(@Param("slug") slug: string) { return this.service.publicBySlug(slug); } }
@Controller("admin/pages")
@UseGuards(JwtAuthGuard, RolesGuard)
@StaffOnly()
export class PagesController {
  constructor(private readonly service: PagesService) {}
  @Get() list() { return this.service.list(); }
  @Post() create(@Body() dto: PageDto) { return this.service.create(dto); }
  @Patch(":id") update(@Param("id") id: string, @Body() dto: Partial<PageDto>) { return this.service.update(id, dto); }
  @Delete(":id") delete(@Param("id") id: string) { return this.service.delete(id); }
}
