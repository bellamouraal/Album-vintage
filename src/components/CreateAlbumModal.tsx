import React, { useState } from 'react';
import { 
  X, 
  FolderPlus, 
  Users, 
  GraduationCap, 
  Briefcase, 
  Compass, 
  Bookmark, 
  Check, 
  Palette, 
  Stamp,
  Sparkles
} from 'lucide-react';
import { Album, AlbumCategory, Photo } from '../types';
import { retroAudio } from '../utils/audio';

interface CreateAlbumModalProps {
  initialAlbum?: Album | null;
  photos: Photo[];
  onClose: () => void;
  onSaveAlbum: (albumData: Omit<Album, 'id' | 'createdAt'> | Album) => void;
}

const CATEGORIES: { id: AlbumCategory; label: string; icon: React.ReactNode; defaultColor: string }[] = [
  { id: 'family', label: 'Álbum de Família', icon: <Users className="w-4 h-4" />, defaultColor: '#8B4513' },
  { id: 'college', label: 'Álbum de Faculdade', icon: <GraduationCap className="w-4 h-4" />, defaultColor: '#2B4C3F' },
  { id: 'work', label: 'Álbum Profissional', icon: <Briefcase className="w-4 h-4" />, defaultColor: '#5C2432' },
  { id: 'travel', label: 'Viagens & Aventuras', icon: <Compass className="w-4 h-4" />, defaultColor: '#B25329' },
  { id: 'custom', label: 'Pasta Personalizada', icon: <Bookmark className="w-4 h-4" />, defaultColor: '#2B3A4A' },
];

const PRESET_COLORS = [
  { hex: '#8B4513', name: 'Couro Marrom' },
  { hex: '#2B4C3F', name: 'Verde Biblioteca' },
  { hex: '#5C2432', name: 'Vinho Borrô' },
  { hex: '#B25329', name: 'Âmbar Ferrugem' },
  { hex: '#2B3A4A', name: 'Azul Marinho Vintage' },
  { hex: '#362415', name: 'Café Expresso' },
];

const PRESET_STICKERS = [
  'RECORDAÇÕES',
  'TURMA DE 1998',
  'CONFIDENCIAL',
  'PASSAPORTE',
  'REGISTRO OFICIAL',
  'FAMÍLIA & CIA',
  'SECRETO'
];

export const CreateAlbumModal: React.FC<CreateAlbumModalProps> = ({
  initialAlbum,
  photos,
  onClose,
  onSaveAlbum,
}) => {
  const [name, setName] = useState(initialAlbum?.name || '');
  const [category, setCategory] = useState<AlbumCategory>(initialAlbum?.category || 'family');
  const [description, setDescription] = useState(initialAlbum?.description || '');
  const [color, setColor] = useState(initialAlbum?.color || '#8B4513');
  const [sticker, setSticker] = useState(initialAlbum?.sticker || 'RECORDAÇÕES');
  const [coverUrl, setCoverUrl] = useState(initialAlbum?.coverUrl || '');

  const handleCategorySelect = (cat: AlbumCategory) => {
    setCategory(cat);
    const catObj = CATEGORIES.find((c) => c.id === cat);
    if (catObj && !initialAlbum) {
      setColor(catObj.defaultColor);
      if (!name) setName(catObj.label);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      alert('Por favor, informe um nome para a pasta.');
      return;
    }

    retroAudio.playPaperFlip();

    if (initialAlbum) {
      onSaveAlbum({
        ...initialAlbum,
        name,
        category,
        description,
        color,
        sticker,
        coverUrl,
      });
    } else {
      onSaveAlbum({
        name,
        category,
        description,
        color,
        sticker,
        icon: category,
        coverUrl,
      });
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#1e130c]/85 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      
      <div className="relative w-full max-w-lg bg-[#f6f1e8] border-4 border-[#8c6239] rounded-lg shadow-2xl overflow-hidden my-auto text-[#3c2f25]">
        
        {/* Modal Header */}
        <div className="bg-[#2c1e16] text-[#e8dec8] px-4 py-3 flex items-center justify-between border-b-2 border-[#8c6239]">
          <div className="flex items-center gap-2">
            <FolderPlus className="w-5 h-5 text-[#d4a373]" />
            <h3 className="font-serif-vintage text-lg font-bold text-[#f3ece0]">
              {initialAlbum ? 'Editar Pasta de Fotos' : 'Criar Nova Pasta Personalizada'}
            </h3>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-[#4a3425] text-[#b59a7c] rounded">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4 font-typewriter text-xs">
          
          {/* Category Selector */}
          <div>
            <label className="block text-[#8c6f52] font-semibold mb-1.5">Categoria da Pasta:</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  type="button"
                  key={cat.id}
                  onClick={() => handleCategorySelect(cat.id)}
                  className={`p-2 rounded border flex items-center gap-1.5 transition-all text-left ${
                    category === cat.id
                      ? 'bg-[#8c6239] text-[#f3ece0] border-[#3c2f25] font-bold shadow'
                      : 'bg-[#fff] text-[#3c2f25] border-[#b59a7c] hover:bg-[#e8dec8]'
                  }`}
                >
                  {cat.icon}
                  <span className="truncate">{cat.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Album Name */}
          <div>
            <label className="block text-[#8c6f52] font-semibold mb-1">Nome da Pasta *</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Álbum de Família ou Anos 90"
              className="w-full px-3 py-1.5 bg-[#fff] border border-[#8c6239] rounded focus:outline-none text-sm font-bold"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-[#8c6f52] font-semibold mb-1">Descrição / Subtítulo da Pasta</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              placeholder="Descreva as memórias e momentos guardados nesta pasta..."
              className="w-full px-3 py-1.5 bg-[#fff] border border-[#8c6239] rounded focus:outline-none"
            />
          </div>

          {/* Color Picker for Binder */}
          <div>
            <label className="block text-[#8c6f52] font-semibold mb-1.5 flex items-center gap-1">
              <Palette className="w-3.5 h-3.5 text-[#8c6239]" />
              <span>Cor do Fichário de Couro / Encadernação:</span>
            </label>
            <div className="flex items-center gap-2 flex-wrap">
              {PRESET_COLORS.map((c) => (
                <button
                  type="button"
                  key={c.hex}
                  onClick={() => setColor(c.hex)}
                  className={`w-8 h-8 rounded-full border-2 transition-transform shadow ${
                    color === c.hex ? 'scale-110 border-[#1e130c] ring-2 ring-[#d4a373]' : 'border-[#fff]'
                  }`}
                  style={{ backgroundColor: c.hex }}
                  title={c.name}
                />
              ))}
            </div>
          </div>

          {/* Stamp / Sticker Label */}
          <div>
            <label className="block text-[#8c6f52] font-semibold mb-1.5 flex items-center gap-1">
              <Stamp className="w-3.5 h-3.5 text-[#8c6239]" />
              <span>Selo / Carimbo Vintage na Capa:</span>
            </label>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {PRESET_STICKERS.map((st) => (
                <button
                  type="button"
                  key={st}
                  onClick={() => setSticker(st)}
                  className={`px-2 py-0.5 rounded text-[10px] font-stamp uppercase transition-all ${
                    sticker === st
                      ? 'bg-[#d4a373] text-[#1e130c] font-bold border border-[#8c6239] shadow'
                      : 'bg-[#e8dec8] text-[#3c2f25] border border-[#b59a7c]'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
            <input
              type="text"
              value={sticker}
              onChange={(e) => setSticker(e.target.value)}
              placeholder="Ou digite seu selo personalizado"
              className="w-full px-3 py-1 bg-[#fff] border border-[#8c6239] rounded focus:outline-none uppercase font-stamp text-xs"
            />
          </div>

          {/* Cover Photo Picker */}
          {photos.length > 0 && (
            <div>
              <label className="block text-[#8c6f52] font-semibold mb-1">Selecione Foto de Capa (Opcional):</label>
              <select
                value={coverUrl}
                onChange={(e) => setCoverUrl(e.target.value)}
                className="w-full px-3 py-1.5 bg-[#fff] border border-[#8c6239] rounded focus:outline-none"
              >
                <option value="">Primeira foto da pasta (Padrão)</option>
                {photos.map((p) => (
                  <option key={p.id} value={p.url}>
                    {p.title} ({p.date})
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Form Actions */}
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
              className="px-5 py-2 bg-[#8c6239] hover:bg-[#6e4e2e] text-[#f3ece0] font-bold rounded border border-[#3c2f25] shadow flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              <span>{initialAlbum ? 'Salvar Alterações' : 'Criar Pasta'}</span>
            </button>
          </div>

        </form>

      </div>

    </div>
  );
};
