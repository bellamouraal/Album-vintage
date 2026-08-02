export type AlbumCategory = 'family' | 'college' | 'work' | 'travel' | 'custom';

export type PhotoFilter = 'original' | 'sepia' | 'vintage-70s' | 'black-white' | 'kodachrome' | 'faded' | 'film-grain';

export interface Photo {
  id: string;
  albumId: string;
  title: string;
  url: string;
  date: string; // e.g. "14/10/1998" or "Verão de 1995"
  year?: number; // e.g. 1998 for timeline grouping
  location: string; // e.g. "Sítio do Vovô - Itu, SP"
  caption: string; // Handwritten journal note on back or bottom
  filter: PhotoFilter;
  tags: string[];
  favorite: boolean;
  cameraInfo?: string; // e.g. "Kodak ColorPlus 200 • Olympus OM-1"
  createdAt: number;
}

export interface Album {
  id: string;
  name: string;
  category: AlbumCategory;
  description: string;
  coverUrl?: string;
  color: string; // Hex or CSS color string for album binder color
  sticker?: string; // Vintage badge/stamp label e.g., "RECORDAÇÕES", "SECRET", "1990-1995"
  icon: string; // Lucide icon identifier or badge
  createdAt: number;
}

export type ViewMode = 'albums' | 'album-detail' | 'all-photos' | 'timeline' | 'slideshow' | 'favorites';

export type DisplayLayout = 'polaroid-board' | 'scrapbook' | 'compact-grid' | 'filmstrip';
