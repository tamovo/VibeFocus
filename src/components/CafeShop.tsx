import { useState } from 'react';
import type { CafeItem, AppMode } from '../types';

interface CafeShopProps {
  mode: AppMode;
  items: CafeItem[];
  xp: number;
  onUnlock: (itemId: string, cost: number) => void;
}

const CATEGORY_LABELS: Record<string, string> = {
  drink: '☕ Drinks',
  snack: '🍪 Snacks',
  decor: '✨ Decor',
  study: '📚 Study',
};

export default function CafeShop({ mode, items, xp, onUnlock }: CafeShopProps) {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [justUnlocked, setJustUnlocked] = useState<string | null>(null);

  const categories = ['all', 'drink', 'snack', 'decor', 'study'];
  const filtered = activeCategory === 'all'
    ? items
    : items.filter(i => i.category === activeCategory);

  const accentColor = mode === 'art' ? '#C9A7F4' : '#7FCDBE';
  const isArt = mode === 'art';

  const handleUnlock = (item: CafeItem) => {
    if (item.unlocked || xp < item.cost) return;
    onUnlock(item.id, item.cost);
    setJustUnlocked(item.id);
    setTimeout(() => setJustUnlocked(null), 2000);
  };

  const unlockedCount = items.filter(i => i.unlocked).length;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2
          className="text-lg font-bold flex items-center gap-2"
          style={{ color: accentColor, fontFamily: 'Quicksand, sans-serif' }}
        >
          {isArt ? '🌿 Plant Shop' : '☕ Office Café Shop'}
        </h2>
        <span className="text-xs opacity-50">{unlockedCount}/{items.length} unlocked</span>
      </div>

      {/* Category Filter */}
      <div className="flex gap-1.5 overflow-x-auto pb-1">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className="flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold smooth-transition"
            style={{
              background: activeCategory === cat
                ? `linear-gradient(135deg, ${isArt ? '#F4A7C3, #C9A7F4' : '#7FCDBE, #7FB3CD'})`
                : 'rgba(255,255,255,0.5)',
              color: activeCategory === cat ? 'white' : 'rgba(100,80,120,0.6)',
              border: `1px solid ${activeCategory === cat ? 'transparent' : 'rgba(200,180,220,0.3)'}`,
              fontFamily: 'Quicksand, sans-serif',
            }}
          >
            {cat === 'all' ? '🛍️ All' : CATEGORY_LABELS[cat]}
          </button>
        ))}
      </div>

      {/* Items Grid */}
      <div className="grid grid-cols-2 gap-3 max-h-80 overflow-y-auto pr-1">
        {filtered.map(item => {
          const canAfford = xp >= item.cost;
          const isNew = justUnlocked === item.id;
          return (
            <div
              key={item.id}
              className="rounded-2xl p-3 smooth-transition relative overflow-hidden"
              style={{
                background: item.unlocked
                  ? `linear-gradient(135deg, ${isArt ? 'rgba(244,167,195,0.15), rgba(201,167,244,0.15)' : 'rgba(127,205,190,0.15), rgba(127,179,205,0.15)'})`
                  : 'rgba(255,255,255,0.5)',
                border: `1px solid ${item.unlocked ? accentColor + '40' : 'rgba(200,180,220,0.2)'}`,
                opacity: !item.unlocked && !canAfford ? 0.7 : 1,
              }}
            >
              {isNew && <div className="absolute inset-0 shimmer-bg opacity-50 rounded-2xl" />}
              <div className="relative">
                <div className="flex items-start justify-between mb-1">
                  <span className="text-2xl">{item.emoji}</span>
                  {item.unlocked ? (
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full text-white"
                      style={{ background: accentColor }}>
                      ✓ Got it!
                    </span>
                  ) : (
                    <span className="text-xs font-semibold opacity-60">
                      ⭐ {item.cost}
                    </span>
                  )}
                </div>
                <p className="text-xs font-bold mb-0.5" style={{ color: item.unlocked ? accentColor : '#6B5B8A', fontFamily: 'Quicksand' }}>
                  {item.name}
                </p>
                <p className="text-xs opacity-50 leading-tight mb-2" style={{ fontFamily: 'Nunito', fontSize: '10px' }}>
                  {item.description}
                </p>
                {!item.unlocked && (
                  <button
                    onClick={() => handleUnlock(item)}
                    disabled={!canAfford}
                    className="w-full py-1.5 rounded-xl text-xs font-bold smooth-transition active:scale-95 disabled:cursor-not-allowed"
                    style={{
                      background: canAfford
                        ? `linear-gradient(135deg, ${isArt ? '#F4A7C3, #C9A7F4' : '#7FCDBE, #7FB3CD'})`
                        : 'rgba(200,190,220,0.3)',
                      color: canAfford ? 'white' : 'rgba(150,130,170,0.7)',
                    }}
                  >
                    {canAfford ? `Unlock — ${item.cost} XP` : `Need ${item.cost - xp} more XP`}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {unlockedCount === items.length && (
        <div className="text-center py-3 opacity-60">
          <p className="text-2xl mb-1">🎉</p>
          <p className="text-sm font-semibold" style={{ color: accentColor, fontFamily: 'Quicksand' }}>
            You've unlocked everything! Legend~
          </p>
        </div>
      )}
    </div>
  );
}
