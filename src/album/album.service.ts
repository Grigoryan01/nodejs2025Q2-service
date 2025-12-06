import { Injectable, NotFoundException } from '@nestjs/common';
import { InMemoryStorageService } from '../common/services/in-memory-storage.service';
import { Album } from '../entities/album.entity';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { randomUUID } from 'crypto';

@Injectable()
export class AlbumService {
  constructor(private readonly storage: InMemoryStorageService) {}

  findAll(): Album[] {
    return this.storage.getAllAlbums();
  }

  findOne(id: string): Album {
    const album = this.storage.getAlbumById(id);
    if (!album) {
      throw new NotFoundException('Album not found');
    }
    return album;
  }

  create(createAlbumDto: CreateAlbumDto): Album {
    const album: Album = {
      id: randomUUID(),
      name: createAlbumDto.name,
      year: createAlbumDto.year,
      artistId: createAlbumDto.artistId || null,
    };
    return this.storage.createAlbum(album);
  }

  update(id: string, updateAlbumDto: UpdateAlbumDto): Album {
    const updated = this.storage.updateAlbum(id, {
      name: updateAlbumDto.name,
      year: updateAlbumDto.year,
      artistId: updateAlbumDto.artistId || null,
    });
    if (!updated) {
      throw new NotFoundException('Album not found');
    }
    return updated;
  }

  remove(id: string): void {
    const deleted = this.storage.deleteAlbum(id);
    if (!deleted) {
      throw new NotFoundException('Album not found');
    }
  }
}

