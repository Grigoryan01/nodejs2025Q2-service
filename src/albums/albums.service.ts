import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Album } from './entities/album.entity';

@Injectable()
export class AlbumsService {
  constructor(
    @InjectRepository(Album)
    private albumsRepository: Repository<Album>,
  ) {}

  async create(createAlbumDto: Partial<Album>): Promise<Album> {
    const album = this.albumsRepository.create(createAlbumDto);
    return await this.albumsRepository.save(album);
  }

  async findAll(): Promise<Album[]> {
    return await this.albumsRepository.find();
  }

  async findOne(id: string): Promise<Album | null> {
    return await this.albumsRepository.findOne({ where: { id } });
  }

  async update(id: string, updateAlbumDto: Partial<Album>): Promise<Album> {
    await this.albumsRepository.update(id, updateAlbumDto);
    const updated = await this.findOne(id);
    if (!updated) {
      throw new Error('Album not found');
    }
    return updated;
  }

  async remove(id: string): Promise<void> {
    await this.albumsRepository.delete(id);
  }
}

