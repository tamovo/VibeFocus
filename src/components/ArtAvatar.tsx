import type { AppMode, CharacterCustomization } from '../types';

interface AvatarProps {
  mode: AppMode;
  isSessionActive?: boolean;
  customization: CharacterCustomization;
}

function lighten(hex: string, amount = 30): string {
  const n = parseInt(hex.slice(1), 16);
  const r = Math.min(255, (n >> 16) + amount);
  const g = Math.min(255, ((n >> 8) & 0xff) + amount);
  const b = Math.min(255, (n & 0xff) + amount);
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
}

function darken(hex: string, amount = 30): string {
  const n = parseInt(hex.slice(1), 16);
  const r = Math.max(0, (n >> 16) - amount);
  const g = Math.max(0, ((n >> 8) & 0xff) - amount);
  const b = Math.max(0, (n & 0xff) - amount);
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
}

export default function Avatar({ mode, isSessionActive, customization }: AvatarProps) {
  const { name, hairColor, eyeColor, skinColor, outfitColor, accentColor } = customization;
  const skinDark = darken(skinColor, 20);
  const hairLight = lighten(hairColor, 20);
  const outfitLight = lighten(outfitColor, 20);
  const bubbleColor = mode === 'art' ? accentColor : outfitColor;

  if (mode === 'art') {
    return (
      <div className="flex flex-col items-center gap-2">
        <div className="animate-float relative">
          <div
            className="w-24 h-28 rounded-3xl relative overflow-hidden"
            style={{ background: `linear-gradient(135deg, ${lighten(skinColor, 40)}, ${lighten(accentColor, 40)})` }}
          >
            {/* Hair */}
            <div
              className="absolute top-0 left-0 right-0 h-12 rounded-t-3xl"
              style={{ background: `linear-gradient(135deg, ${hairColor}, ${hairLight})` }}
            />
            {/* Hair side strands */}
            <div className="absolute top-4 left-1 w-5 h-16 rounded-b-2xl rounded-t-sm" style={{ background: hairColor, opacity: 0.9 }} />
            <div className="absolute top-4 right-1 w-5 h-16 rounded-b-2xl rounded-t-sm" style={{ background: hairColor, opacity: 0.9 }} />
            {/* Face */}
            <div
              className="absolute rounded-full"
              style={{ top: '16px', left: '18px', width: '60px', height: '60px', background: `linear-gradient(160deg, ${skinColor}, ${skinDark})` }}
            />
            {/* Eyes */}
            <div className="absolute flex gap-3" style={{ top: '30px', left: '22px' }}>
              <div className="w-4 h-5 rounded-full relative" style={{ background: eyeColor }}>
                <div className="absolute top-0.5 left-0.5 w-1.5 h-1.5 rounded-full bg-white opacity-70" />
              </div>
              <div className="w-4 h-5 rounded-full relative" style={{ background: eyeColor }}>
                <div className="absolute top-0.5 left-0.5 w-1.5 h-1.5 rounded-full bg-white opacity-70" />
              </div>
            </div>
            {/* Blush */}
            <div className="absolute w-5 h-2.5 rounded-full opacity-50" style={{ top: '40px', left: '18px', background: accentColor }} />
            <div className="absolute w-5 h-2.5 rounded-full opacity-50" style={{ top: '40px', right: '18px', background: accentColor }} />
            {/* Mouth */}
            <div
              className="absolute"
              style={{ top: '47px', left: '34px', width: '12px', height: '6px', borderBottom: `2px solid ${accentColor}`, borderRadius: '0 0 8px 8px' }}
            />
            {/* Ribbon */}
            <div
              className="absolute"
              style={{ top: '2px', left: '32px', width: '14px', height: '8px', background: `linear-gradient(135deg, ${accentColor}, ${lighten(accentColor, 30)})`, borderRadius: '3px' }}
            />
            {/* Body / Shirt */}
            <div
              className="absolute bottom-0 left-2 right-2 h-10 rounded-t-xl"
              style={{ background: `linear-gradient(135deg, ${outfitColor}, ${outfitLight})` }}
            />
            {/* Accessory */}
            <div className="absolute bottom-2 right-1 text-xl">🎨</div>
          </div>
          {isSessionActive && (
            <div
              className="absolute -top-10 -right-14 text-xs font-semibold px-3 py-1.5 rounded-2xl animate-pulse-soft"
              style={{ background: 'rgba(255,255,255,0.9)', color: bubbleColor, boxShadow: `0 2px 8px ${bubbleColor}4D`, whiteSpace: 'nowrap', fontFamily: 'Quicksand, sans-serif' }}
            >
              You got this! ✨
            </div>
          )}
        </div>
        <p className="text-xs font-semibold opacity-60 text-center" style={{ color: outfitColor, fontFamily: 'Quicksand, sans-serif' }}>
          {name} is cheering for you~
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="animate-float relative">
        <div
          className="w-24 h-28 rounded-3xl relative overflow-hidden"
          style={{ background: `linear-gradient(135deg, ${lighten(outfitColor, 50)}, ${lighten(outfitColor, 40)})` }}
        >
          {/* Hair */}
          <div className="absolute top-0 left-0 right-0 h-10 rounded-t-3xl" style={{ background: `linear-gradient(135deg, ${hairColor}, ${hairLight})` }} />
          <div className="absolute top-3 left-1 w-4 h-12 rounded-b-2xl" style={{ background: hairColor }} />
          <div className="absolute top-3 right-1 w-4 h-12 rounded-b-2xl" style={{ background: hairColor }} />
          {/* Face */}
          <div
            className="absolute rounded-full"
            style={{ top: '14px', left: '18px', width: '58px', height: '58px', background: `linear-gradient(160deg, ${skinColor}, ${skinDark})` }}
          />
          {/* Eyes */}
          <div className="absolute flex gap-3" style={{ top: '28px', left: '22px' }}>
            <div className="w-4 h-5 rounded-full relative" style={{ background: eyeColor }}>
              <div className="absolute top-0.5 left-0.5 w-1.5 h-1.5 rounded-full bg-white opacity-70" />
            </div>
            <div className="w-4 h-5 rounded-full relative" style={{ background: eyeColor }}>
              <div className="absolute top-0.5 left-0.5 w-1.5 h-1.5 rounded-full bg-white opacity-70" />
            </div>
          </div>
          {/* Blush */}
          <div className="absolute w-4 h-2 rounded-full opacity-40" style={{ top: '38px', left: '20px', background: accentColor }} />
          <div className="absolute w-4 h-2 rounded-full opacity-40" style={{ top: '38px', right: '20px', background: accentColor }} />
          {/* Smile */}
          <div
            className="absolute"
            style={{ top: '45px', left: '34px', width: '14px', height: '7px', borderBottom: `2px solid ${outfitColor}`, borderRadius: '0 0 8px 8px' }}
          />
          {/* Business jacket */}
          <div className="absolute bottom-0 left-0 right-0 h-12 rounded-t-xl" style={{ background: `linear-gradient(135deg, ${outfitColor}, ${darken(outfitColor, 20)})` }} />
          {/* Tie */}
          <div className="absolute bottom-4" style={{ left: '44px', width: '8px', height: '16px', background: accentColor, borderRadius: '2px' }} />
          {/* Waving arm */}
          <div className="absolute animate-wave-arm" style={{ top: '60px', right: '-6px', transformOrigin: 'top left' }}>
            <div style={{ width: '20px', height: '8px', background: outfitColor, borderRadius: '4px' }} />
            <div style={{ width: '12px', height: '10px', background: skinColor, borderRadius: '50%', marginTop: '-2px', marginLeft: '4px' }} />
          </div>
          {/* Accessory */}
          <div className="absolute bottom-2 left-1 text-xl">💻</div>
        </div>
        {isSessionActive && (
          <div
            className="absolute -top-10 -right-16 text-xs font-semibold px-3 py-1.5 rounded-2xl animate-pulse-soft"
            style={{ background: 'rgba(255,255,255,0.9)', color: bubbleColor, boxShadow: `0 2px 8px ${bubbleColor}4D`, whiteSpace: 'nowrap', fontFamily: 'Quicksand, sans-serif' }}
          >
            Great hustle! 💪
          </div>
        )}
      </div>
      <p className="text-xs font-semibold opacity-60 text-center" style={{ color: outfitColor, fontFamily: 'Quicksand, sans-serif' }}>
        {name} believes in you!
      </p>
    </div>
  );
}
