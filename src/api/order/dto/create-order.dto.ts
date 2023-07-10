import { IsInt, IsNotEmpty } from 'class-validator';

export class CreateOrderDto {
  @IsInt()
  @IsNotEmpty()
  address_id: number;
}
