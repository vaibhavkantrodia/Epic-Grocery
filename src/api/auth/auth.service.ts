import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';

import * as jwt from 'jsonwebtoken';
import { LoginDto } from './dto/login-dto';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { jwtConstants } from './constraints/constant';
import { EmailService } from 'src/helpers/EmailService';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { LoginResponseDto } from './interfaces/login-response.dto';
import {
  EMAIL_NOT_FOUND,
  FORGOT_PASSWORD_SENT,
  INVALID_LOGIN_CREDENTIALS_MESSAGE,
  LINK_EXPIRE,
  USER_PASSWORD_UPDATED_MESSAGE,
} from 'src/helpers/message';
import UpdateResponseDto from 'src/utils/update-response.dto';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private userService: UserService,
  ) { }

  // user_login
  async login(loginDto: LoginDto): Promise<LoginResponseDto> {
    try {
      const user = await this.userService.getUserByEmail(loginDto.email);

      if (!user) {
        throw new UnauthorizedException(INVALID_LOGIN_CREDENTIALS_MESSAGE);
      }

      const passwordValidate = await bcrypt.compare(
        loginDto.password,
        user.password,
      );

      if (!passwordValidate) {
        throw new UnauthorizedException(INVALID_LOGIN_CREDENTIALS_MESSAGE);
      }

      const payload: JwtPayload = { email: user.email, role: user.role };
      const accessToken: string = await this.jwtService.sign(payload);

      const { id, first_name, last_name, email, phone, role } = user;

      return {
        accessToken,
        statusCode: 201,
        data: { id, first_name, last_name, email, phone, role },
      };
    } catch (error) {
      throw new HttpException(
        error.message,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // forgot password
  async forgotPassword(email: string, req): Promise<UpdateResponseDto> {
    try {
      const user = await this.userService.getUserByEmail(email);

      if (!user) {
        throw new UnauthorizedException(EMAIL_NOT_FOUND);
      }

      const userEmailid = user.email;

      const token = jwt.sign(
        { user: user.id, email: userEmailid },
        jwtConstants.secret,
        {},
      );

      const expireTime = new Date(Date.now() + 15 * 60 * 1000);

      await this.userService.setTokenAndDate(userEmailid, token, expireTime);

      const resetPasswordLink = `${req.protocol}://${req.get(
        'host',
      )}/auth/password-reset/${token}`;

      const res = await EmailService.sendEmail(
        userEmailid,
        'Reset Password link',
        resetPasswordLink,
      );

      if (!res.response) {
        throw new NotFoundException(EMAIL_NOT_FOUND);
      }
      return {
        statusCode: 201,
        message: FORGOT_PASSWORD_SENT,
      };
    } catch (error) {
      throw new HttpException(
        error.message,
        error.statusCode || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // reset password
  async resetPassword(token: string, userPassword): Promise<UpdateResponseDto> {
    try {
      const decodedToken = jwt.verify(token, jwtConstants.secret) as {
        email: string;
      };

      const user = await this.userService.getUserByEmail(decodedToken.email);

      const { reset_password_token, reset_password_token_expire_time } = user;
      const { password, confirm_password } = userPassword;

      const time = new Date(Date.now());

      if (
        token == reset_password_token &&
        reset_password_token_expire_time >= time
      ) {
        if (password == confirm_password) {
          const genSalt = await bcrypt.genSalt();
          const hashPass = await bcrypt.hash(password, genSalt);
          const result = await this.userService.userPasswordUpdate(
            decodedToken.email,
            hashPass,
          );

          if (result) {
            await this.userService.setTokenAndDate(
              decodedToken.email,
              null,
              null,
            );
            return {
              statusCode: 201,
              message: USER_PASSWORD_UPDATED_MESSAGE,
            };
          }
        }
      }
      return {
        statusCode: HttpStatus.NOT_ACCEPTABLE,
        message: LINK_EXPIRE,
      };
    } catch (error) {
      throw new HttpException(
        error.message,
        error.statusCode || HttpStatus.BAD_REQUEST,
      );
    }
  }
}
