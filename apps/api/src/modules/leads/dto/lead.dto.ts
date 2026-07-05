import { IsBoolean, IsEmail, IsEnum, IsOptional, IsString, ValidateIf } from "class-validator";
import { LeadStatus, LeadType } from "@prisma/client";
export class CreateLeadDto {
  @IsEnum(LeadType) type!: LeadType;
  @IsOptional() @IsString() productId?: string;
  @IsString() name!: string;
  @IsOptional() @IsString() phone?: string;
  @IsOptional() @IsEmail() email?: string;
  @IsOptional() @IsString() messenger?: string;
  @IsOptional() @IsString() city?: string;
  @IsOptional() @IsString() budget?: string;
  @IsOptional() @IsString() message?: string;
  @IsBoolean() consent!: boolean;
  @IsOptional() @IsString() sourceUrl?: string;
  @IsOptional() @IsString() utmSource?: string;
  @IsOptional() @IsString() utmMedium?: string;
  @IsOptional() @IsString() utmCampaign?: string;
  @IsOptional() @IsString() utmContent?: string;
  @IsOptional() @IsString() utmTerm?: string;
}
export class UpdateLeadDto {
  @IsOptional() @IsEnum(LeadStatus) status?: LeadStatus;
  @IsOptional() @IsString() message?: string;
}
