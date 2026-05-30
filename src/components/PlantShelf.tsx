import { useState, useRef } from 'react';
import { PLANTS, getRandomUnlockedPlant } from '../data/plants';
import type { Plant, AppMode } from '../types';

interface PlantShelfProps {
  mode: AppMode;
  unlockedPlantIds: string[];
  customPlants: Plant[];
  xp: number;
  onUnlockPlant: (plantId: string) => void;
  onSpendXP: (amount: number) => boolean;
  onAddCustomPlant: (plant: Plant) => void;
}

const GACHA_COST = 500;

export default function PlantShelf({
  mode,
  unlockedPlantIds,
  customPlants,
  xp,
  onUnlockPlant,
  onSpendXP,
  onAddCustomPlant,
}: PlantShelfProps) {
  const [showGacha, setShowGacha] = useState(false);
  const [gachaResult, setGachaResult] = useState<Plant | null>(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [activeTab, setActiveTab] = useState<'shelf' | 'upload'>('shelf');
  const [uploadPreview, setUploadPreview] = useState<string | null>(null);
  const [uploadName, setUploadName] = useState('');
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const allPlants = [...PLANTS, ...customPlants];
  const unlockedPlants = allPlants.filter(p => unlockedPlantIds.includes(p.id));

  const canAffordGacha = xp >= GACHA_COST;
  const availableForGacha = allPlants.filter(p => !unlockedPlantIds.includes(p.id));

  const handleGacha = () => {
    if (!canAffordGacha) return;
    const result = getRandomUnlockedPlant(unlockedPlantIds, customPlants);
    if (!result) return;

    const success = onSpendXP(GACHA_COST);
    if (!success) return;

    setIsSpinning(true);
    setShowGacha(true);
    setGachaResult(null);

    setTimeout(() => {
      setIsSpinning(false);
      setGachaResult(result);
      onUnlockPlant(result.id);
    }, 1500);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!['image/png', 'image/jpeg', 'image/jpg', 'image/gif', 'image/webp'].includes(file.type)) {
      alert('Please upload a PNG, JPEG, GIF, or WebP image.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (ev) => {
      setUploadPreview(ev.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleAddCustom = () => {
    if (!uploadPreview || !uploadName.trim()) return;
    const newPlant: Plant = {
      id: `custom_${Date.now()}`,
      name: uploadName.trim(),
      emoji: '🎨',
      rarity: 'rare',
      color: '#F4A7C3',
      description: 'A plant I drew myself! ✨',
      isCustom: true,
      customImageUrl: uploadPreview,
      unlockedAt: Date.now(),
    };
    onAddCustomPlant(newPlant);
    setUploadPreview(null);
    setUploadName('');
    setUploadSuccess(true);
    setTimeout(() => setUploadSuccess(false), 3000);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const rarityColors: Record<string, { bg: string; border: string; text: string; badge: string }> = {
    common: {
      bg: 'rgba(200,240,232,0.3)',
      border: 'rgba(127,205,190,0.3)',
      text: '#7FCDBE',
      badge: 'rgba(127,205,190,0.8)',
    },
    rare: {
      bg: 'rgba(201,167,244,0.2)',
      border: 'rgba(201,167,244,0.4)',
      text: '#C9A7F4',
      badge: 'rgba(201,167,244,0.8)',
    },
    legendary: {
      bg: 'rgba(255,215,0,0.15)',
      border: 'rgba(255,215,0,0.4)',
      text: '#DAA520',
      badge: 'rgba(255,215,0,0.9)',
    },
  };

  const isArt = mode === 'art';
  const accentColor = isArt ? '#C9A7F4' : '#7FCDBE';

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2
          className="text-lg font-bold flex items-center gap-2"
          style={{ color: accentColor, fontFamily: 'Quicksand, sans-serif' }}
        >
          {isArt ? '🌿 Plant Shop Shelf' : '🏡 My Garden'}
        </h2>
        <span className="text-xs opacity-50">
          {unlockedPlants.length} / {allPlants.length} unlocked
        </span>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 p-1 rounded-2xl" style={{ background: 'rgba(0,0,0,0.05)' }}>
        {(['shelf', 'upload'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className="flex-1 py-1.5 rounded-xl text-sm font-semibold smooth-transition"
            style={{
              background: activeTab === tab ? 'rgba(255,255,255,0.9)' : 'transparent',
              color: activeTab === tab ? accentColor : 'rgba(0,0,0,0.4)',
              boxShadow: activeTab === tab ? '0 2px 6px rgba(0,0,0,0.08)' : 'none',
              fontFamily: 'Quicksand, sans-serif',
            }}
          >
            {tab === 'shelf' ? '🌱 My Plants' : '🎨 Upload Design'}
          </button>
        ))}
      </div>

      {activeTab === 'shelf' && (
        <>
          {/* Gacha Button */}
          <button
            onClick={handleGacha}
            disabled={!canAffordGacha || availableForGacha.length === 0}
            className="w-full py-3 rounded-2xl font-bold text-white smooth-transition active:scale-95 disabled:opacity-40 relative overflow-hidden"
            style={{
              background: canAffordGacha
                ? `linear-gradient(135deg, ${isArt ? '#F4A7C3, #C9A7F4' : '#7FCDBE, #7FB3CD'})`
                : 'rgba(200,200,200,0.5)',
              boxShadow: canAffordGacha ? `0 4px 15px ${accentColor}40` : 'none',
              fontFamily: 'Quicksand, sans-serif',
            }}
          >
            {canAffordGacha && <div className="absolute inset-0 shimmer-bg opacity-30" />}
            <span className="relative">
              {availableForGacha.length === 0
                ? '🌟 Collection Complete!'
                : canAffordGacha
                  ? `🎲 Pull a Plant! (500 XP)`
                  : `🔒 Need ${GACHA_COST - xp} more XP to pull`}
            </span>
          </button>

          {/* Gacha Modal */}
          {showGacha && (
            <div
              className="fixed inset-0 flex items-center justify-center z-50"
              style={{ background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)' }}
              onClick={() => { if (!isSpinning) setShowGacha(false); }}
            >
              <div
                className="rounded-3xl p-8 text-center max-w-xs w-full mx-4 animate-bounce-in"
                style={{
                  background: isArt
                    ? 'linear-gradient(135deg, #FFF0F5, #F5E8FF)'
                    : 'linear-gradient(135deg, #F0FFFE, #E8F4FF)',
                  boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
                }}
                onClick={e => e.stopPropagation()}
              >
                {isSpinning ? (
                  <>
                    <div className="text-6xl animate-spin mb-4">🌀</div>
                    <p className="font-bold text-lg" style={{ color: accentColor, fontFamily: 'Quicksand' }}>
                      Picking your plant...
                    </p>
                    <p className="text-sm opacity-50 mt-1">Something magical is blooming~ 🌱</p>
                  </>
                ) : gachaResult ? (
                  <>
                    <div className="text-7xl mb-3 animate-bounce-in">
                      {gachaResult.isCustom && gachaResult.customImageUrl
                        ? <img src={gachaResult.customImageUrl} alt={gachaResult.name} className="w-20 h-20 object-contain mx-auto rounded-2xl" />
                        : gachaResult.emoji}
                    </div>
                    <div
                      className="inline-block px-3 py-1 rounded-full text-xs font-bold text-white mb-2"
                      style={{ background: rarityColors[gachaResult.rarity].badge }}
                    >
                      {gachaResult.rarity.toUpperCase()}
                    </div>
                    <h3
                      className="text-xl font-bold mb-2"
                      style={{ color: rarityColors[gachaResult.rarity].text, fontFamily: 'Quicksand' }}
                    >
                      {gachaResult.name}
                    </h3>
                    <p className="text-sm opacity-60 mb-4" style={{ fontFamily: 'Nunito' }}>
                      {gachaResult.description}
                    </p>
                    <button
                      onClick={() => setShowGacha(false)}
                      className="px-6 py-2.5 rounded-xl font-bold text-white"
                      style={{ background: `linear-gradient(135deg, ${isArt ? '#F4A7C3, #C9A7F4' : '#7FCDBE, #7FB3CD'})` }}
                    >
                      Add to Shelf 🌿
                    </button>
                  </>
                ) : null}
              </div>
            </div>
          )}

          {/* Plant Grid */}
          <div className="grid grid-cols-4 gap-2 max-h-64 overflow-y-auto pr-1">
            {unlockedPlants.length === 0 && (
              <div className="col-span-4 text-center py-6 opacity-40">
                <div className="text-4xl mb-2">🌱</div>
                <p className="text-sm" style={{ fontFamily: 'Quicksand' }}>
                  No plants yet~<br />Earn 500 XP to pull!
                </p>
              </div>
            )}
            {unlockedPlants.map(plant => (
              <div
                key={plant.id}
                className="plant-card rounded-2xl p-2 text-center smooth-transition cursor-pointer"
                style={{
                  background: rarityColors[plant.rarity]?.bg ?? 'rgba(200,240,232,0.3)',
                  border: `1px solid ${rarityColors[plant.rarity]?.border ?? 'rgba(127,205,190,0.3)'}`,
                }}
                title={`${plant.name} — ${plant.description}`}
              >
                {plant.isCustom && plant.customImageUrl ? (
                  <img
                    src={plant.customImageUrl}
                    alt={plant.name}
                    className="w-8 h-8 object-contain mx-auto rounded-lg"
                  />
                ) : (
                  <div className="text-2xl">{plant.emoji}</div>
                )}
                <p
                  className="text-xs mt-1 font-semibold truncate"
                  style={{ color: rarityColors[plant.rarity]?.text ?? '#7FCDBE', fontSize: '9px' }}
                >
                  {plant.name}
                </p>
              </div>
            ))}
          </div>

          {/* Locked preview */}
          {unlockedPlants.length < allPlants.length && (
            <p className="text-xs text-center opacity-30" style={{ fontFamily: 'Nunito' }}>
              🔒 {allPlants.length - unlockedPlants.length} more plants waiting to bloom...
            </p>
          )}
        </>
      )}

      {activeTab === 'upload' && (
        <div className="space-y-3 animate-slide-up">
          <p className="text-xs opacity-60 text-center" style={{ fontFamily: 'Nunito' }}>
            Upload your own plant drawing to add it permanently to your collection! 🎨
          </p>

          {/* Upload area */}
          <div
            className="relative border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer smooth-transition"
            style={{
              borderColor: uploadPreview ? accentColor : 'rgba(200,180,220,0.4)',
              background: uploadPreview ? `${accentColor}10` : 'rgba(255,255,255,0.4)',
            }}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/jpg,image/gif,image/webp"
              className="hidden"
              onChange={handleFileUpload}
            />
            {uploadPreview ? (
              <img
                src={uploadPreview}
                alt="Preview"
                className="w-24 h-24 object-contain mx-auto rounded-2xl"
              />
            ) : (
              <>
                <div className="text-4xl mb-2">🌸</div>
                <p className="text-sm font-semibold" style={{ color: accentColor, fontFamily: 'Quicksand' }}>
                  Click to upload your plant drawing
                </p>
                <p className="text-xs opacity-40 mt-1">PNG, JPEG, GIF, WebP supported</p>
              </>
            )}
          </div>

          {uploadPreview && (
            <input
              type="text"
              placeholder="Name your plant (e.g. Moonberry Blossom)"
              value={uploadName}
              onChange={e => setUploadName(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl text-sm outline-none"
              style={{
                background: 'rgba(255,255,255,0.8)',
                border: `1px solid ${accentColor}50`,
                color: '#6B5B8A',
                fontFamily: 'Nunito, sans-serif',
              }}
            />
          )}

          <button
            onClick={handleAddCustom}
            disabled={!uploadPreview || !uploadName.trim()}
            className="w-full py-3 rounded-2xl font-bold text-white smooth-transition active:scale-95 disabled:opacity-40"
            style={{
              background: `linear-gradient(135deg, ${isArt ? '#F4A7C3, #C9A7F4' : '#7FCDBE, #7FB3CD'})`,
              fontFamily: 'Quicksand',
            }}
          >
            🌿 Add to My Collection
          </button>

          {uploadSuccess && (
            <div
              className="text-center py-2 px-4 rounded-xl animate-bounce-in"
              style={{ background: `${accentColor}20`, color: accentColor }}
            >
              <p className="text-sm font-semibold" style={{ fontFamily: 'Quicksand' }}>
                🎉 Plant added to your shelf!
              </p>
            </div>
          )}

          {/* Custom plants grid */}
          {customPlants.length > 0 && (
            <div>
              <p className="text-xs font-semibold mb-2 opacity-60" style={{ fontFamily: 'Quicksand' }}>
                My Designs ({customPlants.length})
              </p>
              <div className="grid grid-cols-4 gap-2">
                {customPlants.map(p => (
                  <div
                    key={p.id}
                    className="rounded-2xl p-2 text-center"
                    style={{ background: 'rgba(244,167,195,0.1)', border: '1px solid rgba(244,167,195,0.3)' }}
                  >
                    <img
                      src={p.customImageUrl}
                      alt={p.name}
                      className="w-8 h-8 object-contain mx-auto rounded-lg"
                    />
                    <p className="text-xs mt-1 font-semibold truncate" style={{ color: '#F4A7C3', fontSize: '9px' }}>
                      {p.name}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
