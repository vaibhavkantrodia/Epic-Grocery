import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Put,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { AddressService } from './address.service';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import ResponseDto from 'src/utils/create-respons.dto';
import { GetUser } from '../auth/decorator/get-user.decorator';
import { User } from '../user/entities/user.entity';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorator/roles.decorator';
import { ROLE } from 'src/helpers/role.enum';
import { AuthGuard } from '@nestjs/passport';

@Controller('addresses')
export class AddressController {
  constructor(private readonly addressService: AddressService) { }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(ROLE.ADMIN, ROLE.USER)
  @Post()
  async createAddress(
    @Body() createAddressDto: CreateAddressDto,
    @GetUser() user: User,
  ): Promise<ResponseDto> {
    return this.addressService.createAddress(createAddressDto, user);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(ROLE.ADMIN, ROLE.USER)
  @Get()
  async getAddressesByUserId(@GetUser() user: User): Promise<ResponseDto> {
    return this.addressService.getAddressesByUserId(user);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  async getAddressById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ResponseDto> {
    return this.addressService.getAddressById(id);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(ROLE.ADMIN, ROLE.USER)
  @Put(':id')
  async updateAddressById(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateAddressDto: UpdateAddressDto,
  ): Promise<ResponseDto> {
    return this.addressService.updateAddressById(id, updateAddressDto);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(ROLE.ADMIN, ROLE.USER)
  @Delete(':id')
  async deleteAddressById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ResponseDto> {
    return this.addressService.deleteAddressById(id);
  }
}
