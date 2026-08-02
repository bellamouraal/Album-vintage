import React from 'react';
import { 
  Folder, 
  Image as ImageIcon, 
  Calendar, 
  Star, 
  Tv, 
  Plus, 
  FolderPlus, 
  Search, 
  Volume2, 
  VolumeX, 
  RotateCcw,
  Sparkles
} from 'lucide-react';
import { ViewMode } from '../types';
import { retroAudio } from '../utils/audio';

interface NavbarProps {
  currentView: ViewMode;
  onViewChange: (view: ViewMode) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onOpenAddPhoto: () => void;
  onOpenCreateAlbum: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onResetData: () => void;
  photoCount: number;
  albumCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onViewChange,
  searchQuery,
  onSearchChange,
  onOpenAddPhoto,
  onOpenCreateAlbum,
  soundEnabled,
  onToggleSound,
  onResetData,
  photoCount,
  albumCount
}) => {
  return (
    <header className="sticky top-0 z-30 bg-[#2c1e16] text-[#e8dec8] border-b-4 border-[#8c6239] shadow-xl">
      {/* Top Vintage Brass Header Strip */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Logo & Vintage Title */}
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-lg bg-gradient-to-br from-[#d4a373] to-[#8c6239] p-0.5 shadow-md flex items-center justify-center border border-[#e8dec8]/30">
              <div className="w-full h-full bg-[#1e130c] rounded-md flex items-center justify-center text-[#d4a373]">
                <Folder className="w-6 h-6" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-serif-vintage text-xl sm:text-2xl font-bold tracking-wide text-[#f3ece0]">
                  Álbum & Repositório Vintage
                </h1>
                <span className="font-stamp text-[10px] bg-[#d4a373] text-[#1e130c] px-2 py-0.5 rounded uppercase font-bold tracking-widest shadow">
                  ANALOG 1995
                </span>
              </div>
              <p className="font-typewriter text-xs text-[#b59a7c] flex items-center gap-2">
                <span>{albumCount} pastas salvas</span>
                <span>•</span>
                <span>{photoCount} memórias em foto</span>
              </p>
            </div>
          </div>

          {/* Search Bar in Typewriter Style */}
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-[#b59a7c]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Buscar foto, pasta, tag ou ano..."
              className="w-full pl-9 pr-4 py-1.5 bg-[#1a110a] text-[#f3ece0] text-sm font-typewriter rounded-md border border-[#8c6239]/50 focus:outline-none focus:border-[#d4a373] placeholder-[#8c6239]"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-2 top-2 text-xs font-typewriter text-[#b59a7c] hover:text-[#f3ece0]"
              >
                ✕
              </button>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 flex-wrap justify-end">
            <button
              onClick={() => {
                retroAudio.playPaperFlip();
                onOpenCreateAlbum();
              }}
              className="px-3 py-1.5 bg-[#4a3425] hover:bg-[#5c4230] text-[#f3ece0] rounded-md border border-[#8c6239] text-xs font-typewriter font-semibold flex items-center gap-1.5 transition-all shadow-sm hover:border-[#d4a373]"
              title="Criar nova pasta personalizada"
            >
              <FolderPlus className="w-4 h-4 text-[#d4a373]" />
              <span className="hidden sm:inline">Nova Pasta</span>
            </button>

            <button
              onClick={() => {
                retroAudio.playShutterSound();
                onOpenAddPhoto();
              }}
              className="px-3 py-1.5 bg-gradient-to-r from-[#d4a373] to-[#b57a44] hover:from-[#e2b080] hover:to-[#c68951] text-[#1e130c] font-semibold rounded-md border border-[#f3ece0]/30 text-xs font-typewriter flex items-center gap-1.5 transition-all shadow-md active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Adicionar Foto</span>
            </button>

            <div className="h-6 w-px bg-[#8c6239]/50 mx-1 hidden sm:block" />

            <button
              onClick={onToggleSound}
              className={`p-1.5 rounded-md border text-xs transition-colors ${
                soundEnabled 
                  ? 'bg-[#8c6239]/30 text-[#d4a373] border-[#8c6239]' 
                  : 'bg-[#1a110a] text-[#8c6239] border-[#4a3425]'
              }`}
              title={soundEnabled ? 'Efeitos de Áudio Ativos (Clique para silenciar)' : 'Áudio Silenciado (Clique para ativar)'}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>

            <button
              onClick={() => {
                if (window.confirm('Deseja restaurar os álbuns e fotos padrão do sistema?')) {
                  onResetData();
                }
              }}
              className="p-1.5 bg-[#1a110a] hover:bg-[#382317] text-[#b59a7c] hover:text-[#f3ece0] rounded-md border border-[#4a3425] text-xs transition-colors"
              title="Restaurar dados padrão"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

        </div>

        {/* View Mode Tabs (Folder Binder Style) */}
        <nav className="mt-3 pt-2 border-t border-[#8c6239]/30 flex items-center justify-between overflow-x-auto no-scrollbar gap-2">
          <div className="flex items-center gap-1 sm:gap-2">
            <button
              onClick={() => {
                retroAudio.playPaperFlip();
                onViewChange('albums');
              }}
              className={`px-3 py-1.5 rounded-t-md font-typewriter text-xs font-medium flex items-center gap-2 transition-all border-t border-x ${
                currentView === 'albums' || currentView === 'album-detail'
                  ? 'bg-[#f6f1e8] text-[#3c2f25] border-[#8c6239] shadow-md font-bold -mb-px'
                  : 'bg-[#1a110a] text-[#b59a7c] hover:text-[#f3ece0] border-transparent'
              }`}
            >
              <Folder className="w-3.5 h-3.5 text-[#8c6239]" />
              <span>Pastas & Álbuns</span>
            </button>

            <button
              onClick={() => {
                retroAudio.playPaperFlip();
                onViewChange('all-photos');
              }}
              className={`px-3 py-1.5 rounded-t-md font-typewriter text-xs font-medium flex items-center gap-2 transition-all border-t border-x ${
                currentView === 'all-photos'
                  ? 'bg-[#f6f1e8] text-[#3c2f25] border-[#8c6239] shadow-md font-bold -mb-px'
                  : 'bg-[#1a110a] text-[#b59a7c] hover:text-[#f3ece0] border-transparent'
              }`}
            >
              <ImageIcon className="w-3.5 h-3.5 text-[#8c6239]" />
              <span>Todas as Fotos</span>
            </button>

            <button
              onClick={() => {
                retroAudio.playPaperFlip();
                onViewChange('timeline');
              }}
              className={`px-3 py-1.5 rounded-t-md font-typewriter text-xs font-medium flex items-center gap-2 transition-all border-t border-x ${
                currentView === 'timeline'
                  ? 'bg-[#f6f1e8] text-[#3c2f25] border-[#8c6239] shadow-md font-bold -mb-px'
                  : 'bg-[#1a110a] text-[#b59a7c] hover:text-[#f3ece0] border-transparent'
              }`}
            >
              <Calendar className="w-3.5 h-3.5 text-[#8c6239]" />
              <span>Linha do Tempo</span>
            </button>

            <button
              onClick={() => {
                retroAudio.playPaperFlip();
                onViewChange('favorites');
              }}
              className={`px-3 py-1.5 rounded-t-md font-typewriter text-xs font-medium flex items-center gap-2 transition-all border-t border-x ${
                currentView === 'favorites'
                  ? 'bg-[#f6f1e8] text-[#3c2f25] border-[#8c6239] shadow-md font-bold -mb-px'
                  : 'bg-[#1a110a] text-[#b59a7c] hover:text-[#f3ece0] border-transparent'
              }`}
            >
              <Star className="w-3.5 h-3.5 text-[#d4a373] fill-[#d4a373]" />
              <span>Especiais / Favoritas</span>
            </button>
          </div>

          <button
            onClick={() => {
              retroAudio.playProjectorClick();
              onViewChange('slideshow');
            }}
            className="px-3 py-1 bg-[#1a110a] hover:bg-[#3a2618] text-[#d4a373] border border-[#8c6239] rounded font-typewriter text-xs flex items-center gap-1.5 transition-colors shrink-0"
            title="Abrir projetor de slides retro"
          >
            <Tv className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Projetor de Slides</span>
          </button>
        </nav>
      </div>
    </header>
  );
};
