import React, { useState } from 'react';
import { 
  X, 
  Star, 
  MapPin, 
  Calendar, 
  Camera, 
  Tag, 
  Edit3, 
  Save, 
  Folder, 
  Sliders, 
  RotateCw,
  Share2,
  Trash2,
  Download,
  BookOpen
} from 'lucide-react';
import { Photo, Album, PhotoFilter } from '../types';
import { retroAudio } from '../utils/audio';

interface PhotoDetailModalProps {
  photo: Photo;
  albums: Album[];
  onClose: () => void;
  onUpdatePhoto: (updatedPhoto: Photo) => void;
  onDeletePhoto: (photoId: string) => void;
  onToggleFavorite: (photoId: string) => void;
}

const FILTERS: { id: PhotoFilter; label: string; class: string }[] = [
  { id: 'original', label: 'Original', class: 'filter-original' },
  { id: 'sepia', label: 'Sépia Clássica', class: 'filter-sepia' },
  { id: 'vintage-70s', label: 'Filme Anos 70', class: 'filter-vintage-70s' },
  { id: 'black-white', label: 'P&B Nostalgia', class: 'filter-black-white' },
  { id: 'kodachrome', label: 'Kodachrome 1980', class: 'filter-kodachrome' },
  { id: 'faded', label: 'Desbotado Vintage', class: 'filter-faded' },
  { id: 'film-grain', label: 'Grão de Filme', class: 'filter-film-grain' },
];

export const PhotoDetailModal: React.FC<PhotoDetailModalProps> = ({
  photo,
  albums,
  onClose,
  onUpdatePhoto,
  onDeletePhoto,
  onToggleFavorite,
}) => {
  const [activeSide, setActiveSide] = useState<'front' | 'back'>('front');
  const [isEditing, setIsEditing] = useState(false);

  // Edit form state
  const [title, setTitle] = useState(photo.title);
  const [date, setDate] = useState(photo.date);
  const [location, setLocation] = useState(photo.location);
  const [caption, setCaption] = useState(photo.caption);
  const [cameraInfo, setCameraInfo] = useState(photo.cameraInfo || '');
  const [albumId, setAlbumId] = useState(photo.albumId);
  const [activeFilter, setActiveFilter] = useState<PhotoFilter>(photo.filter || 'original');
  const [tagsText, setTagsText] = useState(photo.tags.join(', '));

  const currentAlbum = albums.find((a) => a.id === photo.albumId);

  const handleSave = () => {
    retroAudio.playPaperFlip();
    const updatedTags = tagsText
      .split(',')
      .map((t) => t.trim().replace(/^#/, ''))
      .filter(Boolean);

    onUpdatePhoto({
      ...photo,
      title,
      date,
      location,
      caption,
      cameraInfo,
      albumId,
      filter: activeFilter,
      tags: updatedTags,
    });
    setIsEditing(false);
  };

  const handleFilterChange = (filterId: PhotoFilter) => {
    retroAudio.playShutterSound();
    setActiveFilter(filterId);
    onUpdatePhoto({
      ...photo,
      filter: filterId,
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#1e130c]/85 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      
      {/* Modal Scrapbook Paper Container */}
      <div className="relative w-full max-w-4xl bg-[#f6f1e8] border-4 border-[#8c6239] rounded-lg shadow-2xl overflow-hidden my-auto text-[#3c2f25]">
        
        {/* Top Brass Header Bar */}
        <div className="bg-[#2c1e16] text-[#e8dec8] px-4 py-3 flex items-center justify-between border-b-2 border-[#8c6239]">
          <div className="flex items-center gap-3">
            <span className="font-stamp text-xs bg-[#d4a373] text-[#1e130c] font-bold px-2 py-0.5 rounded uppercase">
              REGISTRO DE MEMÓRIA
            </span>
            <h3 className="font-serif-vintage text-base sm:text-lg font-bold text-[#f3ece0] truncate max-w-md">
              {photo.title}
            </h3>
          </div>

          <div className="flex items-center gap-2">
            {/* Toggle Front / Back of Photo */}
            <button
              onClick={() => {
                retroAudio.playPaperFlip();
                setActiveSide(activeSide === 'front' ? 'back' : 'front');
              }}
              className="px-3 py-1 bg-[#4a3425] hover:bg-[#5c4230] text-[#f3ece0] text-xs font-typewriter rounded border border-[#8c6239] flex items-center gap-1.5 transition-all"
            >
              <RotateCw className="w-3.5 h-3.5 text-[#d4a373]" />
              <span>{activeSide === 'front' ? 'Virar para o Verso (Notas)' : 'Ver Foto (Frente)'}</span>
            </button>

            <button
              onClick={() => {
                retroAudio.playPaperFlip();
                onToggleFavorite(photo.id);
              }}
              className="p-1.5 hover:bg-[#4a3425] text-[#d4a373] rounded transition-colors"
              title={photo.favorite ? 'Remover especial' : 'Marcar especial'}
            >
              <Star className={`w-5 h-5 ${photo.favorite ? 'fill-[#d4a373]' : ''}`} />
            </button>

            <button
              onClick={onClose}
              className="p-1.5 hover:bg-[#4a3425] text-[#b59a7c] hover:text-[#f3ece0] rounded transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 max-h-[80vh] overflow-y-auto">
          
          {/* Main Photo Canvas View (Left 7 Cols) */}
          <div className="lg:col-span-7 flex flex-col items-center justify-center bg-[#1e130c]/10 p-4 rounded-lg border border-[#d8c8b4]">
            
            {activeSide === 'front' ? (
              /* FRONT OF PHOTO */
              <div className="relative max-w-full bg-[#fff] p-3 pb-8 rounded-sm border border-[#c4b19c] shadow-xl">
                {/* Tape Effect */}
                <div className="washi-tape absolute -top-3 left-1/2 -translate-x-1/2 w-24 h-6 transform -rotate-1 z-10" />

                <div className="max-h-[50vh] overflow-hidden rounded-xs bg-[#1a110a] flex items-center justify-center">
                  <img
                    src={photo.url}
                    alt={photo.title}
                    referrerPolicy="no-referrer"
                    className={`max-h-[50vh] w-auto object-contain filter-${activeFilter}`}
                  />
                </div>

                {/* Bottom Caption on Polaroid */}
                <div className="mt-3 text-center">
                  <p className="font-handwriting text-2xl text-[#2c1d11] font-bold">
                    {photo.title}
                  </p>
                  <p className="font-stamp text-xs text-[#a83232] font-semibold mt-0.5">
                    {photo.date} • {photo.location}
                  </p>
                </div>
              </div>
            ) : (
              /* BACK OF PHOTO (JOURNAL / SCRAPBOOK BACK) */
              <div className="w-full h-full min-h-[350px] bg-[#fbf6ee] p-6 rounded-sm border border-[#c4b19c] shadow-inner relative flex flex-col justify-between">
                <div className="washi-tape-yellow absolute -top-3 right-6 w-20 h-5 transform rotate-2 z-10" />
                
                <div>
                  <div className="flex items-center justify-between border-b-2 border-dashed border-[#8c6239]/30 pb-2 mb-4">
                    <span className="font-stamp text-sm text-[#a83232] font-bold tracking-widest uppercase flex items-center gap-1.5">
                      <BookOpen className="w-4 h-4" />
                      <span>VERSO DA FOTO & JOURNAL</span>
                    </span>
                    <span className="font-typewriter text-xs text-[#8c6f52]">
                      RELAÇÃO Nº {photo.id.slice(-6)}
                    </span>
                  </div>

                  <p className="font-handwriting text-2xl text-[#2c1d11] leading-relaxed italic whitespace-pre-wrap">
                    "{photo.caption || 'Nenhuma nota ou memória escrita no verso desta foto ainda.'}"
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-[#d8c8b4] grid grid-cols-2 gap-2 text-xs font-typewriter text-[#8c6f52]">
                  <div>
                    <span className="font-bold text-[#3c2f25]">Equipamento:</span>
                    <p className="text-[11px]">{photo.cameraInfo || 'Câmera Analógica 35mm'}</p>
                  </div>
                  <div>
                    <span className="font-bold text-[#3c2f25]">Pasta / Álbum:</span>
                    <p className="text-[11px]">{currentAlbum ? currentAlbum.name : 'Geral'}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Filter Selector Bar */}
            <div className="w-full mt-4 bg-[#e8dec8] p-3 rounded-md border border-[#8c6239]/40">
              <span className="font-typewriter text-xs font-bold text-[#3c2f25] flex items-center gap-1.5 mb-2">
                <Sliders className="w-3.5 h-3.5 text-[#8c6239]" />
                <span>Filtro Retrô Aplicado:</span>
              </span>
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
                {FILTERS.map((f) => (
                  <button
                    key={f.id}
                    onClick={() => handleFilterChange(f.id)}
                    className={`px-2.5 py-1 rounded text-xs font-typewriter whitespace-nowrap transition-all border ${
                      activeFilter === f.id
                        ? 'bg-[#8c6239] text-[#f3ece0] font-bold border-[#3c2f25] shadow-sm'
                        : 'bg-[#f6f1e8] text-[#3c2f25] border-[#b59a7c] hover:bg-[#fff]'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* Metadata & Editing Details Sidebar (Right 5 Cols) */}
          <div className="lg:col-span-5 flex flex-col justify-between bg-[#fbf6ee] p-4 rounded-lg border border-[#d8c8b4]">
            
            <div>
              <div className="flex items-center justify-between border-b border-[#8c6239]/30 pb-3 mb-4">
                <h4 className="font-serif-vintage text-lg font-bold text-[#3c2f25]">
                  Detalhes da Memória
                </h4>
                
                {!isEditing ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="px-2.5 py-1 bg-[#e8dec8] hover:bg-[#d8c8b4] text-[#3c2f25] rounded text-xs font-typewriter font-semibold flex items-center gap-1 border border-[#8c6239]"
                  >
                    <Edit3 className="w-3.5 h-3.5 text-[#8c6239]" />
                    <span>Editar</span>
                  </button>
                ) : (
                  <button
                    onClick={handleSave}
                    className="px-2.5 py-1 bg-[#8c6239] hover:bg-[#6e4e2e] text-[#f3ece0] rounded text-xs font-typewriter font-semibold flex items-center gap-1 border border-[#3c2f25]"
                  >
                    <Save className="w-3.5 h-3.5 text-[#f3ece0]" />
                    <span>Salvar</span>
                  </button>
                )}
              </div>

              {!isEditing ? (
                /* READ-ONLY VIEW */
                <div className="space-y-4 font-typewriter text-xs text-[#3c2f25]">
                  <div>
                    <span className="text-[#8c6f52] font-semibold block text-[11px] uppercase">Título:</span>
                    <p className="font-bold text-sm text-[#2c1d11]">{photo.title}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <span className="text-[#8c6f52] font-semibold block text-[11px] uppercase flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-[#a83232]" /> Date:
                      </span>
                      <p className="font-stamp text-[#a83232] font-bold text-sm">{photo.date}</p>
                    </div>

                    <div>
                      <span className="text-[#8c6f52] font-semibold block text-[11px] uppercase flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-[#b57a44]" /> Local:
                      </span>
                      <p className="font-semibold">{photo.location || 'Não especificado'}</p>
                    </div>
                  </div>

                  <div>
                    <span className="text-[#8c6f52] font-semibold block text-[11px] uppercase flex items-center gap-1">
                      <Folder className="w-3 h-3 text-[#8c6239]" /> Pasta / Álbum:
                    </span>
                    <p className="font-bold text-[#8c6239]">
                      {currentAlbum ? currentAlbum.name : 'Geral'}
                    </p>
                  </div>

                  <div>
                    <span className="text-[#8c6f52] font-semibold block text-[11px] uppercase flex items-center gap-1">
                      <Camera className="w-3 h-3 text-[#8c6239]" /> Equipamento / Filme:
                    </span>
                    <p className="italic text-[#6e5a47]">{photo.cameraInfo || 'Câmera Analógica 35mm'}</p>
                  </div>

                  <div>
                    <span className="text-[#8c6f52] font-semibold block text-[11px] uppercase">História / Memória:</span>
                    <p className="font-handwriting text-lg text-[#2c1d11] bg-[#f6f1e8] p-3 rounded border border-[#d8c8b4] mt-1 leading-relaxed">
                      {photo.caption || 'Nenhuma história registrada.'}
                    </p>
                  </div>

                  {photo.tags && photo.tags.length > 0 && (
                    <div>
                      <span className="text-[#8c6f52] font-semibold block text-[11px] uppercase flex items-center gap-1 mb-1">
                        <Tag className="w-3 h-3" /> Tags:
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {photo.tags.map((tag, idx) => (
                          <span
                            key={idx}
                            className="bg-[#e8dec8] text-[#3c2f25] px-2 py-0.5 rounded text-[11px] font-typewriter border border-[#b59a7c]"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                /* EDIT FORM VIEW */
                <div className="space-y-3 font-typewriter text-xs text-[#3c2f25]">
                  <div>
                    <label className="block text-[#8c6f52] font-semibold mb-1">Título da Foto:</label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-[#fff] border border-[#8c6239] rounded focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[#8c6f52] font-semibold mb-1">Data:</label>
                      <input
                        type="text"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        placeholder="Ex: 15/10/1998"
                        className="w-full px-2.5 py-1.5 bg-[#fff] border border-[#8c6239] rounded focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[#8c6f52] font-semibold mb-1">Local:</label>
                      <input
                        type="text"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        placeholder="Ex: Santos, SP"
                        className="w-full px-2.5 py-1.5 bg-[#fff] border border-[#8c6239] rounded focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[#8c6f52] font-semibold mb-1">Mover para a Pasta:</label>
                    <select
                      value={albumId}
                      onChange={(e) => setAlbumId(e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-[#fff] border border-[#8c6239] rounded focus:outline-none"
                    >
                      {albums.map((a) => (
                        <option key={a.id} value={a.id}>
                          {a.name} ({a.category})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[#8c6f52] font-semibold mb-1">Câmera / Filme:</label>
                    <input
                      type="text"
                      value={cameraInfo}
                      onChange={(e) => setCameraInfo(e.target.value)}
                      placeholder="Ex: Olympus Trip 35 • Kodak 200"
                      className="w-full px-2.5 py-1.5 bg-[#fff] border border-[#8c6239] rounded focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[#8c6f52] font-semibold mb-1">História / Memória (Verso):</label>
                    <textarea
                      value={caption}
                      onChange={(e) => setCaption(e.target.value)}
                      rows={4}
                      className="w-full px-2.5 py-1.5 bg-[#fff] border border-[#8c6239] rounded focus:outline-none font-handwriting text-base"
                    />
                  </div>

                  <div>
                    <label className="block text-[#8c6f52] font-semibold mb-1">Tags (separadas por vírgula):</label>
                    <input
                      type="text"
                      value={tagsText}
                      onChange={(e) => setTagsText(e.target.value)}
                      placeholder="família, praia, viagem"
                      className="w-full px-2.5 py-1.5 bg-[#fff] border border-[#8c6239] rounded focus:outline-none"
                    />
                  </div>
                </div>
              )}

            </div>

            {/* Bottom Actions */}
            <div className="mt-6 pt-4 border-t border-[#8c6239]/30 flex items-center justify-between">
              <button
                onClick={() => {
                  if (window.confirm(`Deseja excluir permanentemente a foto "${photo.title}"?`)) {
                    onDeletePhoto(photo.id);
                    onClose();
                  }
                }}
                className="px-3 py-1.5 bg-[#f3dada] hover:bg-[#e6b8b8] text-red-900 text-xs font-typewriter font-semibold rounded border border-red-300 flex items-center gap-1.5 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5 text-red-700" />
                <span>Excluir Foto</span>
              </button>

              <button
                onClick={onClose}
                className="px-4 py-1.5 bg-[#8c6239] hover:bg-[#6e4e2e] text-[#f3ece0] text-xs font-typewriter font-bold rounded border border-[#3c2f25]"
              >
                Fechar
              </button>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
};
