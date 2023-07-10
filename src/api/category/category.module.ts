import { Module } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import { MulterModule } from '@nestjs/platform-express/multer';
import { multerOptions } from 'src/helpers/fileUpload';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';

@Module({
  imports: [
    MulterModule.register(multerOptions),
    TypeOrmModule.forFeature([Category])
  ],
  controllers: [CategoryController],
  providers: [CategoryService],
  exports: [CategoryService]
})
export class CategoryModule { }
