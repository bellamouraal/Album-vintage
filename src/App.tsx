import React, { useState, useEffect, useMemo } from 'react';
import confetti from 'canvas-confetti';
import { 
  Folder, 
  Image as ImageIcon, 
  Calendar, 
  Star, 
  Plus, 
  FolderPlus, 
  ArrowLeft, 
  Search, 
  Grid, 
  LayoutGrid, 
  Trash2, 
  Edit3, 
  Users, 
  GraduationCap, 
  Briefcase, 
  Compass, 
  Bookmark,
  Sparkles,
  Filter
} from 'lucide-react';

import { Album, Photo, ViewMode, DisplayLayout } from './types';
import { storageService } from './services/storage';
import { retroAudio } from './utils/audio';

import { Navbar } from './components/Navbar';
import { AlbumCard } from './components/AlbumCard';
import { PolaroidCard } from './components/PolaroidCard';
import { PhotoDetailModal } from './components/PhotoDetailModal';
import { AddPhotoModal } from './components/AddPhotoModal';
import { CreateAlbumModal } from './components/CreateAlbumModal';
import { SlideshowModal } from './components/SlideshowModal';
import { TimelineView } from './components/TimelineView';

export default function App() {
  const [albums, setAlbums] = useState<Album[]>([]);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);

  // Navigation & View State
  const [currentView, setCurrentView] = useState<ViewMode>('albums');
  const [selectedAlbumId, setSelectedAlbumId] = useState<string | null>(null);
  const [displayLayout, setDisplayLayout] = useState<DisplayLayout>('polaroid-board');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  // Modals
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [isAddPhotoOpen, setIsAddPhotoOpen] = useState(false);
  const [isCreateAlbumOpen, setIsCreateAlbumOpen] = useState(false);
  const [editingAlbum, setEditingAlbum] = useState<Album | null>(null);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Load data on startup
  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const loadedAlbums = await storageService.getAlbums();
      const loadedPhotos = await storageService.getPhotos();
      setAlbums(loadedAlbums);
      setPhotos(loadedPhotos);
      setLoading(false);
    }
    loadData();
  }, []);

  // Sync state to IndexedDB storage
  const updateAlbums = async (newAlbums: Album[]) => {
    setAlbums(newAlbums);
    await storageService.saveAlbums(newAlbums);
  };

  const updatePhotos = async (newPhotos: Photo[]) => {
    setPhotos(newPhotos);
    await storageService.savePhotos(newPhotos);
  };

  // Reset data helper
  const handleResetData = async () => {
    setLoading(true);
    const defaults = await storageService.resetToDefaults();
    setAlbums(defaults.albums);
    setPhotos(defaults.photos);
    setSelectedAlbumId(null);
    setCurrentView('albums');
    setLoading(false);
  };

  // Handle Photo Actions
  const handleAddPhoto = async (photoData: Omit<Photo, 'id' | 'createdAt'>) => {
    const newPhoto: Photo = {
      ...photoData,
      id: `photo-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      createdAt: Date.now(),
    };
    const nextPhotos = [newPhoto, ...photos];
    await updatePhotos(nextPhotos);

    // Trigger celebratory retro confetti
    try {
      confetti({
        particleCount: 40,
        spread: 60,
        colors: ['#8b4513', '#d4a373', '#2b4c3f', '#5c2432', '#b25329'],
      });
    } catch {
      // Ignore
    }
  };

  const handleUpdatePhoto = async (updatedPhoto: Photo) => {
    const nextPhotos = photos.map((p) => (p.id === updatedPhoto.id ? updatedPhoto : p));
    await updatePhotos(nextPhotos);
    if (selectedPhoto?.id === updatedPhoto.id) {
      setSelectedPhoto(updatedPhoto);
    }
  };

  const handleDeletePhoto = async (photoId: string) => {
    retroAudio.playPaperFlip();
    const nextPhotos = photos.filter((p) => p.id !== photoId);
    await updatePhotos(nextPhotos);
    if (selectedPhoto?.id === photoId) {
      setSelectedPhoto(null);
    }
  };

  const handleToggleFavorite = async (photoId: string) => {
    const nextPhotos = photos.map((p) =>
      p.id === photoId ? { ...p, favorite: !p.favorite } : p
    );
    await updatePhotos(nextPhotos);
    if (selectedPhoto?.id === photoId) {
      setSelectedPhoto({ ...selectedPhoto, favorite: !selectedPhoto.favorite });
    }
  };

  // Handle Album Actions
  const handleSaveAlbum = async (albumData: Omit<Album, 'id' | 'createdAt'> | Album) => {
    if ('id' in albumData) {
      // Update existing album
      const nextAlbums = albums.map((a) => (a.id === albumData.id ? albumData : a));
      await updateAlbums(nextAlbums);
    } else {
      // Create new album
      const newAlbum: Album = {
        ...albumData,
        id: `album-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        createdAt: Date.now(),
      };
      const nextAlbums = [...albums, newAlbum];
      await updateAlbums(nextAlbums);

      try {
        confetti({
          particleCount: 50,
          spread: 70,
          colors: ['#8b4513', '#d4a373', '#2b4c3f'],
        });
      } catch {
        // Ignore
      }
    }
  };

  const handleDeleteAlbum = async (albumId: string) => {
    const nextAlbums = albums.filter((a) => a.id !== albumId);
    await updateAlbums(nextAlbums);
    if (selectedAlbumId === albumId) {
      setSelectedAlbumId(null);
      setCurrentView('albums');
    }
  };

  // Selected album object
  const currentAlbum = useMemo(() => {
    if (!selectedAlbumId) return null;
    return albums.find((a) => a.id === selectedAlbumId) || null;
  }, [albums, selectedAlbumId]);

  // All extracted tags
  const allTags = useMemo(() => {
    const tagSet = new Set<string>();
    photos.forEach((p) => p.tags?.forEach((t) => tagSet.add(t.toLowerCase())));
    return Array.from(tagSet);
  }, [photos]);

  // Filtered Photos List
  const filteredPhotos = useMemo(() => {
    return photos.filter((photo) => {
      // Filter by Album if in album view
      if ((currentView === 'album-detail' || currentView === 'albums') && selectedAlbumId) {
        if (photo.albumId !== selectedAlbumId) return false;
      }

      // Filter by Favorites
      if (currentView === 'favorites' && !photo.favorite) {
        return false;
      }

      // Filter by Selected Tag
      if (selectedTag) {
        const hasTag = photo.tags?.some((t) => t.toLowerCase() === selectedTag.toLowerCase());
        if (!hasTag) return false;
      }

      // Filter by Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = photo.title.toLowerCase().includes(q);
        const matchLocation = photo.location?.toLowerCase().includes(q);
        const matchCaption = photo.caption?.toLowerCase().includes(q);
        const matchDate = photo.date?.toLowerCase().includes(q);
        const matchTags = photo.tags?.some((t) => t.toLowerCase().includes(q));
        const album = albums.find((a) => a.id === photo.albumId);
        const matchAlbum = album?.name.toLowerCase().includes(q);

        return matchTitle || matchLocation || matchCaption || matchDate || matchTags || matchAlbum;
      }

      return true;
    });
  }, [photos, currentView, selectedAlbumId, selectedTag, searchQuery, albums]);

  // Helper function to navigate into an album
  const handleSelectAlbum = (albumId: string) => {
    setSelectedAlbumId(albumId);
    setCurrentView('album-detail');
  };

  const rotations = ['rotate-1', '-rotate-2', 'rotate-2', '-rotate-1', 'rotate-0'];

  if (loading) {
    return (
      <div className="min-h-screen bg-paper-texture flex flex-col items-center justify-center p-6 text-[#3c2f25]">
        <div className="w-16 h-16 border-4 border-[#8c6239] border-t-transparent rounded-full animate-spin mb-4" />
        <h2 className="font-serif-vintage text-2xl font-bold">Abrindo Baú de Memórias...</h2>
        <p className="font-typewriter text-xs text-[#8c6f52] mt-1">Carregando pastas e fotos vintage</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-paper-texture text-[#3c2f25] flex flex-col selection:bg-[#d4a373] selection:text-[#fff]">
      
      {/* Top Vintage Navigation */}
      <Navbar
        currentView={currentView}
        onViewChange={(view) => {
          setCurrentView(view);
          if (view !== 'album-detail') setSelectedAlbumId(null);
        }}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onOpenAddPhoto={() => setIsAddPhotoOpen(true)}
        onOpenCreateAlbum={() => {
          setEditingAlbum(null);
          setIsCreateAlbumOpen(true);
        }}
        soundEnabled={soundEnabled}
        onToggleSound={() => {
          const next = !soundEnabled;
          setSoundEnabled(next);
          retroAudio.soundEnabled = next;
        }}
        onResetData={handleResetData}
        photoCount={photos.length}
        albumCount={albums.length}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        
        {/* VIEW 1: ALBUMS / PASTAS VIEW (Default) */}
        {currentView === 'albums' && !selectedAlbumId && (
          <div className="space-y-6">
            
            {/* Header Banner */}
            <div className="bg-[#f2ebd9] border-2 border-[#8c6239] rounded-lg p-5 sm:p-6 shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative overflow-hidden">
              <div className="washi-tape absolute -top-3 right-10 w-28 h-6 transform rotate-3" />
              
              <div>
                <span className="font-stamp text-xs bg-[#d4a373] text-[#1e130c] font-bold px-2.5 py-0.5 rounded border border-[#8c6239]">
                  CATEGORIZADOR DE PASTAS
                </span>
                <h2 className="font-serif-vintage text-2xl sm:text-3xl font-bold text-[#3c2f25] mt-1">
                  Repositório de Álbuns & Pastas
                </h2>
                <p className="font-typewriter text-xs sm:text-sm text-[#6e5a47] mt-1 max-w-2xl leading-relaxed">
                  Guarde e organize suas recordações em pastas personalizadas como <strong className="text-[#3c2f25]">Álbum de Família</strong>, <strong className="text-[#3c2f25]">Álbum de Faculdade</strong>, <strong className="text-[#3c2f25]">Álbum Profissional</strong> e viagens.
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => {
                    setEditingAlbum(null);
                    setIsCreateAlbumOpen(true);
                  }}
                  className="px-4 py-2 bg-[#8c6239] hover:bg-[#6e4e2e] text-[#f3ece0] font-typewriter font-bold text-xs rounded border border-[#3c2f25] shadow flex items-center gap-1.5 transition-all"
                >
                  <FolderPlus className="w-4 h-4 text-[#d4a373]" />
                  <span>+ Criar Nova Pasta</span>
                </button>
              </div>
            </div>

            {/* Albums Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {albums.map((album) => (
                <AlbumCard
                  key={album.id}
                  album={album}
                  photos={photos.filter((p) => p.albumId === album.id)}
                  onSelectAlbum={handleSelectAlbum}
                  onEditAlbum={(a) => {
                    setEditingAlbum(a);
                    setIsCreateAlbumOpen(true);
                  }}
                  onDeleteAlbum={handleDeleteAlbum}
                />
              ))}
            </div>

          </div>
        )}

        {/* VIEW 2: INSIDE AN ALBUM (Album Detail) */}
        {(currentView === 'album-detail' || (currentView === 'albums' && selectedAlbumId)) && currentAlbum && (
          <div className="space-y-6">
            
            {/* Back Button & Album Header */}
            <div className="bg-[#f2ebd9] border-2 border-[#8c6239] rounded-lg p-5 sm:p-6 shadow-md relative">
              <div 
                className="h-3 w-32 absolute top-0 left-6 rounded-b-md shadow-inner"
                style={{ backgroundColor: currentAlbum.color || '#8B4513' }}
              />

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
                <div>
                  <button
                    onClick={() => {
                      retroAudio.playPaperFlip();
                      setSelectedAlbumId(null);
                      setCurrentView('albums');
                    }}
                    className="mb-2 font-typewriter text-xs font-bold text-[#8c6239] hover:text-[#3c2f25] flex items-center gap-1 transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Voltar para todas as pastas</span>
                  </button>

                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="font-serif-vintage text-2xl sm:text-3xl font-bold text-[#3c2f25]">
                      {currentAlbum.name}
                    </h2>
                    {currentAlbum.sticker && (
                      <span className="font-stamp text-xs bg-[#d4a373] text-[#1e130c] font-bold px-2 py-0.5 rounded border border-[#8c6239]">
                        {currentAlbum.sticker}
                      </span>
                    )}
                  </div>

                  <p className="font-typewriter text-xs text-[#6e5a47] mt-1 max-w-2xl">
                    {currentAlbum.description}
                  </p>
                </div>

                {/* Album Actions */}
                <div className="flex items-center gap-2 flex-wrap">
                  <button
                    onClick={() => setIsAddPhotoOpen(true)}
                    className="px-3.5 py-2 bg-gradient-to-r from-[#d4a373] to-[#b57a44] text-[#1e130c] font-typewriter font-bold text-xs rounded border border-[#3c2f25] shadow flex items-center gap-1.5"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Adicionar Foto Nesta Pasta</span>
                  </button>

                  <button
                    onClick={() => {
                      setEditingAlbum(currentAlbum);
                      setIsCreateAlbumOpen(true);
                    }}
                    className="p-2 bg-[#e8dec8] hover:bg-[#d8c8b4] text-[#3c2f25] rounded border border-[#8c6239]"
                    title="Editar pasta"
                  >
                    <Edit3 className="w-4 h-4 text-[#8c6239]" />
                  </button>
                </div>
              </div>

              {/* Tag Filters for Album */}
              {allTags.length > 0 && (
                <div className="mt-4 pt-3 border-t border-[#8c6239]/20 flex items-center gap-2 overflow-x-auto no-scrollbar font-typewriter text-xs">
                  <span className="text-[#8c6f52] font-semibold shrink-0 flex items-center gap-1">
                    <Filter className="w-3.5 h-3.5" /> Tags:
                  </span>
                  <button
                    onClick={() => setSelectedTag(null)}
                    className={`px-2.5 py-0.5 rounded text-[11px] font-semibold transition-colors ${
                      !selectedTag ? 'bg-[#8c6239] text-[#f3ece0]' : 'bg-[#e8dec8] text-[#3c2f25]'
                    }`}
                  >
                    Todas
                  </button>
                  {allTags.map((tag) => (
                    <button
                      key={tag}
                      onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
                      className={`px-2.5 py-0.5 rounded text-[11px] font-semibold transition-colors ${
                        selectedTag === tag ? 'bg-[#8c6239] text-[#f3ece0]' : 'bg-[#e8dec8] text-[#3c2f25]'
                      }`}
                    >
                      #{tag}
                    </button>
                  ))}
                </div>
              )}

            </div>

            {/* Photos Grid inside Album */}
            {filteredPhotos.length === 0 ? (
              <div className="text-center py-16 bg-[#f2ebd9] border-2 border-dashed border-[#8c6239] rounded-lg p-6 space-y-3">
                <ImageIcon className="w-12 h-12 text-[#8c6239] mx-auto stroke-[1.5]" />
                <h3 className="font-serif-vintage text-xl font-bold">Esta pasta ainda está vazia</h3>
                <p className="font-typewriter text-xs text-[#6e5a47]">
                  Adicione fotos para guardar memórias no {currentAlbum.name}.
                </p>
                <button
                  onClick={() => setIsAddPhotoOpen(true)}
                  className="px-4 py-2 bg-[#8c6239] text-[#f3ece0] font-typewriter text-xs font-bold rounded shadow inline-flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>Adicionar Primeira Foto</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredPhotos.map((photo, idx) => (
                  <PolaroidCard
                    key={photo.id}
                    photo={photo}
                    albumName={currentAlbum.name}
                    onSelectPhoto={(p) => setSelectedPhoto(p)}
                    onToggleFavorite={handleToggleFavorite}
                    onDeletePhoto={handleDeletePhoto}
                    rotationClass={rotations[idx % rotations.length]}
                    tapeColor={idx % 3 === 0 ? 'red' : idx % 3 === 1 ? 'yellow' : 'default'}
                  />
                ))}
              </div>
            )}

          </div>
        )}

        {/* VIEW 3: ALL PHOTOS VIEW / FAVORITES VIEW */}
        {(currentView === 'all-photos' || currentView === 'favorites') && (
          <div className="space-y-6">
            
            {/* View Header */}
            <div className="bg-[#f2ebd9] border-2 border-[#8c6239] rounded-lg p-5 sm:p-6 shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="font-stamp text-xs bg-[#d4a373] text-[#1e130c] font-bold px-2.5 py-0.5 rounded border border-[#8c6239]">
                  {currentView === 'favorites' ? 'MEMÓRIAS ESPECIAIS' : 'REPOSITÓRIO COMPLETO'}
                </span>
                <h2 className="font-serif-vintage text-2xl sm:text-3xl font-bold text-[#3c2f25] mt-1">
                  {currentView === 'favorites' ? 'Fotos Especiais & Favoritas' : 'Todas as Fotos do Repositório'}
                </h2>
                <p className="font-typewriter text-xs text-[#6e5a47] mt-1">
                  Exibindo {filteredPhotos.length} de {photos.length} fotos salvas nas suas pastas.
                </p>
              </div>

              <button
                onClick={() => setIsAddPhotoOpen(true)}
                className="px-4 py-2 bg-[#8c6239] hover:bg-[#6e4e2e] text-[#f3ece0] font-typewriter font-bold text-xs rounded border border-[#3c2f25] shadow flex items-center gap-1.5 shrink-0"
              >
                <Plus className="w-4 h-4 text-[#d4a373]" />
                <span>+ Adicionar Foto</span>
              </button>
            </div>

            {/* Tag Filter Bar */}
            {allTags.length > 0 && (
              <div className="bg-[#f6f1e8] p-3 rounded-lg border border-[#8c6239]/30 flex items-center gap-2 overflow-x-auto no-scrollbar font-typewriter text-xs">
                <span className="text-[#8c6f52] font-semibold shrink-0 flex items-center gap-1">
                  <Filter className="w-3.5 h-3.5 text-[#8c6239]" /> Filtrar por Tag:
                </span>
                <button
                  onClick={() => setSelectedTag(null)}
                  className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-colors ${
                    !selectedTag ? 'bg-[#8c6239] text-[#f3ece0]' : 'bg-[#e8dec8] text-[#3c2f25]'
                  }`}
                >
                  Todas
                </button>
                {allTags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
                    className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-colors ${
                      selectedTag === tag ? 'bg-[#8c6239] text-[#f3ece0]' : 'bg-[#e8dec8] text-[#3c2f25]'
                    }`}
                  >
                    #{tag}
                  </button>
                ))}
              </div>
            )}

            {/* Photos Grid */}
            {filteredPhotos.length === 0 ? (
              <div className="text-center py-16 bg-[#f2ebd9] border-2 border-dashed border-[#8c6239] rounded-lg p-6 space-y-2">
                <Star className="w-12 h-12 text-[#8c6239] mx-auto stroke-[1.5]" />
                <h3 className="font-serif-vintage text-xl font-bold">Nenhuma foto encontrada nesta visualização</h3>
                <p className="font-typewriter text-xs text-[#6e5a47]">Tente remover os filtros ou buscar outro termo.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredPhotos.map((photo, idx) => {
                  const album = albums.find((a) => a.id === photo.albumId);
                  return (
                    <PolaroidCard
                      key={photo.id}
                      photo={photo}
                      albumName={album ? album.name : undefined}
                      onSelectPhoto={(p) => setSelectedPhoto(p)}
                      onToggleFavorite={handleToggleFavorite}
                      onDeletePhoto={handleDeletePhoto}
                      rotationClass={rotations[idx % rotations.length]}
                      tapeColor={idx % 3 === 0 ? 'red' : idx % 3 === 1 ? 'yellow' : 'default'}
                    />
                  );
                })}
              </div>
            )}

          </div>
        )}

        {/* VIEW 4: TIMELINE VIEW */}
        {currentView === 'timeline' && (
          <TimelineView
            photos={filteredPhotos}
            albums={albums}
            onSelectPhoto={(p) => setSelectedPhoto(p)}
            onToggleFavorite={handleToggleFavorite}
            onDeletePhoto={handleDeletePhoto}
          />
        )}

        {/* VIEW 5: SLIDESHOW MODAL */}
        {currentView === 'slideshow' && (
          <SlideshowModal
            photos={filteredPhotos.length > 0 ? filteredPhotos : photos}
            albums={albums}
            onClose={() => setCurrentView('albums')}
          />
        )}

      </main>

      {/* Footer */}
      <footer className="mt-12 bg-[#2c1e16] text-[#b59a7c] border-t-4 border-[#8c6239] py-6 px-4 font-typewriter text-xs text-center">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="flex items-center gap-2">
            <span className="font-serif-vintage font-bold text-[#f3ece0]">Álbum & Repositório Vintage</span>
            <span>•</span>
            <span>Estética Analógica & Retro Kodak</span>
          </p>
          <p className="text-[11px] text-[#8c6f52]">
            Organizado em pastas personalizadas • Guarde suas memórias para sempre
          </p>
        </div>
      </footer>

      {/* Photo Detail Modal */}
      {selectedPhoto && (
        <PhotoDetailModal
          photo={selectedPhoto}
          albums={albums}
          onClose={() => setSelectedPhoto(null)}
          onUpdatePhoto={handleUpdatePhoto}
          onDeletePhoto={handleDeletePhoto}
          onToggleFavorite={handleToggleFavorite}
        />
      )}

      {/* Add Photo Modal */}
      {isAddPhotoOpen && (
        <AddPhotoModal
          albums={albums}
          defaultAlbumId={selectedAlbumId || undefined}
          onClose={() => setIsAddPhotoOpen(false)}
          onAddPhoto={handleAddPhoto}
          onOpenCreateAlbum={() => {
            setIsAddPhotoOpen(false);
            setEditingAlbum(null);
            setIsCreateAlbumOpen(true);
          }}
        />
      )}

      {/* Create / Edit Album Modal */}
      {isCreateAlbumOpen && (
        <CreateAlbumModal
          initialAlbum={editingAlbum}
          photos={photos}
          onClose={() => setIsCreateAlbumOpen(false)}
          onSaveAlbum={handleSaveAlbum}
        />
      )}

    </div>
  );
}
