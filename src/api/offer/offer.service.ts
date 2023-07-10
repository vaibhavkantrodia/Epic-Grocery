import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { CreateOfferDto } from './dto/create-offer.dto';
import { UpdateOfferDto } from './dto/update-offer.dto';
import { Offer } from './entities/offer.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import CreateResponseDto from 'src/utils/create-respons.dto';
import { OFFER_ALREADY_SET_MESSAGE, OFFER_CREATED_MESSAGE, OFFER_DELETED_MESSAGE, OFFER_FETCH_MESSAGE, OFFER_NOT_FOUND, OFFER_UPDATED_MESSAGE, PRODUCT_NOTFOUND_MESSAGE } from 'src/helpers/message';
import UpdateResponseDto from 'src/utils/update-response.dto';
import DeleteResponseDto from 'src/utils/delete-response.dto';
import { ProductService } from '../product/product.service';


@Injectable()
export class OfferService {

  constructor(
    @InjectRepository(Offer)
    private readonly offerRepository: Repository<Offer>,
    private readonly productService: ProductService
  ) { }

  // create a offer
  async create(createOffer: CreateOfferDto): Promise<CreateResponseDto> {
    try {
      const { category, product, discount_percentage, end_date, start_date } = createOffer;

      // check product is extis or not
      const isProductExits = await this.productService.findOne(Number(product));
      if (!isProductExits) {
        throw new NotFoundException(PRODUCT_NOTFOUND_MESSAGE);
      }
      const original_price = isProductExits.data.price;

      // check product offer is exits or not
      const isOfferExits = await this.findOneByCategoryAndProduct(Number(category), Number(product));

      if (isOfferExits != 0) {
        throw new HttpException(OFFER_ALREADY_SET_MESSAGE, HttpStatus.NOT_ACCEPTABLE);
      }

      const response = await this.offerRepository.save({
        category,
        product,
        discount_percentage,
        original_price,
        start_date,
        end_date
      });

      return {
        statusCode: 201,
        message: OFFER_CREATED_MESSAGE,
        data: response
      }
    } catch (error) {
      throw new HttpException(error.message, error.status || HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // find one by category id and product id
  async findOneByCategoryAndProduct(category_id: number, product_id: number): Promise<number> {
    try {
      const result = await this.offerRepository.count({
        where: {
          category: {
            id: category_id
          },
          product: {
            id: product_id
          }
        }
      })
      return result;
    } catch (error) {
      throw new HttpException(error.message, error.status | HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }


  // update offer
  async update(id: number, updateOffer: UpdateOfferDto): Promise<UpdateResponseDto> {
    try {
      const { category, product, discount_percentage, start_date, end_date, is_active } = updateOffer;

      // check offer is exits or not
      const isOfferExits = await this.offerRepository.createQueryBuilder().where('id != :id', { id }).andWhere('category_id = :category', { category }).andWhere('product_id = :product', { product }).getCount();
      if (isOfferExits != 0) {
        throw new HttpException(OFFER_ALREADY_SET_MESSAGE, HttpStatus.NOT_ACCEPTABLE);
      }

      // check param id valid or not
      const foundOffer = await this.findOneByOfferId(id);

      if (!foundOffer) {
        throw new NotFoundException(OFFER_NOT_FOUND);
      }

      // check product is extis or not
      const isProductExits = await this.productService.findOne(Number(product));
      if (!isProductExits) {
        throw new NotFoundException(PRODUCT_NOTFOUND_MESSAGE);
      }
      const original_price = isProductExits.data.price;

      const response = await this.offerRepository.update(id, {
        category, product, discount_percentage, original_price, start_date, end_date, is_active
      });

      if (response.affected > 0) {
        return {
          statusCode: 201,
          message: OFFER_UPDATED_MESSAGE,
        }
      }
    } catch (error) {
      throw new HttpException(error.message, error.status || HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }


  // find one by offer id
  async findOneByOfferId(id: number): Promise<Offer> {
    try {
      const result = await this.offerRepository.findOne({
        where: {
          id
        }
      })
      return result;
    } catch (error) {
      throw new HttpException(error.message, error.status | HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // remove offer
  async remove(id: number): Promise<DeleteResponseDto> {
    try {
      // check param id valid or not
      const foundOffer = await this.findOneByOfferId(id);
      if (!foundOffer) {
        throw new NotFoundException(OFFER_NOT_FOUND);
      }

      const offer = await this.offerRepository.delete(id);
      if (offer.affected > 0) {
        return {
          statusCode: 201,
          message: OFFER_DELETED_MESSAGE
        };
      }
    } catch (error) {
      throw new HttpException(error.message, error.status || HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // find all record 
  async find(page: number, searchString: string): Promise<CreateResponseDto> {
    try {
      const resultPerPage = 10;

      const query = await this.offerRepository.createQueryBuilder('offer').innerJoinAndSelect('offer.category', 'category')
        .innerJoinAndSelect('offer.product', 'product').
        select(['offer.id', 'category.name', 'product.name', 'product.image_url', 'offer.discount_percentage', 'offer.original_price', 'offer.start_date', 'offer.end_date', 'offer.is_active']);

      // pagination and searching
      const currentPage = Number(page) || 1;
      const skipPage = resultPerPage * (currentPage - 1);

      if (searchString) {
        query.where('product.name LIKE :name', { name: `%${searchString}%` }).orWhere('category.name LIKE :name', { name: `%${searchString}%` });
      }
      query.offset(skipPage).limit(resultPerPage);
      const offer = await query.getMany();
      if (offer.length == 0) {
        throw new NotFoundException(OFFER_NOT_FOUND);
      }

      return {
        statusCode: 200,
        message: OFFER_FETCH_MESSAGE,
        data: offer
      }
    } catch (error) {
      throw new HttpException(error.message, error.status || HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}


