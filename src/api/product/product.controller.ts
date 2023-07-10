import {
  Controller,
  Post,
  Body,
  Param,
  Delete,
  ParseIntPipe,
  Put,
  UseGuards,
  Query,
  Get,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import CreateResponseDto from 'src/utils/create-respons.dto';
import UpdateResponseDto from 'src/utils/update-response.dto';
import DeleteResponseDto from 'src/utils/delete-response.dto';
import { Roles } from '../auth/decorator/roles.decorator';
import { ROLE } from 'src/helpers/role.enum';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/guards/roles.guard';

@ApiTags('product')
@ApiBearerAuth()
@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) { }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(ROLE.ADMIN)

  //create product
  @Post('/create')
  async create(
    @Body() createProduct: CreateProductDto,
  ): Promise<CreateResponseDto> {
    return this.productService.create(createProduct);
  }

  //find all product
  @Get()
  async findAll(
    @Query('name') name: string,
    @Query('page') page: number,
    @Query('limit') limit: number,
  ): Promise<CreateResponseDto> {
    return this.productService.findAll(name, page, limit);
  }

  @Get(':id')
  findOne(@Param('id') id: number): Promise<CreateResponseDto> {
    return this.productService.findOne(id);
  }

  @Get('findProducts/:category_id')
  findAllProducts(@Param('category_id') category_id: number) {
    return this.productService.findAllProducts(category_id);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(ROLE.ADMIN)
  @Put('/:id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProduct: UpdateProductDto,
  ): Promise<UpdateResponseDto> {
    return this.productService.update(id, updateProduct);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(ROLE.ADMIN)
  @Delete('/:id')
  async remove(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<DeleteResponseDto> {
    return this.productService.remove(id);
  }
}
