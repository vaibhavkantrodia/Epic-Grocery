import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { Order } from './entities/order.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CartService } from '../cart/cart.service';
import { ProductService } from '../product/product.service';
import { ORDERSTATUS } from 'src/helpers/order-status.enum';
import { CreateOrderDto } from './dto/create-order.dto';
import { User } from '../user/entities/user.entity';
import { v4 as uuidv4 } from 'uuid';
import {
  CART_EMPTY_MESSAGE,
  ORDERS_FOUND_MESSAGE,
  ORDER_CANCELED_MESSAGE,
  ORDER_CREATED_MESSAGE,
  ORDER_FOUND_MESSAGE,
  ORDER_NOTFOUND_MESSAGE,
  ORDER_UPDATED_MESSAGE,
} from 'src/helpers/message';
import ResponseDto from 'src/utils/create-respons.dto';
import { UpdateOrderDto } from './dto/update-order.dto';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order) private orderRepository: Repository<Order>,
    private readonly cartService: CartService,
    private readonly productService: ProductService,
  ) {}

  async createOrder(
    createOrderDto: CreateOrderDto,
    user: User,
  ): Promise<ResponseDto> {
    try {
      const { address_id } = createOrderDto;

      const userCarts = await this.cartService.findCartsByUserId(user.id);

      if (userCarts.data.length == 0) {
        return {
          statusCode: 200,
          message: CART_EMPTY_MESSAGE,
          data: [],
        };
      }

      const order_id = uuidv4();

      const orderPromises = userCarts.data.map(async (cart) => {
        const order = this.orderRepository.create({
          order_id,
          product: { id: cart.product.id },
          user: { id: cart.user.id },
          qty: cart.qty,
          price: cart.price,
          discount_price: cart.discount_price,
          address: { id: address_id },
        });

        await this.orderRepository.save(order);

        const product = await this.productService.findOne(cart.product.id);

        await this.productService.updateProductQty(
          product.data.qty - cart.qty,
          product.data.id,
        );

        await this.cartService.remove(cart.id);

        return order;
      });

      const createdOrders = await Promise.all(orderPromises);

      let total = 0;
      createdOrders.forEach(
        (order) => (total += order.discount_price || order.price),
      );

      return {
        statusCode: 201,
        message: ORDER_CREATED_MESSAGE,
        orderTotal: total,
        data: createdOrders,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getOrdersbyOrderId(orderId: string): Promise<ResponseDto> {
    try {
      const query = this.orderRepository
        .createQueryBuilder('order')
        .leftJoinAndSelect('order.user', 'user')
        .leftJoinAndSelect('order.product', 'product')
        .leftJoinAndSelect('order.address', 'address')
        .select(['order', 'product.id', 'user.id', 'address.id'])
        .where('order.order_id=:orderId', { orderId });

      const orders = await query.getMany();

      if (orders.length == 0) {
        return {
          statusCode: 200,
          message: ORDER_NOTFOUND_MESSAGE,
          data: [],
        };
      }

      return {
        statusCode: 200,
        message: ORDER_FOUND_MESSAGE,
        data: orders,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getAllOrdersByUserId(user: User): Promise<ResponseDto> {
    try {
      const allOrders = await this.orderRepository
        .createQueryBuilder('order')
        .leftJoinAndSelect('order.user', 'user')
        .leftJoinAndSelect('order.product', 'product')
        .select(['order.id', 'product.name', 'product.image_url'])
        .where('order.user = :id', { id: user.id })
        .getMany();

      if (allOrders.length == 0) {
        return {
          statusCode: 200,
          message: ORDER_NOTFOUND_MESSAGE,
          data: [],
        };
      }

      return {
        statusCode: 200,
        message: ORDERS_FOUND_MESSAGE,
        data: allOrders,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async cancelOrders(orderId: string): Promise<ResponseDto> {
    try {
      const existingOrders = await this.getOrdersbyOrderId(orderId);

      if (existingOrders.data.length == 0) {
        return {
          statusCode: 200,
          message: ORDER_NOTFOUND_MESSAGE,
          data: [],
        };
      }

      for await (const existingOrder of existingOrders.data) {
        if (existingOrder.status !== ORDERSTATUS.CANCELED) {
          await this.orderRepository
            .createQueryBuilder()
            .update(Order)
            .set({ status: ORDERSTATUS.CANCELED })
            .where('id = :id', { id: existingOrder.id })
            .execute();

          const existingOrderProduct = await this.productService.findOne(
            existingOrder.product.id,
          );

          const updatedProductQty =
            existingOrder.qty + existingOrderProduct.data.qty;

          await this.productService.updateProductQty(
            updatedProductQty,
            existingOrder.product.id,
          );
        }
      }

      return {
        statusCode: 201,
        message: ORDER_CANCELED_MESSAGE,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async updateOrdersById(
    orderId: string,
    updateOrderDto: UpdateOrderDto,
  ): Promise<ResponseDto> {
    try {
      const existingOrders = await this.getOrdersbyOrderId(orderId);

      if (existingOrders.data.length == 0) {
        return {
          statusCode: 200,
          message: ORDER_NOTFOUND_MESSAGE,
          data: [],
        };
      }

      for await (const existingOrder of existingOrders.data) {
        await this.orderRepository
          .createQueryBuilder()
          .update(Order)
          .set({ status: updateOrderDto.orderStatus })
          .where('id = :id', { id: existingOrder.id })
          .execute();
      }

      return {
        statusCode: 201,
        message: ORDER_UPDATED_MESSAGE,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
