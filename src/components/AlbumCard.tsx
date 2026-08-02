import React from 'react';
import { 
  Folder, 
  Image as ImageIcon, 
  MoreVertical, 
  Edit3, 
  Trash2, 
  Users, 
  GraduationCap, 
  Briefcase, 
  Compass, 
  Bookmark,
  Sparkles
} from 'lucide-react';
import { Album, Photo } from '../types';
import { retroAudio } from '../utils/audio';

interface AlbumCardProps {
  album: Album;
  photos: Photo[];
  onSelectAlbum: (albumId: string) => void;
  onEditAlbum: (album: Album) => void;
  onDeleteAlbum: (albumId: string) => void;
}

export const AlbumCard: React.FC<AlbumCardProps> = ({
  album,
  photos,
  onSelectAlbum,
  onEditAlbum,
  onDeleteAlbum,
}) => {
  const [showMenu, setShowMenu] = React.useState(false);

  // Get icon component
  const getCategoryIcon = () => {
    switch (album.category) {
      case 'family':
        return <Users className="w-4 h-4" />;
      case 'college':
        return <GraduationCap className="w-4 h-4" />;
      case 'work':
        return <Briefcase className="w-4 h-4" />;
      case 'travel':
        return <Compass className="w-4 h-4" />;
      default:
        return <Bookmark className="w-4 h-4" />;
    }
  };

  // Cover image URL logic
  const coverPhoto = photos.find((p) => p.url === album.coverUrl) || photos[0];
  const photoCount = photos.length;

  return (
    <div 
      className="group relative bg-[#f2ebd9] border-2 border-[#8c6239] rounded-lg shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 flex flex-col justify-between overflow-hidden cursor-pointer"
      onClick={() => {
        retroAudio.playPaperFlip();
        onSelectAlbum(album.id);
      }}
    >
      {/* Folder Tab Effect at Top */}
      <div 
        className="h-3 w-28 absolute top-0 left-4 rounded-b-md shadow-inner border-b border-x border-[#8c6239]/40 z-10"
        style={{ backgroundColor: album.color || '#8B4513' }}
      />

      {/* Album Binder Leather Header Line */}
      <div 
        className="h-2 w-full"
        style={{ backgroundColor: album.color || '#8B4513' }}
      />

      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        
        {/* Top Header: Badge, Category, Menu */}
        <div>
          <div className="flex items-center justify-between gap-2 mb-2">
            <span 
              className="text-[11px] font-typewriter font-semibold px-2.5 py-0.5 rounded-full border border-[#8c6239]/30 flex items-center gap-1.5 shadow-sm"
              style={{ backgroundColor: `${album.color}20`, color: album.color }}
            >
              {getCategoryIcon()}
              <span>{album.name}</span>
            </span>

            {/* Vintage Stamp / Label */}
            {album.sticker && (
              <span className="font-stamp text-[9px] bg-[#d4a373] text-[#1e130c] font-bold px-2 py-0.5 rounded border border-[#8c6239] shadow-sm tracking-wider uppercase transform rotate-1">
                {album.sticker}
              </span>
            )}

            {/* Options Menu Button */}
            <div className="relative" onClick={(e) => e.stopPropagation()}>
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="p-1 text-[#8c6239] hover:text-[#3c2f25] hover:bg-[#e8dec8] rounded transition-colors"
                title="Opções do álbum"
              >
                <MoreVertical className="w-4 h-4" />
              </button>

              {showMenu && (
                <div className="absolute right-0 mt-1 w-36 bg-[#fbf6ee] border border-[#8c6239] rounded shadow-xl z-20 py-1 text-xs font-typewriter text-[#3c2f25]">
                  <button
                    onClick={() => {
                      setShowMenu(false);
                      onEditAlbum(album);
                    }}
                    className="w-full text-left px-3 py-1.5 hover:bg-[#e8dec8] flex items-center gap-2 text-[#3c2f25]"
                  >
                    <Edit3 className="w-3.5 h-3.5 text-[#8c6239]" />
                    <span>Editar Pasta</span>
                  </button>
                  <button
                    onClick={() => {
                      setShowMenu(false);
                      if (window.confirm(`Deseja excluir a pasta "${album.name}"? As fotos continuarão salvas.`)) {
                        onDeleteAlbum(album.id);
                      }
                    }}
                    className="w-full text-left px-3 py-1.5 hover:bg-[#f3dada] flex items-center gap-2 text-red-800"
                  >
                    <Trash2 className="w-3.5 h-3.5 text-red-700" />
                    <span>Excluir Pasta</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          <h3 className="font-serif-vintage text-lg sm:text-xl font-bold text-[#3c2f25] group-hover:text-[#8c6239] transition-colors line-clamp-1">
            {album.name}
          </h3>

          <p className="font-typewriter text-xs text-[#6e5a47] mt-1 line-clamp-2 leading-relaxed">
            {album.description || 'Pasta de fotos e recordações personalizadas.'}
          </p>
        </div>

        {/* Cover Photo Stack Simulation */}
        <div className="my-4 relative flex items-center justify-center min-h-[140px]">
          {/* Back photo tilt shadow */}
          <div className="absolute w-11/12 h-28 bg-[#e8dec8] border border-[#b59a7c] rounded transform -rotate-3 translate-y-1 shadow" />
          
          {/* Middle photo tilt */}
          <div className="absolute w-11/12 h-28 bg-[#fdfaf5] border border-[#b59a7c] rounded transform rotate-2 translate-y-0.5 shadow-md" />

          {/* Front Photo Polaroid Frame */}
          <div className="relative w-full h-32 bg-[#fff] p-2 pt-2 pb-5 border border-[#c4b19c] rounded shadow-md group-hover:rotate-0 transition-transform duration-300">
            {/* Tape effect on photo */}
            <div className="washi-tape absolute -top-2 left-1/2 -translate-x-1/2 w-16 h-4 transform -rotate-1 z-10" />

            {coverPhoto ? (
              <div className="w-full h-full bg-[#1e130c] overflow-hidden rounded-sm relative">
                <img
                  src={coverPhoto.url}
                  alt={album.name}
                  referrerPolicy="no-referrer"
                  className={`w-full h-full object-cover transition-all duration-500 group-hover:scale-105 filter-${coverPhoto.filter || 'sepia'}`}
                />
              </div>
            ) : (
              <div className="w-full h-full bg-[#f3ece0] border border-dashed border-[#b59a7c] flex flex-col items-center justify-center text-[#b59a7c] gap-1">
                <ImageIcon className="w-6 h-6 stroke-[1.5]" />
                <span className="font-typewriter text-[10px]">Sem fotos</span>
              </div>
            )}

            {/* Handwritten note at bottom of polaroid */}
            <div className="absolute bottom-1 left-2 right-2 text-center">
              <p className="font-handwriting text-sm text-[#3c2f25] truncate">
                {coverPhoto ? coverPhoto.title : album.name}
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Footer: Photo Counter & Entry Stamp */}
        <div className="pt-2 border-t border-[#8c6239]/20 flex items-center justify-between text-xs font-typewriter text-[#6e5a47]">
          <span className="flex items-center gap-1.5">
            <ImageIcon className="w-3.5 h-3.5 text-[#8c6239]" />
            <span className="font-bold">{photoCount}</span> {photoCount === 1 ? 'foto' : 'fotos'}
          </span>

          <span className="text-[11px] text-[#8c6239] font-semibold group-hover:translate-x-1 transition-transform flex items-center gap-1">
            <span>Abrir Pasta</span>
            <span>→</span>
          </span>
        </div>

      </div>
    </div>
  );
};
