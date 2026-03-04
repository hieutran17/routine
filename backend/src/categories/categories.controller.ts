import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  Request,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { UpsertTargetsDto } from './dto/upsert-targets.dto';

type AuthReq = { user: { id: number; email: string } };

@UseGuards(JwtAuthGuard)
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  findAll(@Request() req: AuthReq) {
    return this.categoriesService.findAll(req.user.id);
  }

  @Post()
  create(@Request() req: AuthReq, @Body() dto: CreateCategoryDto) {
    return this.categoriesService.create(req.user.id, dto);
  }

  @Patch(':id')
  update(
    @Request() req: AuthReq,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateCategoryDto,
  ) {
    return this.categoriesService.update(req.user.id, id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Request() req: AuthReq, @Param('id', ParseIntPipe) id: number) {
    return this.categoriesService.remove(req.user.id, id);
  }

  @Put(':id/targets')
  upsertTargets(
    @Request() req: AuthReq,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpsertTargetsDto,
  ) {
    return this.categoriesService.upsertTargets(req.user.id, id, dto);
  }
}
