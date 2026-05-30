import { useState, useEffect, useRef } from 'react';
import { RADIO_THEMES } from '../data/lofiTracks';
import type { AppMode } from '../types';

interface LofiPlayerProps {
  mode: AppMode;
  currentTrackIndex: number;
  volume: number;
  onTrackChange: (index: number) => void;
  onVolumeChange: (volume: number) => void;
}

export default function LofiPlayer({
  mode,
  currentTrackIndex,
  volume,
  onTrackChange,
  onVolumeChange,
}: LofiPlayerProps) {
  const themeIdx = Math.min(currentTrackIndex, RADIO_THEMES.length - 1);
  const theme = RADIO_THEMES[themeIdx];

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [barHeights, setBarHeights] = useState([40, 65, 50, 80, 55]);
  const barIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const isArt = mode === 'art';
  const accentColor = isArt ? '#C9A7F4' : '#7FCDBE';
  const accentColor2 = isArt ? '#F4A7C3' : '#7FB3CD';

  // Create the audio element once on mount and wire up all events
  useEffect(() => {
    const audio = new Audio();

    const onPlaying = () => { setIsLoading(false); setIsPlaying(true); setHasError(false); };
    const onWaiting = () => setIsLoading(true);
    const onCanPlay = () => setIsLoading(false);
    const onError = () => { setIsLoading(false); setHasError(true); setIsPlaying(false); };
    const onPause = () => setIsPlaying(false);

    audio.addEventListener('playing', onPlaying);
    audio.addEventListener('waiting', onWaiting);
    audio.addEventListener('canplay', onCanPlay);
    audio.addEventListener('error', onError);
    audio.addEventListener('pause', onPause);

    audioRef.current = audio;

    return () => {
      audio.removeEventListener('playing', onPlaying);
      audio.removeEventListener('waiting', onWaiting);
      audio.removeEventListener('canplay', onCanPlay);
      audio.removeEventListener('error', onError);
      audio.removeEventListener('pause', onPause);
      audio.pause();
      audio.src = '';
    };
  }, []);

  // Sync volume whenever it changes
  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume / 100;
  }, [volume]);

  // Animate equalizer bars while playing
  useEffect(() => {
    if (isPlaying) {
      barIntervalRef.current = setInterval(() => {
        setBarHeights([
          30 + Math.random() * 60,
          30 + Math.random() * 60,
          30 + Math.random() * 60,
          30 + Math.random() * 60,
          30 + Math.random() * 60,
        ]);
      }, 150);
    } else {
      if (barIntervalRef.current) clearInterval(barIntervalRef.current);
      setBarHeights([40, 65, 50, 80, 55]);
    }
    return () => { if (barIntervalRef.current) clearInterval(barIntervalRef.current); };
  }, [isPlaying]);

  const startStream = async (url: string) => {
    const audio = audioRef.current;
    if (!audio) return;
    setHasError(false);
    setIsLoading(true);
    audio.src = url;
    audio.volume = volume / 100;
    try {
      await audio.play();
    } catch {
      setHasError(true);
      setIsLoading(false);
      setIsPlaying(false);
    }
  };

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.pause();
    } else {
      startStream(theme.streamUrl);
    }
  };

  const selectTheme = (idx: number) => {
    onTrackChange(idx);
    const newTheme = RADIO_THEMES[idx];
    // If already playing, switch stream immediately
    if (isPlaying) {
      startStream(newTheme.streamUrl);
    }
  };

  const retryStream = () => {
    // Try the ice2 mirror on retry
    const mirrorUrl = theme.streamUrl.replace('ice1.', 'ice2.');
    startStream(mirrorUrl);
  };

  return (
    <div
      className="rounded-3xl overflow-hidden soft-shadow smooth-transition"
      style={{
        background: isArt ? 'rgba(255,240,248,0.9)' : 'rgba(240,250,248,0.9)',
        border: `1px solid ${accentColor}30`,
      }}
    >
      {/* ── Compact Bar (always visible) ── */}
      <div
        className="p-3.5 flex items-center gap-3 cursor-pointer select-none"
        onClick={() => setIsExpanded(e => !e)}
      >
        {/* Equalizer / Emoji */}
        <div className="flex items-end gap-0.5 h-7 w-8 flex-shrink-0">
          {isPlaying ? (
            barHeights.map((h, i) => (
              <div
                key={i}
                className="flex-1 rounded-sm"
                style={{
                  height: `${h}%`,
                  background: `linear-gradient(to top, ${accentColor2}, ${accentColor})`,
                  transition: 'height 0.15s ease',
                }}
              />
            ))
          ) : (
            <span className="text-xl self-center w-full text-center">{theme.emoji}</span>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <p
            className="font-bold text-sm truncate leading-tight"
            style={{ color: accentColor, fontFamily: 'Quicksand, sans-serif' }}
          >
            {theme.name}
          </p>
          <p
            className="text-xs truncate leading-tight"
            style={{ color: 'rgba(100,80,120,0.5)', fontFamily: 'Nunito' }}
          >
            {isLoading ? '⏳ Buffering…' : hasError ? '⚠️ Stream error' : isPlaying ? `♾ Live · ${theme.mood}` : theme.description}
          </p>
        </div>

        {/* Play / Pause */}
        <button
          onClick={e => { e.stopPropagation(); togglePlay(); }}
          className="w-9 h-9 rounded-full flex items-center justify-center smooth-transition active:scale-90 flex-shrink-0"
          style={{
            background: isPlaying
              ? `linear-gradient(135deg, ${accentColor2}, ${accentColor})`
              : `${accentColor}20`,
          }}
        >
          {isLoading ? (
            <span className="text-xs animate-spin inline-block">⏳</span>
          ) : (
            <span className="text-sm" style={{ color: isPlaying ? 'white' : accentColor }}>
              {isPlaying ? '⏸' : '▶'}
            </span>
          )}
        </button>

        {/* Chevron */}
        <div
          className="text-xs flex-shrink-0 smooth-transition"
          style={{
            color: `${accentColor}60`,
            transform: isExpanded ? 'rotate(180deg)' : 'none',
          }}
        >
          ▼
        </div>
      </div>

      {/* ── Expanded Panel ── */}
      {isExpanded && (
        <div
          className="px-4 pb-4 space-y-3 animate-slide-up"
          style={{ borderTop: `1px solid ${accentColor}15` }}
        >
          <div className="pt-3" />

          {/* Error banner */}
          {hasError && (
            <div
              className="flex items-center justify-between px-3 py-2 rounded-xl animate-slide-up"
              style={{ background: 'rgba(244,167,195,0.15)', border: '1px solid rgba(244,167,195,0.4)' }}
            >
              <p className="text-xs" style={{ color: '#C9A7F4', fontFamily: 'Nunito' }}>
                Stream unavailable. Try another theme or retry~
              </p>
              <button
                onClick={e => { e.stopPropagation(); retryStream(); }}
                className="text-xs font-bold px-2 py-1 rounded-lg ml-2 flex-shrink-0"
                style={{ background: `${accentColor}20`, color: accentColor }}
              >
                Retry
              </button>
            </div>
          )}

          {/* Theme Grid */}
          <div>
            <p
              className="text-xs font-semibold mb-2 opacity-50"
              style={{ color: accentColor, fontFamily: 'Quicksand' }}
            >
              🎵 Choose a vibe
            </p>
            <div className="grid grid-cols-3 gap-1.5">
              {RADIO_THEMES.map((t, idx) => (
                <button
                  key={t.id}
                  onClick={e => { e.stopPropagation(); selectTheme(idx); }}
                  className="py-2 px-1 rounded-xl text-center smooth-transition active:scale-95"
                  style={{
                    background: themeIdx === idx
                      ? `linear-gradient(135deg, ${accentColor2}35, ${accentColor}35)`
                      : 'rgba(255,255,255,0.45)',
                    border: `1.5px solid ${themeIdx === idx ? accentColor + '60' : 'transparent'}`,
                    boxShadow: themeIdx === idx ? `0 2px 8px ${accentColor}25` : 'none',
                  }}
                >
                  <div className="text-lg leading-none">{t.emoji}</div>
                  <div
                    className="font-semibold mt-0.5 leading-tight"
                    style={{
                      color: themeIdx === idx ? accentColor : 'rgba(100,80,120,0.55)',
                      fontFamily: 'Quicksand, sans-serif',
                      fontSize: '9px',
                    }}
                  >
                    {t.name}
                  </div>
                  {themeIdx === idx && isPlaying && (
                    <div className="flex justify-center gap-px mt-1 h-2 items-end">
                      {[0, 1, 2].map(i => (
                        <div
                          key={i}
                          className="w-0.5 rounded-full"
                          style={{
                            background: accentColor,
                            height: `${barHeights[i] * 0.08 + 3}px`,
                            transition: 'height 0.15s ease',
                          }}
                        />
                      ))}
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Now-playing info */}
          <div
            className="flex items-center gap-2 px-3 py-2 rounded-xl"
            style={{ background: `${accentColor}12` }}
          >
            <span className="text-base">{theme.emoji}</span>
            <div className="flex-1 min-w-0">
              <p
                className="text-xs font-bold truncate"
                style={{ color: accentColor, fontFamily: 'Quicksand' }}
              >
                {theme.name}
              </p>
              <p
                className="text-xs opacity-40 truncate"
                style={{ fontFamily: 'Nunito', fontSize: '10px' }}
              >
                {theme.description} · ∞ Live Stream · SomaFM
              </p>
            </div>
            {isPlaying && !isLoading && (
              <span className="text-xs animate-pulse-soft" style={{ color: accentColor }}>
                ●
              </span>
            )}
          </div>

          {/* Volume */}
          <div className="flex items-center gap-2">
            <button
              onClick={e => { e.stopPropagation(); onVolumeChange(0); }}
              className="text-sm flex-shrink-0"
              style={{ opacity: 0.5 }}
            >
              🔈
            </button>
            <input
              type="range"
              min="0"
              max="100"
              value={volume}
              onChange={e => onVolumeChange(parseInt(e.target.value))}
              className="flex-1"
              onClick={e => e.stopPropagation()}
              style={{
                background: `linear-gradient(to right, ${accentColor} 0%, ${accentColor} ${volume}%, rgba(200,180,220,0.25) ${volume}%, rgba(200,180,220,0.25) 100%)`,
                accentColor,
              }}
            />
            <button
              onClick={e => { e.stopPropagation(); onVolumeChange(100); }}
              className="text-sm flex-shrink-0"
              style={{ opacity: 0.5 }}
            >
              🔊
            </button>
            <span
              className="text-xs w-7 text-right flex-shrink-0"
              style={{ color: accentColor, fontFamily: 'Nunito' }}
            >
              {volume}%
            </span>
          </div>

          <p
            className="text-center opacity-25"
            style={{ fontFamily: 'Nunito', fontSize: '10px' }}
          >
            Powered by SomaFM · Free internet radio ∞
          </p>
        </div>
      )}
    </div>
  );
}
