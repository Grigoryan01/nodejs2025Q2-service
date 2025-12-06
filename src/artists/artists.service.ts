import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Artist } from './entities/artist.entity';

@Injectable()
export class ArtistsService {
  constructor(
    @InjectRepository(Artist)
    private artistsRepository: Repository<Artist>,
  ) {}

  async create(createArtistDto: Partial<Artist>): Promise<Artist> {
    const artist = this.artistsRepository.create(createArtistDto);
    return await this.artistsRepository.save(artist);
  }

  async findAll(): Promise<Artist[]> {
    return await this.artistsRepository.find();
  }

  async findOne(id: string): Promise<Artist | null> {
    return await this.artistsRepository.findOne({ where: { id } });
  }

  async update(id: string, updateArtistDto: Partial<Artist>): Promise<Artist> {
    await this.artistsRepository.update(id, updateArtistDto);
    const updated = await this.findOne(id);
    if (!updated) {
      throw new Error('Artist not found');
    }
    return updated;
  }

  async remove(id: string): Promise<void> {
    await this.artistsRepository.delete(id);
  }
}

