import { get, set } from 'idb-keyval';
import { Album, Photo } from '../types';
import { INITIAL_ALBUMS, INITIAL_PHOTOS } from '../data/initialData';

const ALBUMS_KEY = 'vintage_albums_data_v1';
const PHOTOS_KEY = 'vintage_photos_data_v1';

export const storageService = {
  async getAlbums(): Promise<Album[]> {
    try {
      const data = await get<Album[]>(ALBUMS_KEY);
      if (data && Array.isArray(data) && data.length > 0) {
        return data;
      }
    } catch (e) {
      console.warn('Failed to read albums from IndexedDB, fallback to defaults', e);
    }
    // Save defaults if empty
    await this.saveAlbums(INITIAL_ALBUMS);
    return INITIAL_ALBUMS;
  },

  async saveAlbums(albums: Album[]): Promise<void> {
    try {
      await set(ALBUMS_KEY, albums);
    } catch (e) {
      console.error('Failed to save albums to IndexedDB', e);
    }
  },

  async getPhotos(): Promise<Photo[]> {
    try {
      const data = await get<Photo[]>(PHOTOS_KEY);
      if (data && Array.isArray(data) && data.length > 0) {
        return data;
      }
    } catch (e) {
      console.warn('Failed to read photos from IndexedDB, fallback to defaults', e);
    }
    // Save defaults if empty
    await this.savePhotos(INITIAL_PHOTOS);
    return INITIAL_PHOTOS;
  },

  async savePhotos(photos: Photo[]): Promise<void> {
    try {
      await set(PHOTOS_KEY, photos);
    } catch (e) {
      console.error('Failed to save photos to IndexedDB', e);
    }
  },

  async resetToDefaults(): Promise<{ albums: Album[]; photos: Photo[] }> {
    await this.saveAlbums(INITIAL_ALBUMS);
    await this.savePhotos(INITIAL_PHOTOS);
    return { albums: INITIAL_ALBUMS, photos: INITIAL_PHOTOS };
  }
};
