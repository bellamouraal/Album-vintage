import React from 'react';
import { Calendar, Clock, Sparkles } from 'lucide-react';
import { Photo, Album } from '../types';
import { PolaroidCard } from './PolaroidCard';

interface TimelineViewProps {
  photos: Photo[];
  albums: Album[];
  onSelectPhoto: (photo: Photo) => void;
  onToggleFavorite: (photoId: string) => void;
  onDeletePhoto: (photoId: string) => void;
}

export const TimelineView: React.FC<TimelineViewProps> = ({
  photos,
  albums,
  onSelectPhoto,
  onToggleFavorite,
  onDeletePhoto,
}) => {
  // Group photos by year / era
  const groupedPhotos = React.useMemo(() => {
    const groups: { [key: string]: Photo[] } = {};

    photos.forEach((photo) => {
      let eraKey = 'Sem Data Definida';

      if (photo.year) {
        eraKey = `Ano ${photo.year}`;
      } else {
        const yearMatch = photo.date?.match(/\b(19\d\d|20\d\d)\b/);
        if (yearMatch) {
          eraKey = `Ano ${yearMatch[1]}`;
        }
      }

      if (!groups[eraKey]) {
        groups[eraKey] = [];
      }
      groups[eraKey].push(photo);
    });

    // Sort era keys descending (newest to oldest)
    const sortedKeys = Object.keys(groups).sort((a, b) => {
      if (a === 'Sem Data Definida') return 1;
      if (b === 'Sem Data Definida') return -1;
      return b.localeCompare(a);
    });

    return sortedKeys.map((key) => ({
      era: key,
      photos: groups[key],
    }));
  }, [photos]);

  const getAlbumName = (albumId: string) => {
    const album = albums.find((a) => a.id === albumId);
    return album ? album.name : '';
  };

  const rotations = ['rotate-1', '-rotate-2', 'rotate-2', '-rotate-1', 'rotate-0'];

  return (
    <div className="space-y-10 relative">
      
      {/* Decorative Scrapbook Timeline Line */}
      <div className="absolute top-0 bottom-0 left-4 sm:left-8 w-1 bg-gradient-to-b from-[#8c6239] via-[#d4a373] to-[#8c6239] hidden sm:block opacity-40" />

      {groupedPhotos.length === 0 ? (
        <div className="text-center py-12 bg-[#f2ebd9] border-2 border-dashed border-[#8c6239] rounded-lg p-6">
          <Calendar className="w-12 h-12 text-[#8c6239] mx-auto mb-3" />
          <p className="font-serif-vintage text-xl font-bold text-[#3c2f25]">Nenhuma memória encontrada no tempo</p>
          <p className="font-typewriter text-xs text-[#6e5a47] mt-1">Adicione fotos informando o ano ou data para organizar a linha do tempo.</p>
        </div>
      ) : (
        groupedPhotos.map((group, groupIdx) => (
          <div key={group.era} className="relative sm:pl-16 space-y-4">
            
            {/* Year Stamp Marker */}
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex absolute -left-3 w-8 h-8 rounded-full bg-[#8c6239] text-[#f3ece0] border-2 border-[#f6f1e8] items-center justify-center font-stamp text-xs shadow-md">
                ★
              </div>

              <div className="inline-block bg-[#2c1e16] text-[#f3ece0] px-4 py-1.5 rounded border-2 border-[#8c6239] shadow-md">
                <span className="font-stamp text-sm sm:text-base font-bold text-[#d4a373] tracking-widest uppercase flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[#d4a373]" />
                  <span>{group.era}</span>
                  <span className="text-xs text-[#b59a7c] font-typewriter">({group.photos.length} fotos)</span>
                </span>
              </div>
            </div>

            {/* Grid of Polaroid Cards for this Era */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pt-2">
              {group.photos.map((photo, photoIdx) => (
                <PolaroidCard
                  key={photo.id}
                  photo={photo}
                  albumName={getAlbumName(photo.albumId)}
                  onSelectPhoto={onSelectPhoto}
                  onToggleFavorite={onToggleFavorite}
                  onDeletePhoto={onDeletePhoto}
                  rotationClass={rotations[(groupIdx + photoIdx) % rotations.length]}
                  tapeColor={photoIdx % 3 === 0 ? 'red' : photoIdx % 3 === 1 ? 'yellow' : 'default'}
                />
              ))}
            </div>

          </div>
        ))
      )}

    </div>
  );
};
