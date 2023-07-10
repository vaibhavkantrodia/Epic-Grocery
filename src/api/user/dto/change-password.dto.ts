import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class ChangePasswordDto {
  @ApiProperty({ example: '**********' })
  @IsNotEmpty()
  password: string;


  @ApiProperty({ example: '**********' })
  @IsNotEmpty()
  new_password: string;
}
