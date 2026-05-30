import type { AppMode } from '../types';

interface AvatarProps {
  mode: AppMode;
  isSessionActive?: boolean;
}

export default function Avatar({ mode, isSessionActive }: AvatarProps) {
  if (mode === 'art') {
    return (
      <div className="flex flex-col items-center gap-2">
        {/* Static anime girl avatar */}
        <div className="animate-float relative">
          <div
            className="w-24 h-28 rounded-3xl relative overflow-hidden"
            style={{ background: 'linear-gradient(135deg, #FFE4EE, #F4D0F8)' }}
          >
            {/* Hair */}
            <div
              className="absolute top-0 left-0 right-0 h-12 rounded-t-3xl"
              style={{ background: 'linear-gradient(135deg, #8B4B6B, #A855A0)' }}
            />
            {/* Hair side strands */}
            <div
              className="absolute top-4 left-1 w-5 h-16 rounded-b-2xl rounded-t-sm"
              style={{ background: '#8B4B6B', opacity: 0.9 }}
            />
            <div
              className="absolute top-4 right-1 w-5 h-16 rounded-b-2xl rounded-t-sm"
              style={{ background: '#8B4B6B', opacity: 0.9 }}
            />
            {/* Face */}
            <div
              className="absolute rounded-full"
              style={{
                top: '16px', left: '18px', width: '60px', height: '60px',
                background: 'linear-gradient(160deg, #FFD8C8, #FFC5B0)',
              }}
            />
            {/* Eyes */}
            <div className="absolute flex gap-3" style={{ top: '30px', left: '22px' }}>
              <div className="w-4 h-5 rounded-full bg-purple-800 relative">
                <div className="absolute top-0.5 left-0.5 w-1.5 h-1.5 rounded-full bg-white opacity-70" />
              </div>
              <div className="w-4 h-5 rounded-full bg-purple-800 relative">
                <div className="absolute top-0.5 left-0.5 w-1.5 h-1.5 rounded-full bg-white opacity-70" />
              </div>
            </div>
            {/* Blush */}
            <div className="absolute w-5 h-2.5 rounded-full opacity-50" style={{ top: '40px', left: '18px', background: '#FFB3C6' }} />
            <div className="absolute w-5 h-2.5 rounded-full opacity-50" style={{ top: '40px', right: '18px', background: '#FFB3C6' }} />
            {/* Mouth */}
            <div
              className="absolute"
              style={{
                top: '47px', left: '34px', width: '12px', height: '6px',
                borderBottom: '2px solid #FF8FAB',
                borderRadius: '0 0 8px 8px',
              }}
            />
            {/* Ribbon */}
            <div
              className="absolute"
              style={{
                top: '2px', left: '32px', width: '14px', height: '8px',
                background: 'linear-gradient(135deg, #FF69B4, #FFB3D9)',
                borderRadius: '3px',
              }}
            />
            {/* Body / Shirt */}
            <div
              className="absolute bottom-0 left-2 right-2 h-10 rounded-t-xl"
              style={{ background: 'linear-gradient(135deg, #C9A7F4, #F4A7C3)' }}
            />
            {/* Art palette in hand */}
            <div className="absolute bottom-2 right-1 text-xl">🎨</div>
          </div>
          {/* Speech bubble */}
          {isSessionActive && (
            <div
              className="absolute -top-10 -right-14 text-xs font-semibold px-3 py-1.5 rounded-2xl animate-pulse-soft"
              style={{
                background: 'rgba(255,255,255,0.9)',
                color: '#C9A7F4',
                boxShadow: '0 2px 8px rgba(201,167,244,0.3)',
                whiteSpace: 'nowrap',
                fontFamily: 'Quicksand, sans-serif',
              }}
            >
              You got this! ✨
            </div>
          )}
        </div>
        <p
          className="text-xs font-semibold opacity-60 text-center"
          style={{ color: '#C9A7F4', fontFamily: 'Quicksand, sans-serif' }}
        >
          Yuki is cheering for you~
        </p>
      </div>
    );
  }

  // Job Hunt Mode: animated waving figure
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="animate-float relative">
        <div
          className="w-24 h-28 rounded-3xl relative overflow-hidden"
          style={{ background: 'linear-gradient(135deg, #E0F4FF, #D0EDF8)' }}
        >
          {/* Hair */}
          <div
            className="absolute top-0 left-0 right-0 h-10 rounded-t-3xl"
            style={{ background: 'linear-gradient(135deg, #4A6B8B, #5B82A0)' }}
          />
          <div
            className="absolute top-3 left-1 w-4 h-12 rounded-b-2xl"
            style={{ background: '#4A6B8B' }}
          />
          <div
            className="absolute top-3 right-1 w-4 h-12 rounded-b-2xl"
            style={{ background: '#4A6B8B' }}
          />
          {/* Face */}
          <div
            className="absolute rounded-full"
            style={{
              top: '14px', left: '18px', width: '58px', height: '58px',
              background: 'linear-gradient(160deg, #FFD8C8, #FFC5B0)',
            }}
          />
          {/* Eyes */}
          <div className="absolute flex gap-3" style={{ top: '28px', left: '22px' }}>
            <div className="w-4 h-5 rounded-full bg-blue-800 relative">
              <div className="absolute top-0.5 left-0.5 w-1.5 h-1.5 rounded-full bg-white opacity-70" />
            </div>
            <div className="w-4 h-5 rounded-full bg-blue-800 relative">
              <div className="absolute top-0.5 left-0.5 w-1.5 h-1.5 rounded-full bg-white opacity-70" />
            </div>
          </div>
          {/* Blush */}
          <div className="absolute w-4 h-2 rounded-full opacity-40" style={{ top: '38px', left: '20px', background: '#B0C8E8' }} />
          <div className="absolute w-4 h-2 rounded-full opacity-40" style={{ top: '38px', right: '20px', background: '#B0C8E8' }} />
          {/* Smile */}
          <div
            className="absolute"
            style={{
              top: '45px', left: '34px', width: '14px', height: '7px',
              borderBottom: '2px solid #6B9EC8',
              borderRadius: '0 0 8px 8px',
            }}
          />
          {/* Business jacket */}
          <div
            className="absolute bottom-0 left-0 right-0 h-12 rounded-t-xl"
            style={{ background: 'linear-gradient(135deg, #7FB3CD, #5B9BC0)' }}
          />
          {/* Tie */}
          <div
            className="absolute bottom-4"
            style={{ left: '44px', width: '8px', height: '16px', background: '#FFB3C6', borderRadius: '2px' }}
          />
          {/* Waving arm */}
          <div
            className="absolute animate-wave-arm"
            style={{ top: '60px', right: '-6px', transformOrigin: 'top left' }}
          >
            <div style={{ width: '20px', height: '8px', background: '#7FB3CD', borderRadius: '4px' }} />
            <div style={{ width: '12px', height: '10px', background: '#FFD8C8', borderRadius: '50%', marginTop: '-2px', marginLeft: '4px' }} />
          </div>
          {/* Laptop in hand */}
          <div className="absolute bottom-2 left-1 text-xl">💻</div>
        </div>
        {/* Speech bubble */}
        {isSessionActive && (
          <div
            className="absolute -top-10 -right-16 text-xs font-semibold px-3 py-1.5 rounded-2xl animate-pulse-soft"
            style={{
              background: 'rgba(255,255,255,0.9)',
              color: '#7FB3CD',
              boxShadow: '0 2px 8px rgba(127,179,205,0.3)',
              whiteSpace: 'nowrap',
              fontFamily: 'Quicksand, sans-serif',
            }}
          >
            Great hustle! 💪
          </div>
        )}
      </div>
      <p
        className="text-xs font-semibold opacity-60 text-center"
        style={{ color: '#7FB3CD', fontFamily: 'Quicksand, sans-serif' }}
      >
        Hiro believes in you!
      </p>
    </div>
  );
}
