import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Address } from './entities/address.entity';
import { Repository } from 'typeorm';
import {
  ADDRESSES_NOT_FOUND_MESSAGE,
  ADDRESS_CREATED_MESSAGE,
  ADDRESS_DELETED_MESSAGE,
  ADDRESS_NOT_FOUND_MESSAGE,
  ADDRESS_UPDATED_MESSAGE,
} from 'src/helpers/message';
import ResponseDto from 'src/utils/create-respons.dto';
import { User } from '../user/entities/user.entity';

@Injectable()
export class AddressService {
  constructor(
    @InjectRepository(Address)
    private readonly addressRepository: Repository<Address>,
  ) {}

  async createAddress(
    createAddressDto: CreateAddressDto,
    user: User,
  ): Promise<ResponseDto> {
    try {
      const { name, phone, addressline, city, state, pincode } =
        createAddressDto;

      const address = this.addressRepository.create({
        name,
        phone,
        addressline,
        city,
        state,
        pincode,
        user: { id: user.id },
      });

      await this.addressRepository.save(address);

      return {
        statusCode: 201,
        message: ADDRESS_CREATED_MESSAGE,
        data: address,
      };
    } catch (error) {
      throw new HttpException(
        "Coudn't add the address",
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getAddressesByUserId(user: User): Promise<ResponseDto> {
    try {
      const query = this.addressRepository
        .createQueryBuilder('address')
        .leftJoinAndSelect('address.user', 'user')
        .select(['address', 'user.id'])
        .where('address.user_id=:userid', { userid: user.id });

      const userAddresses = await query.getMany();

      if (userAddresses.length == 0) {
        throw new NotFoundException(ADDRESSES_NOT_FOUND_MESSAGE);
      }

      return { statusCode: 200, data: userAddresses };
    } catch (error) {
      throw new HttpException(
        error.message,
        error.state || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getAddressById(id: number): Promise<ResponseDto> {
    try {
      const existingAddress = await this.addressRepository.findOne({
        where: { id, is_active: true },
      });

      if (!existingAddress) {
        throw new NotFoundException(ADDRESS_NOT_FOUND_MESSAGE);
      }

      return {
        statusCode: 200,
        data: existingAddress,
      };
    } catch (error) {
      throw new HttpException(
        error.message,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async updateAddressById(
    id: number,
    updateAddressDto: UpdateAddressDto,
  ): Promise<ResponseDto> {
    try {
      const existingAddress = await this.addressRepository.findOne({
        where: { id, is_active: true },
      });

      if (!existingAddress) {
        throw new NotFoundException(ADDRESS_NOT_FOUND_MESSAGE);
      }

      const address = new Address();
      address.addressline = updateAddressDto.addressline;
      address.city = updateAddressDto.city;
      address.state = updateAddressDto.state;
      address.name = updateAddressDto.name;
      address.pincode = updateAddressDto.pincode;
      address.phone = updateAddressDto.phone;
      address.is_active = updateAddressDto.is_active;

      const result = await this.addressRepository.update(id, address);

      if (result.affected > 0) {
        return { statusCode: 201, message: ADDRESS_UPDATED_MESSAGE };
      }
    } catch (error) {
      throw new HttpException(
        error.message,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async deleteAddressById(id: number): Promise<ResponseDto> {
    try {
      const existingAddress = await this.getAddressById(id);

      if (!existingAddress) {
        throw new NotFoundException(ADDRESS_NOT_FOUND_MESSAGE);
      }

      const result = await this.addressRepository.delete(id);

      if (result.affected > 0) {
        return {
          statusCode: 201,
          message: ADDRESS_DELETED_MESSAGE,
        };
      }
    } catch (error) {
      throw new HttpException(
        error.message,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
