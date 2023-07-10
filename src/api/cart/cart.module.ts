import { Module } from '@nestjs/common';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { ProductModule } from '../product/product.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cart } from './entities/cart.entity';
import { Product } from '../product/entities/product.entity';

@Module({
  imports: [ProductModule, TypeOrmModule.forFeature([Cart])],
  controllers: [CartController],
  providers: [CartService],
  exports: [CartService],
})
export class CartModule {}
