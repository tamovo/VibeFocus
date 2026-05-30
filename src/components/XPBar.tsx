import { useEffect, useRef, useState } from 'react';
import type { AppMode } from '../types';

interface XPBarProps {
  xp: number;
  totalXp: number;
  mode: AppMode;
}

export default function XPBar({ xp, totalXp, mode }: XPBarProps) {
  const [displayXp, setDisplayXp] = useState(xp);
  const [popups, setPopups] = useState<{ id: number; amount: number }[]>([]);
  const prevXpRef = useRef(xp);
  const counterRef = useRef(0);

  useEffect(() => {
    if (xp > prevXpRef.current) {
      const diff = xp - prevXpRef.current;
      const id = ++counterRef.current;
      setPopups(prev => [...prev, { id, amount: diff }]);
      setTimeout(() => {
        setPopups(prev => prev.filter(p => p.id !== id));
      }, 1000);
    }
    prevXpRef.current = xp;

    // Animate XP counter
    const start = displayXp;
    const end = xp;
    const duration = 400;
    const startTime = Date.now();
    const tick = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      setDisplayXp(Math.round(start + (end - start) * progress));
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [xp]);

  const GACHA_COST = 500;
  const progressPct = Math.min((xp % GACHA_COST) / GACHA_COST * 100, 100);
  const filledGems = Math.floor(xp / GACHA_COST);

  return (
    <div className="relative">
      {/* XP Popup Floaters */}
      <div className="absolute -top-8 left-1/2 -translate-x-1/2 pointer-events-none">
        {popups.map(p => (
          <div
            key={p.id}
            className="animate-xp-pop absolute text-sm font-bold whitespace-nowrap"
            style={{
              color: mode === 'art' ? '#C9A7F4' : '#7FCDBE',
              left: `${Math.random() * 60 - 30}px`,
              fontFamily: 'Quicksand, sans-serif',
              textShadow: '0 1px 3px rgba(0,0,0,0.2)',
            }}
          >
            +{p.amount} XP ✨
          </div>
        ))}
      </div>

      <div
        className="glass rounded-2xl p-4 soft-shadow"
        style={{
          background: mode === 'art'
            ? 'rgba(255,240,248,0.8)'
            : 'rgba(240,250,248,0.8)',
        }}
      >
        {/* XP Header */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="text-xl">⭐</span>
            <span
              className="font-bold text-lg"
              style={{
                color: mode === 'art' ? '#C9A7F4' : '#7FCDBE',
                fontFamily: 'Quicksand, sans-serif',
              }}
            >
              {displayXp.toLocaleString()} XP
            </span>
          </div>
          <div className="text-xs opacity-60" style={{ fontFamily: 'Nunito, sans-serif' }}>
            Total earned: {totalXp.toLocaleString()} XP
          </div>
        </div>

        {/* Progress Bar */}
        <div className="relative h-3 rounded-full overflow-hidden mb-2" style={{ background: 'rgba(0,0,0,0.08)' }}>
          <div
            className="h-full rounded-full smooth-transition"
            style={{
              width: `${progressPct}%`,
              background: mode === 'art'
                ? 'linear-gradient(90deg, #F4A7C3, #C9A7F4, #A7C4F4)'
                : 'linear-gradient(90deg, #7FCDBE, #7FB3CD, #7FA7F4)',
              boxShadow: mode === 'art'
                ? '0 0 8px rgba(201,167,244,0.6)'
                : '0 0 8px rgba(127,205,190,0.6)',
            }}
          />
          {/* Shimmer */}
          <div
            className="absolute inset-0 rounded-full shimmer-bg opacity-40"
            style={{ width: `${progressPct}%` }}
          />
        </div>

        {/* Next gacha label */}
        <div className="flex items-center justify-between">
          <div className="text-xs opacity-50">
            🌱 {xp % GACHA_COST} / {GACHA_COST} XP to next plant gacha
          </div>
          {filledGems > 0 && (
            <div className="flex gap-0.5">
              {Array.from({ length: Math.min(filledGems, 5) }).map((_, i) => (
                <span key={i} className="text-xs animate-sparkle" style={{ animationDelay: `${i * 0.3}s` }}>💎</span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
