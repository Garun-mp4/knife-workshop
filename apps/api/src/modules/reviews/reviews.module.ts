import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { AccountReviewsController, ReviewsController, PublicReviewsController } from "./reviews.controller";
import { ReviewsService } from "./reviews.service";
@Module({ imports: [JwtModule.register({})], controllers: [ReviewsController, PublicReviewsController, AccountReviewsController], providers: [ReviewsService] })
export class ReviewsModule {}
