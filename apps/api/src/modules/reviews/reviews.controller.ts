import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from "@nestjs/common";
import { CurrentUser } from "../../common/current-user.decorator";
import { JwtAuthGuard } from "../../common/jwt-auth.guard";
import { StaffOnly } from "../../common/roles.decorator";
import { RolesGuard } from "../../common/roles.guard";
import { CreateAccountReviewDto, ReviewDto } from "./dto/review.dto";
import { ReviewsService } from "./reviews.service";

@Controller("public/reviews")
export class PublicReviewsController {
  constructor(private readonly service: ReviewsService) {}

  @Get()
  list(@Query("productId") productId?: string) {
    return this.service.publicList(productId);
  }
}

@Controller("account/reviews")
@UseGuards(JwtAuthGuard)
export class AccountReviewsController {
  constructor(private readonly service: ReviewsService) {}

  @Get("eligible")
  eligible(@CurrentUser() user: any) {
    return this.service.eligibleForUser(user.id);
  }

  @Post()
  create(@CurrentUser() user: any, @Body() dto: CreateAccountReviewDto) {
    return this.service.createForUser(user.id, dto);
  }
}

@Controller("admin/reviews")
@UseGuards(JwtAuthGuard, RolesGuard)
@StaffOnly()
export class ReviewsController {
  constructor(private readonly service: ReviewsService) {}

  @Get()
  list() {
    return this.service.adminList();
  }

  @Post()
  create(@Body() dto: ReviewDto) {
    return this.service.create(dto);
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() dto: ReviewDto) {
    return this.service.update(id, dto);
  }

  @Delete(":id")
  delete(@Param("id") id: string) {
    return this.service.delete(id);
  }
}
