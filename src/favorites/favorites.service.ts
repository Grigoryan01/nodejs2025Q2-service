import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Favorite } from './entities/favorite.entity';

@Injectable()
export class FavoritesService {
  constructor(
    @InjectRepository(Favorite)
    private favoritesRepository: Repository<Favorite>,
  ) {}

  async create(createFavoriteDto: Partial<Favorite>): Promise<Favorite> {
    const favorite = this.favoritesRepository.create(createFavoriteDto);
    return await this.favoritesRepository.save(favorite);
  }

  async findAll(): Promise<Favorite[]> {
    return await this.favoritesRepository.find();
  }

  async findOne(id: string): Promise<Favorite | null> {
    return await this.favoritesRepository.findOne({ where: { id } });
  }

  async remove(id: string): Promise<void> {
    await this.favoritesRepository.delete(id);
  }
}

