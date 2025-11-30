import { Injectable, NotFoundException } from '@nestjs/common';
import { InMemoryStorageService } from '../common/services/in-memory-storage.service';
import { Artist } from '../entities/artist.entity';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { randomUUID } from 'crypto';

@Injectable()
export class ArtistService {
  constructor(private readonly storage: InMemoryStorageService) {}

  findAll(): Artist[] {
    return this.storage.getAllArtists();
  }

  findOne(id: string): Artist {
    const artist = this.storage.getArtistById(id);
    if (!artist) {
      throw new NotFoundException('Artist not found');
    }
    return artist;
  }

  create(createArtistDto: CreateArtistDto): Artist {
    const artist: Artist = {
      id: randomUUID(),
      name: createArtistDto.name,
      grammy: createArtistDto.grammy,
    };
    return this.storage.createArtist(artist);
  }

  update(id: string, updateArtistDto: UpdateArtistDto): Artist {
    const updated = this.storage.updateArtist(id, updateArtistDto);
    if (!updated) {
      throw new NotFoundException('Artist not found');
    }
    return updated;
  }

  remove(id: string): void {
    const deleted = this.storage.deleteArtist(id);
    if (!deleted) {
      throw new NotFoundException('Artist not found');
    }
  }
}

