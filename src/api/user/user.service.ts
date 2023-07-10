import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import {
  EMAIL_ALREADY_EXISTS_MESSAGE,
  INCORRECT_PASSWORD_MESSAGE,
  PASSWORD_CHANGED_MESSAGE,
  PASSWORD_SAME_MESSAGE,
  PHONE_ALREADY_EXISTS_MESSAGE,
  USER_CREATED_MESSAGE,
  USER_DELETED_MESSAGE,
  USER_NOT_FOUND_MESSAGE,
  USER_RETRIEVED_MESSAGE,
  USER_UPDATED_MESSAGE,
} from 'src/helpers/message';
import CreateResponseDto from 'src/utils/create-respons.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import ResponseDto from 'src/utils/create-respons.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  // create user
  async createUser(createUserDto: CreateUserDto): Promise<ResponseDto> {
    try {
      const { first_name, last_name, phone, email, password, role } =
        createUserDto;

      const existingUser = await this.getUserByEmail(email);

      if (existingUser) {
        throw new BadRequestException(EMAIL_ALREADY_EXISTS_MESSAGE);
      }

      const existingPhone = await this.userRepository.findOneBy({ phone });

      if (existingPhone) {
        throw new BadRequestException(PHONE_ALREADY_EXISTS_MESSAGE);
      }

      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash(password, salt);

      const user = this.userRepository.create({
        first_name,
        last_name,
        phone,
        email,
        password: hashedPassword,
        role,
      });

      await this.userRepository.save(user);
      user.password = undefined;

      return {
        statusCode: 201,
        message: USER_CREATED_MESSAGE,
        data: user,
      };
    } catch (error) {
      throw new HttpException(
        error.message,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // get user by email_id
  async getUserByEmail(email: string): Promise<User> {
    try {
      const result = await this.userRepository.findOne({ where: { email } });

      return result;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // get user by id
  async getUserById(id: number): Promise<ResponseDto> {
    try {
      const query = this.userRepository
        .createQueryBuilder('user')
        .where('user.is_active =:isActive', { isActive: true })
        .andWhere('user.id =:Id', { Id: id });

      const user = await query.getOne();

      if (!user) {
        throw new NotFoundException(USER_NOT_FOUND_MESSAGE);
      }

      return {
        statusCode: 200,
        data: user,
      };
    } catch (error) {
      throw new HttpException(
        error.message,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async updateUserById(
    id: number,
    updateUserDto: UpdateUserDto,
  ): Promise<ResponseDto> {
    try {
      const existinguser = await this.userRepository.findOne({
        where: { id, is_active: true },
      });

      if (!existinguser) {
        throw new NotFoundException(USER_NOT_FOUND_MESSAGE);
      }

      const user = new User();
      user.first_name = updateUserDto.first_name;
      user.last_name = updateUserDto.last_name;
      user.phone = updateUserDto.phone;
      user.is_active = updateUserDto.is_active;

      const result = await this.userRepository.update(id, user);

      if (result.affected > 0) {
        return {
          statusCode: 201,
          message: USER_UPDATED_MESSAGE,
        };
      }
    } catch (error) {
      throw new HttpException(
        error.message,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // chage password
  async changePassword(
    changePasswordDto: ChangePasswordDto,
    user: User,
  ): Promise<ResponseDto> {
    try {
      const { password, new_password } = changePasswordDto;

      const passwordvalidation = await bcrypt.compare(password, user.password);

      if (!passwordvalidation) {
        throw new BadRequestException(INCORRECT_PASSWORD_MESSAGE);
      }

      if (password === new_password) {
        throw new BadRequestException(PASSWORD_SAME_MESSAGE);
      }

      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash(new_password, salt);

      user.password = hashedPassword;
      await this.userRepository.save(user);

      return {
        statusCode: 200,
        message: PASSWORD_CHANGED_MESSAGE,
      };
    } catch (error) {
      throw new HttpException(
        error.message,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // delete user by id
  async deleteUserById(id: number): Promise<ResponseDto> {
    try {
      const user = await this.getUserById(id);

      if (!user) {
        throw new NotFoundException(USER_NOT_FOUND_MESSAGE);
      }
      const result = await this.userRepository.delete(id);

      if (result.affected > 0) {
        return {
          statusCode: 201,
          message: USER_DELETED_MESSAGE,
        };
      }
    } catch (error) {
      throw new HttpException(
        error.message,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // findone 
  async findOne(email: string) {
    try {
      const result = await this.userRepository.findOne({ where: { email } });
      return result;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  // find Email
  async isEmailExists(email: string) {
    try {
      const count = await this.userRepository.createQueryBuilder('user').where('user.email=:email', { email }).getCount();
      return count;

    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // reset password token and expire time save
  async setTokenAndDate(email, token: string, expireTime: Date): Promise<void> {
    try {
      const user = new User();
      user.reset_password_token = token;
      user.reset_password_token_expire_time = expireTime;

      if (token != null && expireTime != null) {
        await this.userRepository
          .createQueryBuilder()
          .update()
          .set(user)
          .where({ email })
          .execute();
      }
    } catch (error) {
      throw new HttpException(
        error.message,
        error.statusCode || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // update password user
  async userPasswordUpdate(email: string, password: string): Promise<boolean> {
    try {
      const user = new User();
      user.password = password;
      const result = await this.userRepository
        .createQueryBuilder()
        .update(user)
        .set({ password })
        .where({ email })
        .execute();
      if (!result) {
        return false;
      }
      return true;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // get all user
  async findAlluser(page: number, limit: number): Promise<CreateResponseDto> {
    try {
      page = page || 1;
      limit = limit || 5;
      const skip = (page - 1) * limit;
      const users = await this.userRepository
        .createQueryBuilder('user')
        .skip(skip)
        .take(limit)
        .getMany();
      return {
        statusCode: 200,
        message: USER_RETRIEVED_MESSAGE,
        data: users,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
