import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from '../auth/decorator/get-user.decorator';
import { CreateOrderDto } from './dto/create-order.dto';
import { User } from '../user/entities/user.entity';
import ResponseDto from 'src/utils/create-respons.dto';
import { RolesGuard } from '../auth/guards/roles.guard';
import { ROLE } from 'src/helpers/role.enum';
import { Roles } from '../auth/decorator/roles.decorator';
import { UpdateOrderDto } from './dto/update-order.dto';

@UseGuards(AuthGuard('jwt'))
@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post('create')
  async createOrder(
    @Body() createOrderDto: CreateOrderDto,
    @GetUser() user: User,
  ): Promise<ResponseDto> {
    return this.orderService.createOrder(createOrderDto, user);
  }

  @Get('/all-user-orders')
  async getOrdersbyUserId(@GetUser() user: User): Promise<ResponseDto> {
    return this.orderService.getAllOrdersByUserId(user);
  }

  @Get('/:orderId')
  async getOrdersbyOrderId(
    @Param('orderId') orderId: string,
  ): Promise<ResponseDto> {
    return this.orderService.getOrdersbyOrderId(orderId);
  }

  @UseGuards(RolesGuard)
  @Post('/cancel')
  async cancelOrderById(
    @Body('orderId') orderId: string,
  ): Promise<ResponseDto> {
    return this.orderService.cancelOrders(orderId);
  }

  @UseGuards(RolesGuard)
  @Roles(ROLE.ADMIN)
  @Patch('/:orderId')
  updateOrdersById(
    @Param('orderId') orderId: string,
    @Body() updateOrder: UpdateOrderDto,
  ): Promise<ResponseDto> {
    return this.orderService.updateOrdersById(orderId, updateOrder);
  }
}
