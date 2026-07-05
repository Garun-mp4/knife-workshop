import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../../common/jwt-auth.guard";
import { StaffOnly } from "../../common/roles.decorator";
import { RolesGuard } from "../../common/roles.guard";
import { ReviewDto } from "./dto/review.dto";
import { ReviewsService } from "./reviews.service";
@Controller("public/reviews")
export class PublicReviewsController { constructor(private readonly service: ReviewsService) {} @Get() list() { return this.service.publicList(); } }
@Controller("admin/reviews")
@UseGuards(JwtAuthGuard, RolesGuard)
@StaffOnly()
export class ReviewsController {
  constructor(private readonly service: ReviewsService) {}
  @Get() list() { return this.service.adminList(); }
  @Post() create(@Body() dto: ReviewDto) { return this.service.create(dto); }
  @Patch(":id") update(@Param("id") id: string, @Body() dto: ReviewDto) { return this.service.update(id, dto); }
  @Delete(":id") delete(@Param("id") id: string) { return this.service.delete(id); }
}
