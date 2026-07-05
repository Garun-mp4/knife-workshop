import { IsBoolean, IsInt, IsOptional, IsString, Max, Min } from "class-validator";
export class ReviewDto {
  @IsString() clientName!: string;
  @IsOptional() @IsString() city?: string;
  @IsString() text!: string;
  @IsOptional() @IsInt() @Min(1) @Max(5) rating?: number;
  @IsOptional() @IsString() imageUrl?: string;
  @IsOptional() @IsBoolean() isPublished?: boolean;
  @IsOptional() @IsInt() sortOrder?: number;
}
