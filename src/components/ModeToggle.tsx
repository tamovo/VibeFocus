import type { AppMode } from '../types';

interface ModeToggleProps {
  mode: AppMode;
  onToggle: (mode: AppMode) => void;
}

export default function ModeToggle({ mode, onToggle }: ModeToggleProps) {
  return (
    <div className="flex items-center justify-center">
      <div
        className="relative flex items-center p-1 rounded-full glass soft-shadow"
        style={{
          background: mode === 'art'
            ? 'linear-gradient(135deg, rgba(244,167,195,0.3), rgba(201,167,244,0.3))'
            : 'linear-gradient(135deg, rgba(127,205,190,0.3), rgba(127,179,205,0.3))',
          border: '1px solid rgba(255,255,255,0.8)',
        }}
      >
        {/* Sliding indicator */}
        <div
          className="absolute top-1 bottom-1 rounded-full smooth-transition"
          style={{
            width: '50%',
            left: mode === 'art' ? '4px' : 'calc(50% - 4px)',
            background: mode === 'art'
              ? 'linear-gradient(135deg, #F4A7C3, #C9A7F4)'
              : 'linear-gradient(135deg, #7FCDBE, #7FB3CD)',
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
          }}
        />

        {/* Art Mode Button */}
        <button
          onClick={() => onToggle('art')}
          className="relative z-10 flex items-center gap-2 px-5 py-2.5 rounded-full smooth-transition font-semibold text-sm"
          style={{
            color: mode === 'art' ? 'white' : 'rgba(100,80,100,0.7)',
            fontFamily: 'Quicksand, sans-serif',
          }}
        >
          <span className="text-base">🎨</span>
          Art School Mode
        </button>

        {/* Job Hunt Button */}
        <button
          onClick={() => onToggle('job')}
          className="relative z-10 flex items-center gap-2 px-5 py-2.5 rounded-full smooth-transition font-semibold text-sm"
          style={{
            color: mode === 'job' ? 'white' : 'rgba(80,100,100,0.7)',
            fontFamily: 'Quicksand, sans-serif',
          }}
        >
          <span className="text-base">💼</span>
          Job Hunt Mode
        </button>
      </div>
    </div>
  );
}
