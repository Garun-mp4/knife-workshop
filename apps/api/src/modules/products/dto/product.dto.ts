import { IsBoolean, IsEnum, IsInt, IsNumberString, IsOptional, IsString, MinLength } from "class-validator";
import { ProductStatus } from "@prisma/client";

export class CreateProductDto {
  @IsString() @MinLength(2) title!: string;
  @IsOptional() @IsString() slug?: string;
  @IsOptional() @IsString() shortDescription?: string;
  @IsOptional() @IsString() description?: string;
  @IsOptional() @IsNumberString() price?: string;
  @IsOptional() @IsNumberString() oldPrice?: string;
  @IsOptional() @IsString() pricePrefix?: string;
  @IsOptional() @IsEnum(ProductStatus) status?: ProductStatus;
  @IsOptional() @IsString() categoryId?: string;
  @IsOptional() @IsString() purpose?: string;
  @IsOptional() @IsString() steel?: string;
  @IsOptional() @IsInt() bladeLengthMm?: number;
  @IsOptional() @IsInt() totalLengthMm?: number;
  @IsOptional() @IsNumberString() spineThicknessMm?: string;
  @IsOptional() @IsString() handleMaterial?: string;
  @IsOptional() @IsString() sheathMaterial?: string;
  @IsOptional() @IsInt() weightGrams?: number;
  @IsOptional() @IsNumberString() hardnessHrc?: string;
  @IsOptional() @IsString() equipment?: string;
  @IsOptional() @IsInt() productionTimeDays?: number;
  @IsOptional() @IsBoolean() engravingAvailable?: boolean;
  @IsOptional() @IsString() certificateText?: string;
  @IsOptional() @IsString() certificateFileUrl?: string;
  @IsOptional() @IsString() seoTitle?: string;
  @IsOptional() @IsString() seoDescription?: string;
  @IsOptional() @IsInt() sortOrder?: number;
  @IsOptional() @IsBoolean() isFeatured?: boolean;
}
export class UpdateProductDto extends CreateProductDto {}
