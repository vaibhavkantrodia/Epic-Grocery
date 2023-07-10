import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, Max, Min, } from "class-validator";
import { Category } from "src/api/category/entities/category.entity";
import { Product } from "src/api/product/entities/product.entity";

export class CreateOfferDto {

    @IsNotEmpty()
    @ApiProperty()
    @IsNotEmpty()
    category: Category;

    @IsNotEmpty()
    @ApiProperty()
    @IsNotEmpty()
    product: Product;

    @IsNotEmpty()
    @ApiProperty()
    @IsNotEmpty()
    @Min(0)
    @Max(100)
    discount_percentage: number

    @IsNotEmpty()
    @ApiProperty({})
    start_date: Date

    @IsNotEmpty()
    @ApiProperty()
    end_date: Date
}
