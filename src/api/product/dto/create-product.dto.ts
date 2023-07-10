import { ApiProperty } from "@nestjs/swagger"
import { Type } from "class-transformer"
import { IsDecimal, IsNotEmpty, IsString, } from "class-validator"

export class CreateProductDto {

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    name: string

    @IsNotEmpty()
    @IsString()
    description: string

    @ApiProperty()
    image_url: string[]

    @ApiProperty()
    @IsNotEmpty()
    @IsDecimal()
    price: number

    @ApiProperty()
    @IsNotEmpty()
    qty: number

    @ApiProperty()
    @ApiProperty()
    @IsNotEmpty()
    @Type(() => Number)
    category_id: any
}
