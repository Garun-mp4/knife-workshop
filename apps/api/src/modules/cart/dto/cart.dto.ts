import { IsString } from "class-validator";

export class AddCartItemDto {
  @IsString() productId!: string;
}
