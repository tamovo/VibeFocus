import { useEffect, useRef, useState } from 'react';

interface Particle {
  id: number;
  x: number;
  y: number;
  amount: number;
  color: string;
}

interface FloatingXPProps {
  mode: 'art' | 'job';
  xp: number;
}

export default function FloatingXP({ mode, xp }: FloatingXPProps) {
  const [particles, setParticles] = useState<Particle[]>([]);
  const prevXpRef = useRef(xp);
  const counterRef = useRef(0);

  useEffect(() => {
    if (xp > prevXpRef.current) {
      const diff = xp - prevXpRef.current;
      const id = ++counterRef.current;
      const colors = mode === 'art'
        ? ['#F4A7C3', '#C9A7F4', '#A7C4F4', '#FFD700']
        : ['#7FCDBE', '#7FB3CD', '#7FA7F4', '#FFD700'];
      const color = colors[Math.floor(Math.random() * colors.length)];
      const x = 20 + Math.random() * 60; // vw percent
      const y = 20 + Math.random() * 40; // vh percent

      setParticles(prev => [...prev, { id, x, y, amount: diff, color }]);
      setTimeout(() => {
        setParticles(prev => prev.filter(p => p.id !== id));
      }, 1200);
    }
    prevXpRef.current = xp;
  }, [xp, mode]);

  return (
    <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 100 }}>
      {particles.map(p => (
        <div
          key={p.id}
          className="absolute animate-xp-pop font-bold text-base"
          style={{
            left: `${p.x}vw`,
            top: `${p.y}vh`,
            color: p.color,
            textShadow: `0 0 10px ${p.color}80, 0 1px 3px rgba(0,0,0,0.2)`,
            fontFamily: 'Quicksand, sans-serif',
            whiteSpace: 'nowrap',
          }}
        >
          +{p.amount} XP ✨
        </div>
      ))}
    </div>
  );
}
