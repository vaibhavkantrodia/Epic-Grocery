import { Controller, Get, Post, Body, Param, Delete, ParseIntPipe, Put, UseGuards, Query } from '@nestjs/common';
import { OfferService } from './offer.service';
import { CreateOfferDto } from './dto/create-offer.dto';
import { UpdateOfferDto } from './dto/update-offer.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import CreateResponseDto from 'src/utils/create-respons.dto';
import UpdateResponseDto from 'src/utils/update-response.dto';
import DeleteResponseDto from 'src/utils/delete-response.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorator/roles.decorator';
import { ROLE } from 'src/helpers/role.enum';

@ApiBearerAuth()
@ApiTags('offers')
@Controller('offers')
export class OfferController {
  constructor(private readonly offerService: OfferService) { }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(ROLE.ADMIN)
  @Post('/create')
  async create(@Body() createOfferDto: CreateOfferDto): Promise<CreateResponseDto> {
    return this.offerService.create(createOfferDto);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(ROLE.ADMIN)
  @Get()
  async find(@Query('page') page: number, @Query('search') search: string): Promise<CreateResponseDto> {
    return this.offerService.find(page, search);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(ROLE.ADMIN)
  @Put(':id')
  async update(@Param('id') id: number, @Body() updateOffer: UpdateOfferDto): Promise<UpdateResponseDto> {
    return this.offerService.update(id, updateOffer);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(ROLE.ADMIN)
  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number): Promise<DeleteResponseDto> {
    return this.offerService.remove(id);
  }
}