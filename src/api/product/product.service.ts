import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Repository } from 'typeorm';
import * as path from 'path';
import * as fs from 'fs';
import DeleteResponseDto from 'src/utils/delete-response.dto';
import CreateResponseDto from 'src/utils/create-respons.dto';
import UpdateResponseDto from 'src/utils/update-response.dto';
import {
  PRODUCT_CREATED_MESSAGE,
  PRODUCT_DELETED_MESSAGE,
  PRODUCT_NOTFOUND_MESSAGE,
  PRODUCT_RETRIEVED_MESSAGE,
  PRODUCT_UPDATED_MESSAGE,
} from 'src/helpers/message';
@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  // create product
  async create(createProduct: CreateProductDto): Promise<CreateResponseDto> {
    try {
      const product = new Product();
      product.name = createProduct.name;
      product.description = createProduct.description;
      product.image_url = createProduct.image_url;
      product.price = createProduct.price;
      product.qty = createProduct.qty;
      product.category = createProduct.category_id;

      const result = await this.productRepository.save(product);
      return {
        statusCode: 201,
        message: PRODUCT_CREATED_MESSAGE,
        data: result,
      };
    } catch (error) {
      throw new HttpException(
        error.message,
        HttpStatus.INTERNAL_SERVER_ERROR || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // get all products
  async findAll(
    name: string,
    page = 1,
    limit: number,
  ): Promise<CreateResponseDto> {
    try {
      limit = limit || 10;
      const skip = (page - 1) * limit;
      const product = await this.productRepository
        .createQueryBuilder('p')
        .innerJoinAndSelect('p.category', 'c')
        .select([
          'p.id',
          'p.name',
          'p.description',
          'p.price',
          'p.qty',
          'p.image_url',
          'p.is_active',
          'p.created_at',
          'p.updated_at',
          'c.name',
        ]);

      if (name) {
        product.where('p.name LIKE :name', { name: `%${name}%` });
      }

      product.skip(skip).take(limit);
      const products = await product.getMany();

      if (products.length === 0) {
        throw new HttpException(PRODUCT_NOTFOUND_MESSAGE, HttpStatus.NOT_FOUND);
      }

      return {
        statusCode: 200,
        message: PRODUCT_RETRIEVED_MESSAGE,
        data: products,
      };
    } catch (error) {
      throw new HttpException(
        error.message,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // get product by id
  async findOne(id: number): Promise<CreateResponseDto> {
    try {
      const product = await this.productRepository
        .createQueryBuilder('p')
        .innerJoinAndSelect('p.category', 'c')
        .select([
          'p.id',
          'p.name',
          'p.description',
          'p.price',
          'p.qty',
          'p.image_url',
          'p.is_active',
          'p.created_at',
          'p.updated_at',
          'c.name',
        ])
        .where('p.id =:id', { id })
        .getOne();
      if (!product) {
        throw new HttpException(PRODUCT_NOTFOUND_MESSAGE, HttpStatus.NOT_FOUND);
      }
      return {
        statusCode: 200,
        message: PRODUCT_RETRIEVED_MESSAGE,
        data: product,
      };
    } catch (error) {
      console.log(error);

      throw new HttpException(
        error.message,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // get all products by category
  async findAllProducts(category_id: number) {
    try {
      const products = await this.productRepository.find({
        where: {
          category: { id: category_id },
        },
      });

      if (!products || products.length === 0) {
        throw new HttpException(PRODUCT_NOTFOUND_MESSAGE, HttpStatus.NOT_FOUND);
      }
      return {
        statusCode: 200,
        message: PRODUCT_RETRIEVED_MESSAGE,
        data: products,
      };
    } catch (error) {
      throw new HttpException(
        error.message,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // update product by id
  async update(
    id: number,
    updateProduct: UpdateProductDto,
  ): Promise<UpdateResponseDto | any> {
    try {
      const productExits = await this.productRepository.find({
        where: { id },
      });

      if (productExits.length == 0) {
        throw new NotFoundException(PRODUCT_NOTFOUND_MESSAGE);
      }

      const product = new Product();
      product.name = updateProduct.name;
      product.description = updateProduct.description;
      product.image_url = updateProduct.image_url;
      product.price = updateProduct.price;
      product.qty = updateProduct.qty;
      product.is_active = updateProduct.is_active;
      product.category = updateProduct.category_id;

      const result = await this.productRepository.update(id, product);

      if (result.affected > 0) {
        return {
          statusCode: 201,
          message: PRODUCT_UPDATED_MESSAGE,
        };
      }
    } catch (error) {
      throw new HttpException(
        error.message,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // delete product by id
  async remove(id: number): Promise<DeleteResponseDto> {
    try {
      const productExits = await this.productRepository.count({
        where: { id },
      });
      if (productExits == 0) {
        throw new NotFoundException(PRODUCT_NOTFOUND_MESSAGE);
      }

      const result = await this.productRepository.delete(id);
      if (result.affected > 0) {
        return {
          statusCode: 201,
          message: PRODUCT_DELETED_MESSAGE,
        };
      }
    } catch (error) {
      throw new HttpException(
        error.message,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async updateProductQty(qty: number, id: number): Promise<boolean> {
    try {
      const product = await this.productRepository.update(id, { qty });
      if (product.affected >= 1) {
        return true;
      }
      return false;
    } catch (e) {
      throw new HttpException(
        'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
