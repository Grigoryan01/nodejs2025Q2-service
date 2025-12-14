import { Injectable, NotFoundException } from '@nestjs/common';
import { InMemoryStorageService } from '../common/services/in-memory-storage.service';
import { Track } from '../entities/track.entity';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { randomUUID } from 'crypto';

@Injectable()
export class TrackService {
  constructor(private readonly storage: InMemoryStorageService) {}

  findAll(): Track[] {
    return this.storage.getAllTracks();
  }

  findOne(id: string): Track {
    const track = this.storage.getTrackById(id);
    if (!track) {
      throw new NotFoundException('Track not found');
    }
    return track;
  }

  create(createTrackDto: CreateTrackDto): Track {
    const track: Track = {
      id: randomUUID(),
      name: createTrackDto.name,
      artistId: createTrackDto.artistId || null,
      albumId: createTrackDto.albumId || null,
      duration: createTrackDto.duration,
    };
    return this.storage.createTrack(track);
  }

  update(id: string, updateTrackDto: UpdateTrackDto): Track {
    const updated = this.storage.updateTrack(id, {
      name: updateTrackDto.name,
      artistId: updateTrackDto.artistId || null,
      albumId: updateTrackDto.albumId || null,
      duration: updateTrackDto.duration,
    });
    if (!updated) {
      throw new NotFoundException('Track not found');
    }
    return updated;
  }

  remove(id: string): void {
    const deleted = this.storage.deleteTrack(id);
    if (!deleted) {
      throw new NotFoundException('Track not found');
    }
  }
}
