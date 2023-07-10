import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ROLE } from 'src/helpers/role.enum';

export class CreateUserDto {
  @ApiProperty({ example: "Mohammad" })
  @IsNotEmpty()
  first_name: string;

  @ApiProperty({ example: "Husain" })
  @IsNotEmpty()
  last_name: string;

  @ApiProperty({ example: "9724073520" })
  @IsNotEmpty()
  phone: number;

  @ApiProperty({ example: "Husain@gmail.com" })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({ example: "********" })
  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(12)
  @Matches(/^(?=.*\d)(?=.*[A-Z])(?=.*[a-z]).{8,12}$/, {
    message:
      'Your password must be at least 8 characters long, contain at least one number and have a mixture of uppercase and lowercase letters.',
  })
  password: string;

  @ApiProperty({ example: "true" })
  @IsBoolean()
  @IsOptional()
  is_active?: boolean;

  @IsString()
  @IsOptional()
  role?: ROLE;
}
