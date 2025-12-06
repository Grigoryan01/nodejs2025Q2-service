import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Track } from './entities/track.entity';

@Injectable()
export class TracksService {
  constructor(
    @InjectRepository(Track)
    private tracksRepository: Repository<Track>,
  ) {}

  async create(createTrackDto: Partial<Track>): Promise<Track> {
    const track = this.tracksRepository.create(createTrackDto);
    return await this.tracksRepository.save(track);
  }

  async findAll(): Promise<Track[]> {
    return await this.tracksRepository.find();
  }

  async findOne(id: string): Promise<Track | null> {
    return await this.tracksRepository.findOne({ where: { id } });
  }

  async update(id: string, updateTrackDto: Partial<Track>): Promise<Track> {
    await this.tracksRepository.update(id, updateTrackDto);
    const updated = await this.findOne(id);
    if (!updated) {
      throw new Error('Track not found');
    }
    return updated;
  }

  async remove(id: string): Promise<void> {
    await this.tracksRepository.delete(id);
  }
}

