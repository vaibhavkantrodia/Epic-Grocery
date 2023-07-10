import {
  Controller,
  Post,
  Body,
  Put,
  Param,
  Delete,
  ParseIntPipe,
  UseGuards,
  Get,
  Query,
} from '@nestjs/common';

import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorator/roles.decorator';
import { ROLE } from 'src/helpers/role.enum';
import { AuthGuard } from '@nestjs/passport';
import CreateResponseDto from 'src/utils/create-respons.dto';
import DeleteResponseDto from 'src/utils/delete-response.dto';
import UpdateResponseDto from 'src/utils/update-response.dto';

@ApiTags('Categories')
@ApiBearerAuth()
@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) { }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(ROLE.ADMIN)
  @Post('/create')
  async create(
    @Body() createCategory: CreateCategoryDto,
  ): Promise<CreateResponseDto> {
    return this.categoryService.create(createCategory);
  }

  @Get()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  findAll(
    @Query('page') page: number,
    @Query('limit') limit: number,
  ): Promise<CreateResponseDto> {
    return this.categoryService.findAll(page, limit);
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  findOne(@Param('id') id: number): Promise<CreateResponseDto> {
    return this.categoryService.findOne(id);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(ROLE.ADMIN)
  @Put('/:id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCategory: UpdateCategoryDto,
  ): Promise<UpdateResponseDto> {
    return this.categoryService.update(id, updateCategory);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(ROLE.ADMIN)
  @Delete('/:id')
  async remove(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<DeleteResponseDto> {
    return this.categoryService.remove(id);
  }
}
