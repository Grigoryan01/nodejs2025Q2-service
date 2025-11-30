import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InMemoryStorageService } from '../common/services/in-memory-storage.service';
import { FavoritesResponse } from '../entities/favorites.entity';

@Injectable()
export class FavoritesService {
  constructor(private readonly storage: InMemoryStorageService) {}

  findAll(): FavoritesResponse {
    const favorites = this.storage.getFavorites();
    const artists = favorites.artists
      .map((id) => this.storage.getArtistById(id))
      .filter((artist) => artist !== undefined);
    const albums = favorites.albums
      .map((id) => this.storage.getAlbumById(id))
      .filter((album) => album !== undefined);
    const tracks = favorites.tracks
      .map((id) => this.storage.getTrackById(id))
      .filter((track) => track !== undefined);

    return {
      artists: artists as any[],
      albums: albums as any[],
      tracks: tracks as any[],
    };
  }

  addTrack(id: string): void {
    const track = this.storage.getTrackById(id);
    if (!track) {
      throw new UnprocessableEntityException('Track with id does not exist');
    }
    this.storage.addTrackToFavorites(id);
  }

  removeTrack(id: string): void {
    const removed = this.storage.removeTrackFromFavorites(id);
    if (!removed) {
      throw new NotFoundException('Track is not favorite');
    }
  }

  addAlbum(id: string): void {
    const album = this.storage.getAlbumById(id);
    if (!album) {
      throw new UnprocessableEntityException('Album with id does not exist');
    }
    this.storage.addAlbumToFavorites(id);
  }

  removeAlbum(id: string): void {
    const removed = this.storage.removeAlbumFromFavorites(id);
    if (!removed) {
      throw new NotFoundException('Album is not favorite');
    }
  }

  addArtist(id: string): void {
    const artist = this.storage.getArtistById(id);
    if (!artist) {
      throw new UnprocessableEntityException('Artist with id does not exist');
    }
    this.storage.addArtistToFavorites(id);
  }

  removeArtist(id: string): void {
    const removed = this.storage.removeArtistFromFavorites(id);
    if (!removed) {
      throw new NotFoundException('Artist is not favorite');
    }
  }
}

