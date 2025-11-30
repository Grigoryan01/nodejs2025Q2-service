import { Injectable } from '@nestjs/common';
import { User } from '../entities/user.entity';
import { Artist } from '../entities/artist.entity';
import { Track } from '../entities/track.entity';
import { Album } from '../entities/album.entity';
import { Favorites } from '../entities/favorites.entity';

@Injectable()
export class InMemoryStorageService {
  private users: User[] = [];
  private artists: Artist[] = [];
  private tracks: Track[] = [];
  private albums: Album[] = [];
  private favorites: Favorites = {
    artists: [],
    albums: [],
    tracks: [],
  };

  getAllUsers(): User[] {
    return this.users;
  }

  getUserById(id: string): User | undefined {
    return this.users.find((user) => user.id === id);
  }

  createUser(user: User): User {
    this.users.push(user);
    return user;
  }

  updateUser(id: string, updatedUser: Partial<User>): User | null {
    const index = this.users.findIndex((user) => user.id === id);
    if (index === -1) return null;
    this.users[index] = { ...this.users[index], ...updatedUser };
    return this.users[index];
  }

  deleteUser(id: string): boolean {
    const index = this.users.findIndex((user) => user.id === id);
    if (index === -1) return false;
    this.users.splice(index, 1);
    return true;
  }

  // Artist methods
  getAllArtists(): Artist[] {
    return this.artists;
  }

  getArtistById(id: string): Artist | undefined {
    return this.artists.find((artist) => artist.id === id);
  }

  createArtist(artist: Artist): Artist {
    this.artists.push(artist);
    return artist;
  }

  updateArtist(id: string, updatedArtist: Partial<Artist>): Artist | null {
    const index = this.artists.findIndex((artist) => artist.id === id);
    if (index === -1) return null;
    this.artists[index] = { ...this.artists[index], ...updatedArtist };
    return this.artists[index];
  }

  deleteArtist(id: string): boolean {
    const index = this.artists.findIndex((artist) => artist.id === id);
    if (index === -1) return false;
    this.artists.splice(index, 1);

    // Cascade: Update albums and tracks
    this.albums.forEach((album) => {
      if (album.artistId === id) {
        album.artistId = null;
      }
    });

    this.tracks.forEach((track) => {
      if (track.artistId === id) {
        track.artistId = null;
      }
    });

    // Remove from favorites
    this.favorites.artists = this.favorites.artists.filter(
      (artistId) => artistId !== id,
    );

    return true;
  }

  // Track methods
  getAllTracks(): Track[] {
    return this.tracks;
  }

  getTrackById(id: string): Track | undefined {
    return this.tracks.find((track) => track.id === id);
  }

  createTrack(track: Track): Track {
    this.tracks.push(track);
    return track;
  }

  updateTrack(id: string, updatedTrack: Partial<Track>): Track | null {
    const index = this.tracks.findIndex((track) => track.id === id);
    if (index === -1) return null;
    this.tracks[index] = { ...this.tracks[index], ...updatedTrack };
    return this.tracks[index];
  }

  deleteTrack(id: string): boolean {
    const index = this.tracks.findIndex((track) => track.id === id);
    if (index === -1) return false;
    this.tracks.splice(index, 1);

    // Remove from favorites
    this.favorites.tracks = this.favorites.tracks.filter(
      (trackId) => trackId !== id,
    );

    return true;
  }

  // Album methods
  getAllAlbums(): Album[] {
    return this.albums;
  }

  getAlbumById(id: string): Album | undefined {
    return this.albums.find((album) => album.id === id);
  }

  createAlbum(album: Album): Album {
    this.albums.push(album);
    return album;
  }

  updateAlbum(id: string, updatedAlbum: Partial<Album>): Album | null {
    const index = this.albums.findIndex((album) => album.id === id);
    if (index === -1) return null;
    this.albums[index] = { ...this.albums[index], ...updatedAlbum };
    return this.albums[index];
  }

  deleteAlbum(id: string): boolean {
    const index = this.albums.findIndex((album) => album.id === id);
    if (index === -1) return false;
    this.albums.splice(index, 1);

    // Cascade: Update tracks
    this.tracks.forEach((track) => {
      if (track.albumId === id) {
        track.albumId = null;
      }
    });

    // Remove from favorites
    this.favorites.albums = this.favorites.albums.filter(
      (albumId) => albumId !== id,
    );

    return true;
  }

  // Favorites methods
  getFavorites(): Favorites {
    return this.favorites;
  }

  addTrackToFavorites(trackId: string): void {
    if (!this.favorites.tracks.includes(trackId)) {
      this.favorites.tracks.push(trackId);
    }
  }

  removeTrackFromFavorites(trackId: string): boolean {
    const index = this.favorites.tracks.indexOf(trackId);
    if (index === -1) return false;
    this.favorites.tracks.splice(index, 1);
    return true;
  }

  addAlbumToFavorites(albumId: string): void {
    if (!this.favorites.albums.includes(albumId)) {
      this.favorites.albums.push(albumId);
    }
  }

  removeAlbumFromFavorites(albumId: string): boolean {
    const index = this.favorites.albums.indexOf(albumId);
    if (index === -1) return false;
    this.favorites.albums.splice(index, 1);
    return true;
  }

  addArtistToFavorites(artistId: string): void {
    if (!this.favorites.artists.includes(artistId)) {
      this.favorites.artists.push(artistId);
    }
  }

  removeArtistFromFavorites(artistId: string): boolean {
    const index = this.favorites.artists.indexOf(artistId);
    if (index === -1) return false;
    this.favorites.artists.splice(index, 1);
    return true;
  }
}

