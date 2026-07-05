import { Transform } from "class-transformer";
import { IsBoolean, IsInt, IsOptional, IsString } from "class-validator";
export class UploadProductImageDto {
  @IsOptional() @IsString() alt?: string;
  @IsOptional() @Transform(({ value }) => value === "true" || value === true) @IsBoolean() isMain?: boolean;
  @IsOptional() @Transform(({ value }) => Number(value)) @IsInt() sortOrder?: number;
}
export class UpdateProductImageDto {
  @IsOptional() @IsString() alt?: string;
  @IsOptional() @IsInt() sortOrder?: number;
}
