import { ORDERSTATUS } from 'src/helpers/order-status.enum';
import { IsEnum, IsNotEmpty } from 'class-validator';

export class UpdateOrderDto {
  @IsNotEmpty()
  @IsEnum(ORDERSTATUS)
  orderStatus: ORDERSTATUS;
}
