import React from 'react';
import { 
  Star, 
  Eye, 
  MoreHorizontal, 
  Trash2, 
  FolderInput, 
  Sliders, 
  MapPin, 
  Calendar,
  Sparkles
} from 'lucide-react';
import { Photo, PhotoFilter } from '../types';
import { retroAudio } from '../utils/audio';

interface PolaroidCardProps {
  photo: Photo;
  albumName?: string;
  onSelectPhoto: (photo: Photo) => void;
  onToggleFavorite: (photoId: string) => void;
  onDeletePhoto: (photoId: string) => void;
  onChangeFilter?: (photoId: string, filter: PhotoFilter) => void;
  onMovePhoto?: (photo: Photo) => void;
  tapeColor?: 'default' | 'red' | 'yellow';
  rotationClass?: string;
}

export const PolaroidCard: React.FC<PolaroidCardProps> = ({
  photo,
  albumName,
  onSelectPhoto,
  onToggleFavorite,
  onDeletePhoto,
  onChangeFilter,
  onMovePhoto,
  tapeColor = 'default',
  rotationClass = 'rotate-0'
}) => {
  const [showOptions, setShowOptions] = React.useState(false);

  // Washi tape class selector
  const getTapeClass = () => {
    switch (tapeColor) {
      case 'red':
        return 'washi-tape-red';
      case 'yellow':
        return 'washi-tape-yellow';
      default:
        return 'washi-tape';
    }
  };

  return (
    <div 
      className={`group relative bg-[#fffdfa] p-3 pt-4 pb-6 rounded-sm border border-[#d8c8b4] shadow-md hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1.5 hover:rotate-0 hover:z-20 cursor-pointer ${rotationClass}`}
      onClick={() => {
        retroAudio.playPaperFlip();
        onSelectPhoto(photo);
      }}
    >
      {/* Top Masking Tape Effect */}
      <div 
        className={`${getTapeClass()} absolute -top-3 left-1/2 -translate-x-1/2 w-20 h-5 transform -rotate-2 z-10`}
      />

      {/* Favorite Star Badge Top Right */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          retroAudio.playPaperFlip();
          onToggleFavorite(photo.id);
        }}
        className="absolute top-2 right-2 z-20 p-1.5 bg-[#fbf6ee]/80 hover:bg-[#fff] rounded-full shadow-sm text-[#d4a373] transition-transform hover:scale-110"
        title={photo.favorite ? 'Remover das Favoritas' : 'Marcar como Especial / Favorita'}
      >
        <Star 
          className={`w-4 h-4 transition-all ${
            photo.favorite ? 'fill-[#d4a373] text-[#b57a44]' : 'text-[#b59a7c] hover:text-[#d4a373]'
          }`} 
        />
      </button>

      {/* Photo Image Canvas Container */}
      <div className="relative w-full aspect-[4/3] bg-[#1e130c] overflow-hidden rounded-xs border border-[#e2d5c3]">
        <img
          src={photo.url}
          alt={photo.title}
          referrerPolicy="no-referrer"
          className={`w-full h-full object-cover transition-all duration-500 group-hover:scale-105 filter-${photo.filter || 'original'}`}
        />

        {/* Vintage Vignette Overlay */}
        <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_20px_rgba(0,0,0,0.3)]" />

        {/* Quick View Hover Button */}
        <div className="absolute inset-0 bg-[#1e130c]/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
          <span className="px-3 py-1.5 bg-[#f6f1e8] text-[#3c2f25] text-xs font-typewriter font-bold rounded shadow-lg flex items-center gap-1.5 transform translate-y-2 group-hover:translate-y-0 transition-transform">
            <Eye className="w-3.5 h-3.5" />
            <span>Ver Memória</span>
          </span>
        </div>
      </div>

      {/* Polaroid Handwritten Caption Section */}
      <div className="mt-3 px-1 flex flex-col justify-between min-h-[50px]">
        <div>
          <h4 className="font-handwriting text-xl text-[#2c1d11] font-bold leading-tight line-clamp-1">
            {photo.title || 'Sem título'}
          </h4>
          
          {photo.location && (
            <p className="font-typewriter text-[11px] text-[#8c6f52] flex items-center gap-1 mt-0.5 line-clamp-1">
              <MapPin className="w-3 h-3 shrink-0 text-[#b57a44]" />
              <span>{photo.location}</span>
            </p>
          )}
        </div>

        {/* Bottom Vintage Date Stamp in Stamp Red Ink Style */}
        <div className="mt-2 pt-1 border-t border-[#f0e6d6] flex items-center justify-between">
          <span className="font-stamp text-[11px] text-[#a83232] font-semibold tracking-wider flex items-center gap-1">
            <Calendar className="w-3 h-3 text-[#a83232]" />
            <span>{photo.date || 'DATA DESCONHECIDA'}</span>
          </span>

          {albumName && (
            <span className="font-typewriter text-[10px] text-[#8c6239] bg-[#f5ebe0] px-2 py-0.5 rounded truncate max-w-[110px]">
              {albumName}
            </span>
          )}
        </div>
      </div>

      {/* Photo Actions Context Button */}
      <div className="absolute bottom-2 right-2 z-20" onClick={(e) => e.stopPropagation()}>
        <button
          onClick={() => setShowOptions(!showOptions)}
          className="p-1 text-[#b59a7c] hover:text-[#3c2f25] hover:bg-[#f3ece0] rounded transition-colors"
          title="Opções da foto"
        >
          <MoreHorizontal className="w-4 h-4" />
        </button>

        {showOptions && (
          <div className="absolute right-0 bottom-6 w-40 bg-[#fbf6ee] border border-[#8c6239] rounded shadow-xl py-1 text-xs font-typewriter text-[#3c2f25] z-30">
            {onMovePhoto && (
              <button
                onClick={() => {
                  setShowOptions(false);
                  onMovePhoto(photo);
                }}
                className="w-full text-left px-3 py-1.5 hover:bg-[#e8dec8] flex items-center gap-2"
              >
                <FolderInput className="w-3.5 h-3.5 text-[#8c6239]" />
                <span>Mover de Pasta</span>
              </button>
            )}

            <button
              onClick={() => {
                setShowOptions(false);
                onSelectPhoto(photo);
              }}
              className="w-full text-left px-3 py-1.5 hover:bg-[#e8dec8] flex items-center gap-2"
            >
              <Eye className="w-3.5 h-3.5 text-[#8c6239]" />
              <span>Ver no Detalhe</span>
            </button>

            <button
              onClick={() => {
                setShowOptions(false);
                if (window.confirm(`Excluir a foto "${photo.title}"?`)) {
                  onDeletePhoto(photo.id);
                }
              }}
              className="w-full text-left px-3 py-1.5 hover:bg-[#f3dada] flex items-center gap-2 text-red-800"
            >
              <Trash2 className="w-3.5 h-3.5 text-red-700" />
              <span>Excluir Foto</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
