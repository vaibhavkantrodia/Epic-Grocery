import { Module } from '@nestjs/common';
import { AuthModule } from './api/auth/auth.module';
import { CategoryModule } from './api/category/category.module';
import { ProductModule } from './api/product/product.module';
import { UserModule } from './api/user/user.module';
import { AddressModule } from './api/address/address.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { config } from './config/conn';
import { OrderModule } from './api/order/order.module';
import { PaymentModule } from './api/payment/payment.module';
import { OfferModule } from './api/offer/offer.module';
import { CartModule } from './api/cart/cart.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(config),
    AuthModule,
    CategoryModule,
    ProductModule,
    UserModule,
    AddressModule,
    OrderModule,
    OfferModule,
    PaymentModule,
    CartModule,
  ],
})
export class AppModule { }
