import { useState, useEffect, useRef } from 'react';

interface JobModeProps {
  onEarnXP: (amount: number) => void;
  onSessionEnd: (durationMinutes: number, xpEarned: number) => void;
  xp: number;
}

export default function JobMode({ onEarnXP, onSessionEnd }: JobModeProps) {
  const [isRunning, setIsRunning] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [sessionXP, setSessionXP] = useState(0);
  const [liveXPFlash, setLiveXPFlash] = useState(false);
  const [sessionCount, setSessionCount] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const xpIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const elapsedRef = useRef(0);
  const sessionXPRef = useRef(0);

  useEffect(() => {
    elapsedRef.current = elapsedSeconds;
  }, [elapsedSeconds]);

  useEffect(() => {
    sessionXPRef.current = sessionXP;
  }, [sessionXP]);

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (xpIntervalRef.current) clearInterval(xpIntervalRef.current);
    };
  }, []);

  const startSession = () => {
    setIsRunning(true);

    // Main clock interval
    intervalRef.current = setInterval(() => {
      setElapsedSeconds(prev => prev + 1);
    }, 1000);

    // XP interval — 1 XP per minute (every 60 seconds)
    xpIntervalRef.current = setInterval(() => {
      onEarnXP(1);
      setSessionXP(prev => prev + 1);
      setLiveXPFlash(true);
      setTimeout(() => setLiveXPFlash(false), 600);
    }, 60000);
  };

  const stopSession = () => {
    setIsRunning(false);
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (xpIntervalRef.current) clearInterval(xpIntervalRef.current);

    const durationMinutes = Math.floor(elapsedRef.current / 60);
    if (durationMinutes > 0 || sessionXPRef.current > 0) {
      onSessionEnd(durationMinutes, sessionXPRef.current);
    }
    setSessionCount(prev => prev + 1);
  };

  const resetSession = () => {
    setElapsedSeconds(0);
    setSessionXP(0);
  };

  const formatTime = (secs: number) => {
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    if (h > 0) {
      return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    }
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const xpPerMinute = 1;
  const minutesElapsed = Math.floor(elapsedSeconds / 60);
  const secondsInCurrentMinute = elapsedSeconds % 60;
  const nextXPIn = 60 - secondsInCurrentMinute;

  return (
    <div className="space-y-5 animate-slide-up">
      {/* Main Stopwatch Card */}
      <div
        className="rounded-3xl p-6 soft-shadow-mint text-center"
        style={{ background: 'rgba(240,250,248,0.95)', border: '1px solid rgba(127,205,190,0.3)' }}
      >
        <h2
          className="text-lg font-bold mb-5 flex items-center justify-center gap-2"
          style={{ color: '#7FCDBE', fontFamily: 'Quicksand, sans-serif' }}
        >
          ⏱️ Live Job Hunt Tracker
        </h2>

        {/* Big Stopwatch */}
        <div className="relative inline-block mb-5">
          <div
            className="text-6xl font-mono font-bold smooth-transition"
            style={{
              color: isRunning ? '#7FCDBE' : '#B0D0CC',
              textShadow: isRunning ? '0 0 25px rgba(127,205,190,0.5)' : 'none',
              fontFamily: 'Quicksand, sans-serif',
              letterSpacing: '0.05em',
            }}
          >
            {formatTime(elapsedSeconds)}
          </div>

          {/* Live XP flash */}
          {liveXPFlash && (
            <div
              className="absolute -top-8 left-1/2 -translate-x-1/2 text-sm font-bold animate-xp-pop"
              style={{ color: '#7FCDBE', whiteSpace: 'nowrap' }}
            >
              +1 XP ⚡
            </div>
          )}
        </div>

        {/* XP Progress Ring */}
        <div className="flex items-center justify-center gap-4 mb-5">
          <div
            className="relative w-16 h-16"
            title={`Next XP in ${nextXPIn}s`}
          >
            <svg className="w-16 h-16 -rotate-90" viewBox="0 0 64 64">
              <circle cx="32" cy="32" r="28" fill="none" stroke="rgba(127,205,190,0.15)" strokeWidth="4" />
              <circle
                cx="32" cy="32" r="28"
                fill="none"
                stroke="url(#xpGradient)"
                strokeWidth="4"
                strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 28}`}
                strokeDashoffset={`${2 * Math.PI * 28 * (nextXPIn / 60)}`}
                className="smooth-transition"
              />
              <defs>
                <linearGradient id="xpGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#7FCDBE" />
                  <stop offset="100%" stopColor="#7FB3CD" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-xs font-bold" style={{ color: '#7FCDBE' }}>{nextXPIn}s</span>
              <span className="text-xs opacity-50" style={{ fontSize: '9px' }}>next XP</span>
            </div>
          </div>

          <div className="text-left">
            <div
              className={`text-2xl font-bold smooth-transition ${liveXPFlash ? 'animate-pulse-soft' : ''}`}
              style={{ color: '#7FCDBE', fontFamily: 'Quicksand, sans-serif' }}
            >
              +{sessionXP} XP
            </div>
            <div className="text-xs opacity-50">{minutesElapsed} min · {xpPerMinute} XP/min</div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex gap-3">
          {!isRunning ? (
            <button
              onClick={startSession}
              className="flex-1 py-3.5 rounded-2xl font-bold text-white text-base smooth-transition active:scale-95"
              style={{
                background: 'linear-gradient(135deg, #7FCDBE, #7FB3CD)',
                boxShadow: '0 4px 15px rgba(127,205,190,0.4)',
                fontFamily: 'Quicksand, sans-serif',
              }}
            >
              ▶ Start Session
            </button>
          ) : (
            <button
              onClick={stopSession}
              className="flex-1 py-3.5 rounded-2xl font-bold text-white text-base smooth-transition active:scale-95"
              style={{
                background: 'linear-gradient(135deg, #F4A7C3, #C9A7F4)',
                boxShadow: '0 4px 15px rgba(244,167,195,0.4)',
                fontFamily: 'Quicksand, sans-serif',
              }}
            >
              ⏹ Stop & Save
            </button>
          )}

          {!isRunning && elapsedSeconds > 0 && (
            <button
              onClick={resetSession}
              className="px-4 py-3.5 rounded-2xl font-semibold text-sm smooth-transition active:scale-95"
              style={{
                background: 'rgba(127,205,190,0.15)',
                color: '#7FCDBE',
                border: '1px solid rgba(127,205,190,0.3)',
              }}
            >
              🔄 Reset
            </button>
          )}
        </div>

        {isRunning && (
          <p
            className="mt-3 text-xs opacity-50 animate-pulse-soft"
            style={{ fontFamily: 'Nunito, sans-serif' }}
          >
            ⚡ Earning XP every minute you job hunt...
          </p>
        )}
      </div>

      {/* Session Stats */}
      {sessionCount > 0 && (
        <div
          className="rounded-3xl p-5 soft-shadow-mint animate-slide-up"
          style={{ background: 'rgba(240,250,248,0.9)', border: '1px solid rgba(127,205,190,0.3)' }}
        >
          <h3
            className="font-bold mb-3 flex items-center gap-2"
            style={{ color: '#7FCDBE', fontFamily: 'Quicksand, sans-serif' }}
          >
            📊 Session Stats
          </h3>
          <div className="grid grid-cols-3 gap-3">
            <div className="text-center p-3 rounded-2xl" style={{ background: 'rgba(127,205,190,0.1)' }}>
              <div className="text-xl font-bold" style={{ color: '#7FCDBE' }}>{sessionCount}</div>
              <div className="text-xs opacity-50">Sessions</div>
            </div>
            <div className="text-center p-3 rounded-2xl" style={{ background: 'rgba(127,179,205,0.1)' }}>
              <div className="text-xl font-bold" style={{ color: '#7FB3CD' }}>{minutesElapsed}m</div>
              <div className="text-xs opacity-50">This Session</div>
            </div>
            <div className="text-center p-3 rounded-2xl" style={{ background: 'rgba(127,205,190,0.1)' }}>
              <div className="text-xl font-bold" style={{ color: '#7FCDBE' }}>+{sessionXP}</div>
              <div className="text-xs opacity-50">XP Earned</div>
            </div>
          </div>
        </div>
      )}

      {/* Tips */}
      <div
        className="rounded-3xl p-4 soft-shadow-mint"
        style={{ background: 'rgba(240,250,248,0.85)', border: '1px solid rgba(127,205,190,0.2)' }}
      >
        <h3
          className="font-bold text-sm mb-2 flex items-center gap-1"
          style={{ color: '#7FB3CD', fontFamily: 'Quicksand, sans-serif' }}
        >
          💡 Job Hunt Tips
        </h3>
        <div className="space-y-1">
          {[
            '🔍 Tailor your resume for each application',
            '📧 Follow up within 5-7 business days',
            '🤝 Networking accounts for 70% of job placements',
            '⭐ Apply to reach, match, and safety companies',
            '📝 Track all applications in a spreadsheet',
          ].map((tip, i) => (
            <p key={i} className="text-xs opacity-60 leading-relaxed" style={{ fontFamily: 'Nunito, sans-serif' }}>
              {tip}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}
