import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @IsEmail()
  @ApiProperty({ example: 'xyz@gmail.com' })
  @IsNotEmpty()
  email: string;

  @IsString()
  @ApiProperty({ example: '********' })
  @IsNotEmpty()
  password: string;
}
