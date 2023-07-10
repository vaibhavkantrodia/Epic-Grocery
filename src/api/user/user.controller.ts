import {
  Controller,
  Post,
  Body,
  UseGuards,
  Get,
  ParseIntPipe,
  Param,
  Put,
  Delete,
  Patch,
  Query,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { GetUser } from '../auth/decorator/get-user.decorator';
import { User } from './entities/user.entity';
import { RolesGuard } from '../auth/guards/roles.guard';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../auth/decorator/roles.decorator';
import { ROLE } from 'src/helpers/role.enum';
import ResponseDto from 'src/utils/create-respons.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import CreateResponseDto from 'src/utils/create-respons.dto';

@ApiTags('Users')
@ApiBearerAuth()
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  async userRegister(
    @Body() createUserDto: CreateUserDto,
  ): Promise<ResponseDto> {
    return this.userService.createUser(createUserDto);
  }

  // findAll user
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(ROLE.ADMIN)
  @Get('findAll')
  async userFindAll(
    @Query('page') page: number,
    @Query('limit') limit: number,
  ): Promise<CreateResponseDto> {
    return this.userService.findAlluser(page, limit);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  async getUserById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ResponseDto> {
    return this.userService.getUserById(id);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(ROLE.ADMIN, ROLE.USER)
  @Put(':id')
  async updateUserById(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<ResponseDto> {
    return await this.userService.updateUserById(id, updateUserDto);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(ROLE.ADMIN, ROLE.USER)
  @Patch('change-password')
  async changePassword(
    @Body() changePasswordDto: ChangePasswordDto,
    @GetUser() user: User,
  ): Promise<ResponseDto> {
    return this.userService.changePassword(changePasswordDto, user);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(ROLE.ADMIN, ROLE.USER)
  @Delete(':id')
  async deleteUserById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ResponseDto> {
    return this.userService.deleteUserById(id);
  }
}
