import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  HttpCode,
  HttpStatus,
  UsePipes,
} from '@nestjs/common';
import { FavoritesService } from './favorites.service';
import { UuidValidationPipe } from '../common/pipes/uuid-validation.pipe';

@Controller('favs')
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @Get()
  findAll() {
    return this.favoritesService.findAll();
  }

  @Post('track/:id')
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(new UuidValidationPipe())
  addTrack(@Param('id') id: string) {
    this.favoritesService.addTrack(id);
    return { message: 'Track added to favorites' };
  }

  @Delete('track/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UsePipes(new UuidValidationPipe())
  removeTrack(@Param('id') id: string) {
    this.favoritesService.removeTrack(id);
  }

  @Post('album/:id')
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(new UuidValidationPipe())
  addAlbum(@Param('id') id: string) {
    this.favoritesService.addAlbum(id);
    return { message: 'Album added to favorites' };
  }

  @Delete('album/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UsePipes(new UuidValidationPipe())
  removeAlbum(@Param('id') id: string) {
    this.favoritesService.removeAlbum(id);
  }

  @Post('artist/:id')
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(new UuidValidationPipe())
  addArtist(@Param('id') id: string) {
    this.favoritesService.addArtist(id);
    return { message: 'Artist added to favorites' };
  }

  @Delete('artist/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UsePipes(new UuidValidationPipe())
  removeArtist(@Param('id') id: string) {
    this.favoritesService.removeArtist(id);
  }
}

