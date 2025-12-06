import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { FavoritesService } from './favorites.service';
import { Favorite } from './entities/favorite.entity';

@Controller('favorites')
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createFavoriteDto: Partial<Favorite>): Promise<Favorite> {
    return await this.favoritesService.create(createFavoriteDto);
  }

  @Get()
  async findAll(): Promise<Favorite[]> {
    return await this.favoritesService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Favorite> {
    const favorite = await this.favoritesService.findOne(id);
    if (!favorite) {
      throw new Error('Favorite not found');
    }
    return favorite;
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string): Promise<void> {
    await this.favoritesService.remove(id);
  }
}

