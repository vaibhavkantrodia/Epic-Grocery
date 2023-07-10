import { Module, forwardRef } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { CartModule } from '../cart/cart.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { ProductModule } from '../product/product.module';

@Module({
  imports: [
    forwardRef(() => CartModule),
    forwardRef(() => ProductModule),
    TypeOrmModule.forFeature([Order]),
  ],
  controllers: [OrderController],
  providers: [OrderService],
})
export class OrderModule { }
