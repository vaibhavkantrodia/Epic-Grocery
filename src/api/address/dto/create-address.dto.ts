import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateAddressDto {
  @IsOptional()
  name?: string;

  @IsOptional()
  phone?: number;

  @IsNotEmpty()
  addressline: string;

  @IsNotEmpty()
  city: string;

  @IsNotEmpty()
  state: string;

  @IsNotEmpty()
  pincode: number;
}
