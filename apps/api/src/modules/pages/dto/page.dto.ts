import { IsEnum, IsOptional, IsString } from "class-validator";
import { PageStatus } from "@prisma/client";
export class PageDto {
  @IsString() title!: string;
  @IsString() slug!: string;
  @IsString() content!: string;
  @IsOptional() @IsEnum(PageStatus) status?: PageStatus;
  @IsOptional() @IsString() seoTitle?: string;
  @IsOptional() @IsString() seoDescription?: string;
}
