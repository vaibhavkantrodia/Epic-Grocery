import { Controller, Post, Body, Req, Param } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login-dto';
import { LoginResponseDto } from './interfaces/login-response.dto';
import UpdateResponseDto from 'src/utils/update-response.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('Auth')
@ApiBearerAuth()
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('/login')
  signIn(@Body() loginDto: LoginDto): Promise<LoginResponseDto> {
    return this.authService.login(loginDto);
  }
  @Post('/forgot-pasword')
  async forgotPassword(@Body('email') email: string, @Req() req): Promise<UpdateResponseDto> {
    return this.authService.forgotPassword(email, req)
  }


  @Post('/password-reset/:token')
  async resetPassword(@Param('token') token: string, @Body() userPassword): Promise<UpdateResponseDto> {
    return await this.authService.resetPassword(token, userPassword);
  }
}
