import { Module, forwardRef } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { MulterModule } from '@nestjs/platform-express';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { multerOptions } from 'src/helpers/fileUpload';
import { CategoryModule } from '../category/category.module';

@Module({
  imports: [
    CategoryModule,
    MulterModule.register(multerOptions),
    TypeOrmModule.forFeature([Product]),
    forwardRef(() => CategoryModule),
  ],
  controllers: [ProductController],
  providers: [ProductService],
  exports: [ProductService]
})
export class ProductModule { }
