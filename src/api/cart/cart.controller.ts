import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  ParseIntPipe,
  Put,
  Patch,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { GetUser } from '../auth/decorator/get-user.decorator';
import { User } from '../user/entities/user.entity';
import { RolesGuard } from '../auth/guards/roles.guard';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../auth/decorator/roles.decorator';
import { ROLE } from 'src/helpers/role.enum';
import { CreateCartDto } from './dto/create-cart.dto';
import ResponseDto from 'src/utils/create-respons.dto';

import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UpdateCartDto } from './dto/update-cart.dto';

@ApiTags('Carts')
@ApiBearerAuth()
@Controller('carts')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Post('create')
  create(
    @Body() createCartDto: CreateCartDto,
    @GetUser() user: User,
  ): Promise<ResponseDto> {
    return this.cartService.createCart(createCartDto, user);
  }

  @Put(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  async updateCartById(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCartDto: UpdateCartDto,
  ): Promise<ResponseDto> {
    return this.cartService.updateCartById(id, updateCartDto);
  }

  @Get()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  async findCartsByUserId(@GetUser() user: User): Promise<ResponseDto> {
    return this.cartService.findCartsByUserId(user.id);
  }

  @Delete('delete/:id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  remove(@Param('id') id: number): Promise<ResponseDto> {
    return this.cartService.remove(id);
  }
}
