import React, { useState, useEffect } from 'react';
import { 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Play, 
  Pause, 
  Tv, 
  MapPin, 
  Calendar, 
  Camera,
  RotateCcw
} from 'lucide-react';
import { Photo, Album } from '../types';
import { retroAudio } from '../utils/audio';

interface SlideshowModalProps {
  photos: Photo[];
  albums: Album[];
  initialPhotoIndex?: number;
  onClose: () => void;
}

export const SlideshowModal: React.FC<SlideshowModalProps> = ({
  photos,
  albums,
  initialPhotoIndex = 0,
  onClose,
}) => {
  const [currentIndex, setCurrentIndex] = useState(initialPhotoIndex);
  const [isPlaying, setIsPlaying] = useState(true);
  const [intervalTime, setIntervalTime] = useState(4000); // 4 seconds per slide

  const currentPhoto = photos[currentIndex];
  const currentAlbum = currentPhoto ? albums.find((a) => a.id === currentPhoto.albumId) : null;

  const nextSlide = () => {
    retroAudio.playProjectorClick();
    setCurrentIndex((prev) => (prev + 1) % photos.length);
  };

  const prevSlide = () => {
    retroAudio.playProjectorClick();
    setCurrentIndex((prev) => (prev - 1 + photos.length) % photos.length);
  };

  // Autoplay timer
  useEffect(() => {
    if (!isPlaying || photos.length === 0) return;
    const timer = setInterval(() => {
      nextSlide();
    }, intervalTime);
    return () => clearInterval(timer);
  }, [isPlaying, currentIndex, intervalTime, photos.length]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') nextSlide();
      if (e.key === 'ArrowLeft') prevSlide();
      if (e.key === 'Escape') onClose();
      if (e.key === ' ') setIsPlaying((p) => !p);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  if (!currentPhoto || photos.length === 0) {
    return (
      <div className="fixed inset-0 z-50 bg-[#0f0b08] text-[#e8dec8] flex items-center justify-center p-4">
        <div className="text-center font-typewriter">
          <p className="text-lg">Nenhuma foto no repositório para o projetor de slides.</p>
          <button onClick={onClose} className="mt-4 px-4 py-2 bg-[#8c6239] text-[#fff] rounded">
            Voltar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-[#0c0805] text-[#f3ece0] flex flex-col justify-between p-4 sm:p-6 overflow-hidden select-none">
      
      {/* Top Projector Controls Bar */}
      <div className="flex items-center justify-between border-b border-[#3c281b] pb-3 z-10">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-[#2c1d11] rounded border border-[#8c6239] text-[#d4a373]">
            <Tv className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h2 className="font-serif-vintage text-lg font-bold text-[#f3ece0]">
              Projetor de Slides Vintage
            </h2>
            <p className="font-typewriter text-xs text-[#b59a7c]">
              Slide {currentIndex + 1} de {photos.length} • {currentAlbum ? currentAlbum.name : 'Geral'}
            </p>
          </div>
        </div>

        {/* Slide Controls */}
        <div className="flex items-center gap-3 font-typewriter text-xs">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="px-3 py-1.5 bg-[#2c1d11] hover:bg-[#3c281b] text-[#d4a373] border border-[#8c6239] rounded flex items-center gap-1.5 transition-colors font-bold"
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            <span>{isPlaying ? 'Pausar' : 'Iniciar'}</span>
          </button>

          <select
            value={intervalTime}
            onChange={(e) => setIntervalTime(Number(e.target.value))}
            className="bg-[#2c1d11] text-[#e8dec8] border border-[#8c6239] rounded px-2 py-1 text-xs"
          >
            <option value={3000}>3 segundos</option>
            <option value={5000}>5 segundos</option>
            <option value={8000}>8 segundos</option>
          </select>

          <button
            onClick={onClose}
            className="p-1.5 bg-[#2c1d11] hover:bg-[#4a3220] text-[#b59a7c] hover:text-[#fff] rounded border border-[#8c6239]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Slide Canvas with Warm Lamp Light Cone Effect */}
      <div className="relative flex-1 my-4 flex items-center justify-center overflow-hidden">
        
        {/* Projector Light Beam Glow Effect */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-gradient-to-b from-[#f3ece0]/10 via-[#d4a373]/5 to-transparent pointer-events-none" />

        {/* Left Nav Button */}
        <button
          onClick={prevSlide}
          className="absolute left-2 sm:left-6 z-20 p-3 bg-[#2c1d11]/80 hover:bg-[#d4a373] hover:text-[#1e130c] text-[#f3ece0] rounded-full border border-[#8c6239] shadow-2xl transition-all transform hover:scale-110"
          title="Slide Anterior"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        {/* Center Polaroid Slide Frame */}
        <div className="relative max-w-3xl max-h-[70vh] bg-[#fffdfa] p-4 pb-12 rounded-sm border-2 border-[#d8c8b4] shadow-[0_0_50px_rgba(212,163,115,0.25)] flex flex-col items-center justify-center transition-all duration-500">
          
          <div className="max-h-[55vh] overflow-hidden rounded-xs bg-[#1a110a]">
            <img
              src={currentPhoto.url}
              alt={currentPhoto.title}
              referrerPolicy="no-referrer"
              className={`max-h-[55vh] w-auto object-contain filter-${currentPhoto.filter || 'sepia'}`}
            />
          </div>

          {/* Polaroid Bottom Title & Date */}
          <div className="mt-4 text-center px-4 w-full">
            <h3 className="font-handwriting text-2xl sm:text-3xl text-[#2c1d11] font-bold truncate">
              {currentPhoto.title}
            </h3>

            <div className="flex items-center justify-center gap-4 mt-1 font-typewriter text-xs text-[#8c6f52]">
              <span className="font-stamp text-[#a83232] font-bold text-sm flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-[#a83232]" />
                {currentPhoto.date}
              </span>

              {currentPhoto.location && (
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-[#b57a44]" />
                  {currentPhoto.location}
                </span>
              )}

              {currentPhoto.cameraInfo && (
                <span className="hidden sm:flex items-center gap-1 italic">
                  <Camera className="w-3.5 h-3.5 text-[#8c6239]" />
                  {currentPhoto.cameraInfo}
                </span>
              )}
            </div>

            {currentPhoto.caption && (
              <p className="font-handwriting text-lg text-[#3c2f25] mt-2 line-clamp-2 max-w-xl mx-auto italic">
                "{currentPhoto.caption}"
              </p>
            )}
          </div>

        </div>

        {/* Right Nav Button */}
        <button
          onClick={nextSlide}
          className="absolute right-2 sm:right-6 z-20 p-3 bg-[#2c1d11]/80 hover:bg-[#d4a373] hover:text-[#1e130c] text-[#f3ece0] rounded-full border border-[#8c6239] shadow-2xl transition-all transform hover:scale-110"
          title="Próximo Slide"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

      </div>

      {/* Slide Thumbnails Filmstrip at Bottom */}
      <div className="pt-2 border-t border-[#3c281b] flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
        {photos.map((p, idx) => (
          <button
            key={p.id}
            onClick={() => {
              retroAudio.playProjectorClick();
              setCurrentIndex(idx);
            }}
            className={`relative shrink-0 w-14 h-12 rounded border overflow-hidden transition-all ${
              currentIndex === idx
                ? 'border-2 border-[#d4a373] scale-110 shadow-lg'
                : 'border-[#3c281b] opacity-50 hover:opacity-100'
            }`}
          >
            <img
              src={p.url}
              alt={p.title}
              referrerPolicy="no-referrer"
              className={`w-full h-full object-cover filter-${p.filter || 'sepia'}`}
            />
          </button>
        ))}
      </div>

    </div>
  );
};
