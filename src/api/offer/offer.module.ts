import { Module, forwardRef } from '@nestjs/common';
import { OfferService } from './offer.service';
import { OfferController } from './offer.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Offer } from './entities/offer.entity';
import { MulterModule } from '@nestjs/platform-express';
import { multerOptions } from 'src/helpers/fileUpload';
import { ProductModule } from '../product/product.module';


@Module({
  imports: [
    MulterModule.register(multerOptions),
    TypeOrmModule.forFeature([Offer]),
    forwardRef(() => ProductModule),

  ],
  controllers: [OfferController],
  providers: [OfferService],
  exports: [OfferService]
})
export class OfferModule { }