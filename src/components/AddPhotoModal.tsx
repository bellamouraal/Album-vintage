import React, { useState, useRef } from 'react';
import { 
  X, 
  Upload, 
  Link as LinkIcon, 
  Folder, 
  Camera, 
  MapPin, 
  Calendar, 
  Tag, 
  Sliders, 
  Sparkles,
  Check
} from 'lucide-react';
import { Photo, Album, PhotoFilter } from '../types';
import { retroAudio } from '../utils/audio';

interface AddPhotoModalProps {
  albums: Album[];
  defaultAlbumId?: string;
  onClose: () => void;
  onAddPhoto: (photo: Omit<Photo, 'id' | 'createdAt'>) => void;
  onOpenCreateAlbum: () => void;
}

const FILTERS: { id: PhotoFilter; label: string }[] = [
  { id: 'sepia', label: 'Sépia Clássica' },
  { id: 'vintage-70s', label: 'Filme 70s' },
  { id: 'original', label: 'Original' },
  { id: 'black-white', label: 'Preto & Branco' },
  { id: 'kodachrome', label: 'Kodachrome' },
  { id: 'faded', label: 'Desbotado' },
  { id: 'film-grain', label: 'Grão de Filme' },
];

export const AddPhotoModal: React.FC<AddPhotoModalProps> = ({
  albums,
  defaultAlbumId,
  onClose,
  onAddPhoto,
  onOpenCreateAlbum,
}) => {
  const [uploadType, setUploadType] = useState<'file' | 'url'>('file');
  const [imageUrl, setImageUrl] = useState('');
  const [filePreview, setFilePreview] = useState<string | null>(null);

  const [title, setTitle] = useState('');
  const [albumId, setAlbumId] = useState(defaultAlbumId || (albums[0]?.id || ''));
  const [date, setDate] = useState(() => {
    const today = new Date();
    return `${today.getDate().toString().padStart(2, '0')}/${(today.getMonth() + 1).toString().padStart(2, '0')}/${today.getFullYear()}`;
  });
  const [location, setLocation] = useState('');
  const [caption, setCaption] = useState('');
  const [cameraInfo, setCameraInfo] = useState('Olympus Trip 35 • Kodak Gold 200');
  const [filter, setFilter] = useState<PhotoFilter>('sepia');
  const [tagsText, setTagsText] = useState('memória, foto');

  const fileInputRef = useRef<HTMLInputElement>(null);

  // File Upload Handler via FileReader
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setFilePreview(reader.result as string);
        if (!title) {
          setTitle(file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setFilePreview(reader.result as string);
        if (!title) {
          setTitle(file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalUrl = uploadType === 'file' ? filePreview : imageUrl;

    if (!finalUrl) {
      alert('Por favor, selecione uma imagem do seu computador ou informe um link de imagem.');
      return;
    }

    if (!albumId) {
      alert('Por favor, selecione uma pasta para guardar esta foto.');
      return;
    }

    retroAudio.playShutterSound();

    const updatedTags = tagsText
      .split(',')
      .map((t) => t.trim().replace(/^#/, ''))
      .filter(Boolean);

    // Extract year for timeline sorting
    const yearMatch = date.match(/\b(19\d\d|20\d\d)\b/);
    const year = yearMatch ? parseInt(yearMatch[1], 10) : undefined;

    onAddPhoto({
      albumId,
      title: title || 'Nova Memória Foto',
      url: finalUrl,
      date,
      year,
      location,
      caption,
      filter,
      tags: updatedTags,
      favorite: false,
      cameraInfo,
    });

    onClose();
  };

  const activeUrl = uploadType === 'file' ? filePreview : imageUrl;

  return (
    <div className="fixed inset-0 z-50 bg-[#1e130c]/85 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      
      {/* Scrapbook Form Container */}
      <div className="relative w-full max-w-2xl bg-[#f6f1e8] border-4 border-[#8c6239] rounded-lg shadow-2xl overflow-hidden my-auto text-[#3c2f25]">
        
        {/* Header */}
        <div className="bg-[#2c1e16] text-[#e8dec8] px-4 py-3 flex items-center justify-between border-b-2 border-[#8c6239]">
          <div className="flex items-center gap-2">
            <Camera className="w-5 h-5 text-[#d4a373]" />
            <h3 className="font-serif-vintage text-lg font-bold text-[#f3ece0]">
              Adicionar Nova Foto ao Repositório
            </h3>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-[#4a3425] text-[#b59a7c] rounded">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4 max-h-[80vh] overflow-y-auto font-typewriter text-xs">
          
          {/* Upload Method Selector */}
          <div className="flex items-center justify-between bg-[#e8dec8] p-1.5 rounded border border-[#8c6239]/40">
            <button
              type="button"
              onClick={() => setUploadType('file')}
              className={`flex-1 py-1.5 rounded font-bold transition-all flex items-center justify-center gap-1.5 ${
                uploadType === 'file'
                  ? 'bg-[#8c6239] text-[#f3ece0] shadow-sm'
                  : 'text-[#3c2f25] hover:bg-[#d8c8b4]'
              }`}
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Enviar Arquivo (Do Computador)</span>
            </button>

            <button
              type="button"
              onClick={() => setUploadType('url')}
              className={`flex-1 py-1.5 rounded font-bold transition-all flex items-center justify-center gap-1.5 ${
                uploadType === 'url'
                  ? 'bg-[#8c6239] text-[#f3ece0] shadow-sm'
                  : 'text-[#3c2f25] hover:bg-[#d8c8b4]'
              }`}
            >
              <LinkIcon className="w-3.5 h-3.5" />
              <span>Usar Link / URL da Imagem</span>
            </button>
          </div>

          {/* Upload Area */}
          {uploadType === 'file' ? (
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-[#8c6239] bg-[#fffdfa] hover:bg-[#f3ece0] p-6 rounded-lg text-center cursor-pointer transition-colors relative"
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />

              {filePreview ? (
                <div className="flex flex-col items-center">
                  <div className="w-36 h-28 bg-[#1e130c] overflow-hidden rounded border border-[#8c6239] shadow mb-2">
                    <img
                      src={filePreview}
                      alt="Preview"
                      className={`w-full h-full object-cover filter-${filter}`}
                    />
                  </div>
                  <span className="text-[#8c6239] font-bold text-xs">✓ Imagem carregada! Clique para alterar</span>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2 text-[#8c6239]">
                  <Upload className="w-8 h-8 stroke-[1.5]" />
                  <p className="font-bold text-sm">Arraste e solte sua foto aqui</p>
                  <p className="text-[11px] text-[#6e5a47]">ou clique para procurar em suas pastas</p>
                </div>
              )}
            </div>
          ) : (
            <div>
              <label className="block text-[#8c6f52] font-semibold mb-1">URL / Link da Foto na Web:</label>
              <input
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://exemplo.com/minha-foto.jpg"
                className="w-full px-3 py-2 bg-[#fff] border border-[#8c6239] rounded focus:outline-none"
              />
            </div>
          )}

          {/* Form Fields Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            
            {/* Title */}
            <div>
              <label className="block text-[#8c6f52] font-semibold mb-1">Título da Foto / Recordação *</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ex: Formatura no Auditório"
                className="w-full px-3 py-1.5 bg-[#fff] border border-[#8c6239] rounded focus:outline-none"
              />
            </div>

            {/* Folder Selection */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-[#8c6f52] font-semibold">Pasta / Álbum *</label>
                <button
                  type="button"
                  onClick={onOpenCreateAlbum}
                  className="text-[10px] text-[#8c6239] hover:underline font-bold"
                >
                  + Criar Nova Pasta
                </button>
              </div>
              <select
                value={albumId}
                onChange={(e) => setAlbumId(e.target.value)}
                required
                className="w-full px-3 py-1.5 bg-[#fff] border border-[#8c6239] rounded focus:outline-none"
              >
                {albums.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.name} ({a.category})
                  </option>
                ))}
              </select>
            </div>

            {/* Date */}
            <div>
              <label className="block text-[#8c6f52] font-semibold mb-1">Data ou Época</label>
              <input
                type="text"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                placeholder="Ex: 14/10/1998 ou Verão de 1995"
                className="w-full px-3 py-1.5 bg-[#fff] border border-[#8c6239] rounded focus:outline-none"
              />
            </div>

            {/* Location */}
            <div>
              <label className="block text-[#8c6f52] font-semibold mb-1">Local da Foto</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Ex: Praia de Ubatuba, SP"
                className="w-full px-3 py-1.5 bg-[#fff] border border-[#8c6239] rounded focus:outline-none"
              />
            </div>

          </div>

          {/* Filter Selection */}
          <div>
            <label className="block text-[#8c6f52] font-semibold mb-1 flex items-center gap-1">
              <Sliders className="w-3.5 h-3.5 text-[#8c6239]" />
              <span>Estilo / Filtro Retrô Preferido:</span>
            </label>
            <div className="flex flex-wrap gap-1.5">
              {FILTERS.map((f) => (
                <button
                  type="button"
                  key={f.id}
                  onClick={() => setFilter(f.id)}
                  className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-all border ${
                    filter === f.id
                      ? 'bg-[#8c6239] text-[#f3ece0] border-[#3c2f25] shadow'
                      : 'bg-[#fff] text-[#3c2f25] border-[#b59a7c] hover:bg-[#e8dec8]'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* Camera Info */}
          <div>
            <label className="block text-[#8c6f52] font-semibold mb-1">Câmera / Modelo / Filme Analógico</label>
            <input
              type="text"
              value={cameraInfo}
              onChange={(e) => setCameraInfo(e.target.value)}
              placeholder="Ex: Kodak FunSaver Disposable • 35mm"
              className="w-full px-3 py-1.5 bg-[#fff] border border-[#8c6239] rounded focus:outline-none"
            />
          </div>

          {/* Caption / Journal Note */}
          <div>
            <label className="block text-[#8c6f52] font-semibold mb-1">Nota do Verso / História / Memória</label>
            <textarea
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              rows={3}
              placeholder="Escreva a história dessa foto, quem estava presente, sentimentos e lembranças..."
              className="w-full px-3 py-1.5 bg-[#fff] border border-[#8c6239] rounded focus:outline-none font-handwriting text-base"
            />
          </div>

          {/* Tags */}
          <div>
            <label className="block text-[#8c6f52] font-semibold mb-1">Tags (separadas por vírgula)</label>
            <input
              type="text"
              value={tagsText}
              onChange={(e) => setTagsText(e.target.value)}
              placeholder="família, formatura, férias, praia"
              className="w-full px-3 py-1.5 bg-[#fff] border border-[#8c6239] rounded focus:outline-none"
            />
          </div>

          {/* Actions */}
          <div className="pt-3 border-t border-[#8c6239]/30 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-[#e8dec8] hover:bg-[#d8c8b4] text-[#3c2f25] font-bold rounded border border-[#8c6239]"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-gradient-to-r from-[#d4a373] to-[#b57a44] hover:from-[#e2b080] hover:to-[#c68951] text-[#1e130c] font-bold rounded border border-[#3c2f25] shadow-md flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              <span>Salvar no Repositório</span>
            </button>
          </div>

        </form>

      </div>

    </div>
  );
};
