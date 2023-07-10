import { Injectable, UnauthorizedException } from '@nestjs/common';
import { User } from 'src/api/user/entities/user.entity';
import { jwtConstants } from '../constraints/constant';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayload } from '../interfaces/jwt-payload.interface';
import { UserService } from 'src/api/user/user.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private userService: UserService) {
    super({
      secretOrKey: jwtConstants.secret,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
  }

  async validate(payload: JwtPayload): Promise<User> {
    const { email, role } = payload;

    const user: User = await this.userService.getUserByEmail(email);

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
