import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
  ParseIntPipe,
} from '@nestjs/common';
import { CreateCartDto } from './dto/create-cart.dto';
import { User } from '../user/entities/user.entity';
import { Cart } from './entities/cart.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductService } from '../product/product.service';

import {
  CARTS_FOUND_MESSAGE,
  CART_CREATED_MESSAGE,
  CART_DELETED_MESSAGE,
  CART_EMPTY_MESSAGE,
  CART_QUANTITY_CHANGED_MESSAGE,
  CART_UPDATED_MESSAGE,
  OUT_OF_STOCK,
  PRODUCT_NOTFOUND_MESSAGE,
} from 'src/helpers/message';

import ResponseDto from 'src/utils/create-respons.dto';
import { UpdateCartDto } from './dto/update-cart.dto';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart)
    private cartRepository: Repository<Cart>,
    private productService: ProductService,
  ) {}

  //create Cart
  async createCart(
    createCartDto: CreateCartDto,
    user: User,
  ): Promise<ResponseDto> {
    try {
      const { product_id, qty, discount } = createCartDto;

      const product = await this.productService.findOne(product_id);

      if (!product) {
        throw new NotFoundException(PRODUCT_NOTFOUND_MESSAGE);
      }

      const query = this.cartRepository
        .createQueryBuilder('cart')
        .leftJoinAndSelect('cart.user', 'user')
        .leftJoinAndSelect('cart.product', 'product')
        .select(['cart', 'user.id', 'product.id', 'product.name'])
        .where('cart.user_id = :userId', { userId: user.id })
        .andWhere('cart.product_id =:productId', {
          productId: product.data.id,
        });

      const existingCart = await query.getOne();

      if (existingCart && discount) {
        const newQty = existingCart.qty + qty;

        if (newQty > product.data.qty) {
          throw new BadRequestException(OUT_OF_STOCK);
        }

        const originalPrice: number = product.data.price * newQty;
        const discountPrice: number = (product.data.price - discount) * newQty;

        existingCart.qty = newQty;
        existingCart.price = originalPrice;
        existingCart.discount_price = discountPrice;

        await this.cartRepository.save(existingCart);

        return {
          statusCode: 201,
          message: CART_QUANTITY_CHANGED_MESSAGE + ` to ${newQty}`,
          data: existingCart,
        };
      }

      if (existingCart) {
        const newQty = existingCart.qty + qty;

        if (newQty > product.data.qty) {
          throw new BadRequestException(OUT_OF_STOCK);
        }

        const originalPrice: number = product.data.price * newQty;

        existingCart.qty = newQty;
        existingCart.price = originalPrice;

        await this.cartRepository.save(existingCart);

        return {
          statusCode: 201,
          message: CART_QUANTITY_CHANGED_MESSAGE + ` to ${newQty}`,
          data: existingCart,
        };
      }

      if (qty > product.data.qty) {
        throw new BadRequestException(OUT_OF_STOCK);
      }

      if (discount) {
        const originalPrice: number = product.data.price * qty;
        const discountPrice: number = (product.data.price - discount) * qty;

        const newCart = this.cartRepository.create({
          qty,
          price: originalPrice,
          discount_price: discountPrice,
          product: { id: product.data.id },
          user: { id: user.id },
        });

        await this.cartRepository.save(newCart);

        return {
          statusCode: 201,
          message: CART_CREATED_MESSAGE,
          data: newCart,
        };
      }

      const originalPrice: number = product.data.price * qty;

      const newCart = this.cartRepository.create({
        qty,
        price: originalPrice,
        product: { id: product.data.id },
        user: { id: user.id },
      });

      await this.cartRepository.save(newCart);

      return {
        statusCode: 201,
        message: CART_CREATED_MESSAGE,
        data: newCart,
      };
    } catch (error) {
      throw new HttpException(
        error.message,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async updateCartById(
    id: number,
    updateCartDto: UpdateCartDto,
  ): Promise<ResponseDto> {
    try {
      const existingCart = await this.cartRepository
        .createQueryBuilder('cart')
        .leftJoinAndSelect('cart.user', 'user')
        .leftJoinAndSelect('cart.product', 'product')
        .select([
          'cart',
          'product.id',
          'product.qty',
          'product.price',
          'user.id',
        ])
        .where('cart.id =:id', { id })
        .getOne();

      if (!existingCart) {
        return {
          statusCode: 200,
          message: CART_EMPTY_MESSAGE,
          data: [],
        };
      }

      const { qty, discount } = updateCartDto;
      const newQty: number = existingCart.qty - qty;

      if (newQty > 0) {
        if (discount) {
          const originalPrice: number = existingCart.product.price * newQty;
          const discountPrice: number =
            existingCart.product.price - discount * newQty;

          await this.cartRepository.update(existingCart.id, {
            qty: newQty,
            price: originalPrice,
            discount_price: discountPrice,
          });

          return {
            statusCode: 201,
            message: CART_QUANTITY_CHANGED_MESSAGE + ` to ${newQty}`,
          };
        }

        const originalPrice: number = existingCart.product.price * newQty;

        await this.cartRepository.update(existingCart.id, {
          qty: newQty,
          price: originalPrice,
        });

        return {
          statusCode: 201,
          message: CART_QUANTITY_CHANGED_MESSAGE + ` to ${newQty}`,
        };
      } else {
        throw new BadRequestException('Minimum cart quantity should be 1');
      }
    } catch (error) {
      throw new HttpException(
        error.message,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // find all carts for a user
  async findCartsByUserId(userId: number): Promise<ResponseDto> {
    try {
      const carts = await this.cartRepository
        .createQueryBuilder('cart')
        .leftJoinAndSelect('cart.user', 'user')
        .leftJoinAndSelect('cart.product', 'product')
        .select(['cart', 'user.id', 'product.id'])
        .where('cart.user_id=:userId', { userId })
        .getMany();

      if (carts.length == 0) {
        return {
          statusCode: 200,
          message: CART_EMPTY_MESSAGE,
          data: [],
        };
      }

      carts.forEach(function (cart) {
        cart.discount_price = Number(cart.discount_price);
        cart.price = Number(cart.price);
      });

      return {
        statusCode: 200,
        message: CARTS_FOUND_MESSAGE,
        data: carts,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // Delete cart
  async remove(id: number): Promise<ResponseDto> {
    try {
      const cart = await this.cartRepository.findOne({ where: { id } });

      if (!cart) {
        return {
          statusCode: 200,
          message: CART_EMPTY_MESSAGE,
          data: [],
        };
      }

      const result = await this.cartRepository.delete({ id });

      if (result.affected > 0) {
        return {
          statusCode: 201,
          message: CART_DELETED_MESSAGE,
        };
      }
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
