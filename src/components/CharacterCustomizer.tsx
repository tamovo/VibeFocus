import { useState } from 'react';
import type { AppMode, CharacterCustomization } from '../types';
import Avatar from './ArtAvatar';

const HAIR_COLORS = [
  { label: 'Rose',     value: '#8B4B6B' },
  { label: 'Navy',     value: '#4A6B8B' },
  { label: 'Black',    value: '#1A1A2E' },
  { label: 'Brown',    value: '#5C3A1E' },
  { label: 'Blonde',   value: '#C8A96E' },
  { label: 'Red',      value: '#B53030' },
  { label: 'Lavender', value: '#9B6BB5' },
  { label: 'Teal',     value: '#2F7A6A' },
];

const EYE_COLORS = [
  { label: 'Purple', value: '#6B21A8' },
  { label: 'Blue',   value: '#1E40AF' },
  { label: 'Teal',   value: '#0F766E' },
  { label: 'Brown',  value: '#92400E' },
  { label: 'Green',  value: '#065F46' },
  { label: 'Pink',   value: '#9D174D' },
];

const SKIN_COLORS = [
  { label: 'Peach',  value: '#FFD8C8' },
  { label: 'Light',  value: '#FFCBA4' },
  { label: 'Medium', value: '#D4956A' },
  { label: 'Tan',    value: '#BC7A45' },
  { label: 'Deep',   value: '#7D4E2D' },
];

const OUTFIT_COLORS = [
  { label: 'Lavender', value: '#C9A7F4' },
  { label: 'Sky',      value: '#7FB3CD' },
  { label: 'Mint',     value: '#7FD0B4' },
  { label: 'Rose',     value: '#F4A7C3' },
  { label: 'Coral',    value: '#F4907A' },
  { label: 'Yellow',   value: '#F4D07A' },
  { label: 'Slate',    value: '#8BA7C9' },
  { label: 'Sage',     value: '#8BC9A7' },
];

const ACCENT_COLORS = [
  { label: 'Pink',     value: '#FF69B4' },
  { label: 'Peach',    value: '#FFB3C6' },
  { label: 'Lavender', value: '#C9A7F4' },
  { label: 'Mint',     value: '#7FCDBE' },
  { label: 'Coral',    value: '#FF8C69' },
  { label: 'Gold',     value: '#FFD700' },
];

interface Props {
  mode: AppMode;
  customization: CharacterCustomization;
  onSave: (customization: CharacterCustomization) => void;
  onClose: () => void;
}

function Swatches({
  colors,
  selected,
  onSelect,
}: {
  colors: { label: string; value: string }[];
  selected: string;
  onSelect: (v: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {colors.map(c => (
        <button
          key={c.value}
          title={c.label}
          onClick={() => onSelect(c.value)}
          className="w-7 h-7 rounded-full transition-transform hover:scale-110"
          style={{
            background: c.value,
            border: selected === c.value ? '3px solid #fff' : '2px solid rgba(0,0,0,0.1)',
            boxShadow: selected === c.value ? `0 0 0 2px ${c.value}` : 'none',
          }}
        />
      ))}
    </div>
  );
}

export default function CharacterCustomizer({ mode, customization, onSave, onClose }: Props) {
  const [draft, setDraft] = useState<CharacterCustomization>({ ...customization });
  const accentColor = mode === 'art' ? '#C9A7F4' : '#7FCDBE';

  const set = (key: keyof CharacterCustomization) => (value: string) =>
    setDraft(prev => ({ ...prev, [key]: value }));

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.35)', backdropFilter: 'blur(4px)' }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="w-full max-w-md rounded-3xl p-6 space-y-5 overflow-y-auto"
        style={{
          maxHeight: '90vh',
          background: mode === 'art' ? 'rgba(255,245,252,0.98)' : 'rgba(240,252,250,0.98)',
          boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-extrabold" style={{ color: accentColor, fontFamily: 'Quicksand, sans-serif' }}>
            ✏️ Customize Character
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold opacity-40 hover:opacity-70 transition-opacity"
            style={{ background: 'rgba(0,0,0,0.08)' }}
          >
            ✕
          </button>
        </div>

        {/* Live preview */}
        <div
          className="flex justify-center py-4 rounded-2xl"
          style={{ background: mode === 'art' ? 'rgba(255,240,250,0.6)' : 'rgba(240,252,250,0.6)' }}
        >
          <Avatar mode={mode} customization={draft} />
        </div>

        {/* Name */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold opacity-60" style={{ fontFamily: 'Quicksand, sans-serif' }}>Name</label>
          <input
            value={draft.name}
            onChange={e => set('name')(e.target.value)}
            maxLength={20}
            className="w-full px-3 py-2 rounded-xl text-sm font-semibold outline-none"
            style={{
              background: 'rgba(255,255,255,0.7)',
              border: `1.5px solid ${accentColor}40`,
              color: accentColor,
              fontFamily: 'Quicksand, sans-serif',
            }}
          />
        </div>

        {/* Hair */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold opacity-60" style={{ fontFamily: 'Quicksand, sans-serif' }}>Hair Color</label>
          <Swatches colors={HAIR_COLORS} selected={draft.hairColor} onSelect={set('hairColor')} />
        </div>

        {/* Eyes */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold opacity-60" style={{ fontFamily: 'Quicksand, sans-serif' }}>Eye Color</label>
          <Swatches colors={EYE_COLORS} selected={draft.eyeColor} onSelect={set('eyeColor')} />
        </div>

        {/* Skin */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold opacity-60" style={{ fontFamily: 'Quicksand, sans-serif' }}>Skin Tone</label>
          <Swatches colors={SKIN_COLORS} selected={draft.skinColor} onSelect={set('skinColor')} />
        </div>

        {/* Outfit */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold opacity-60" style={{ fontFamily: 'Quicksand, sans-serif' }}>Outfit Color</label>
          <Swatches colors={OUTFIT_COLORS} selected={draft.outfitColor} onSelect={set('outfitColor')} />
        </div>

        {/* Accent (ribbon / tie) */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold opacity-60" style={{ fontFamily: 'Quicksand, sans-serif' }}>
            {mode === 'art' ? 'Ribbon & Blush Color' : 'Tie & Blush Color'}
          </label>
          <Swatches colors={ACCENT_COLORS} selected={draft.accentColor} onSelect={set('accentColor')} />
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-1">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-2xl text-sm font-bold transition-opacity hover:opacity-70"
            style={{ background: 'rgba(0,0,0,0.06)', color: 'rgba(80,60,100,0.6)', fontFamily: 'Quicksand, sans-serif' }}
          >
            Cancel
          </button>
          <button
            onClick={() => { onSave(draft); onClose(); }}
            className="flex-1 py-2.5 rounded-2xl text-sm font-bold text-white transition-opacity hover:opacity-90"
            style={{ background: `linear-gradient(135deg, ${accentColor}, ${draft.outfitColor})`, fontFamily: 'Quicksand, sans-serif' }}
          >
            Save ✨
          </button>
        </div>
      </div>
    </div>
  );
}
