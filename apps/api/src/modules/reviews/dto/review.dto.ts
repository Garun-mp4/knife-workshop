import { IsBoolean, IsInt, IsOptional, IsString, Max, Min } from "class-validator";
export class ReviewDto {
  @IsOptional() @IsString() clientName?: string;
  @IsOptional() @IsString() city?: string;
  @IsOptional() @IsString() text?: string;
  @IsOptional() @IsInt() @Min(1) @Max(5) rating?: number;
  @IsOptional() @IsString() imageUrl?: string;
  @IsOptional() @IsBoolean() isPublished?: boolean;
  @IsOptional() @IsInt() sortOrder?: number;
}

export class CreateAccountReviewDto {
  @IsString() orderItemId!: string;
  @IsString() text!: string;
  @IsOptional() @IsInt() @Min(1) @Max(5) rating?: number;
}
