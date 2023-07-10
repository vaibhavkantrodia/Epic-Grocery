import { PartialType } from '@nestjs/mapped-types';
import { CreateOfferDto } from './create-offer.dto';
import { IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateOfferDto extends PartialType(CreateOfferDto) {

    @IsOptional()
    @ApiProperty()
    is_active: boolean
}
