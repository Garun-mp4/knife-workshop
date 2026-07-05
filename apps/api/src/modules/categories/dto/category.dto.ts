import { IsBoolean, IsInt, IsOptional, IsString, MinLength } from "class-validator";
export class CreateCategoryDto {
  @IsString() @MinLength(2) name!: string;
  @IsOptional() @IsString() slug?: string;
  @IsOptional() @IsString() description?: string;
  @IsOptional() @IsInt() sortOrder?: number;
  @IsOptional() @IsBoolean() isActive?: boolean;
}
export class UpdateCategoryDto extends CreateCategoryDto {}
