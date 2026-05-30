import { useState, useCallback } from 'react';
import { useAppState } from './hooks/useAppState';
import ModeToggle from './components/ModeToggle';
import XPBar from './components/XPBar';
import Avatar from './components/ArtAvatar';
import ArtMode from './components/ArtMode';
import JobMode from './components/JobMode';
import PlantShelf from './components/PlantShelf';
import CafeShop from './components/CafeShop';
import LofiPlayer from './components/LofiPlayer';
import FloatingXP from './components/FloatingXP';
import type { SessionHistory } from './types';

export default function App() {
  const {
    state,
    addXP,
    spendXP,
    setMode,
    addCourse,
    removeCourse,
    unlockPlant,
    unlockCafeItem,
    addCustomPlant,
    addSession,
    setTrackIndex,
    setVolume,
    getCafeItems,
  } = useAppState();

  const [activePanel, setActivePanel] = useState<'main' | 'shop' | 'history'>('main');
  const [isSessionActive, setIsSessionActive] = useState(false);

  const handleEarnXP = useCallback((amount: number) => {
    addXP(amount);
  }, [addXP]);

  const handleSpendXP = useCallback((amount: number): boolean => {
    return spendXP(amount);
  }, [spendXP]);

  const handleUnlockCafeItem = useCallback((itemId: string, cost: number) => {
    if (spendXP(cost)) {
      unlockCafeItem(itemId);
    }
  }, [spendXP, unlockCafeItem]);

  const handleSessionEnd = useCallback((durationMinutes: number, xpEarned: number) => {
    const session: SessionHistory = {
      id: `session_${Date.now()}`,
      date: new Date().toISOString(),
      duration: durationMinutes,
      xpEarned,
      mode: state.mode,
    };
    addSession(session);
    setIsSessionActive(false);
  }, [addSession, state.mode]);

  const isArt = state.mode === 'art';

  // Background gradients per mode
  const bgStyle = {
    background: isArt
      ? 'linear-gradient(135deg, #FFF0F8 0%, #FAF0FF 30%, #F0F8FF 60%, #FFF8F0 100%)'
      : 'linear-gradient(135deg, #F0FFFC 0%, #F0F8FF 30%, #EEF8F0 60%, #F0FCFF 100%)',
    minHeight: '100vh',
    transition: 'background 0.6s ease',
  };

  const accentColor = isArt ? '#C9A7F4' : '#7FCDBE';
  const accentColor2 = isArt ? '#F4A7C3' : '#7FB3CD';

  // Decorative background blobs
  const BgBlobs = () => (
    <div className="fixed inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 0 }}>
      <div
        className="absolute rounded-full blur-3xl opacity-25"
        style={{
          width: '300px', height: '300px',
          top: '-50px', right: '-50px',
          background: isArt
            ? 'radial-gradient(circle, #F4A7C3, #C9A7F4)'
            : 'radial-gradient(circle, #7FCDBE, #7FB3CD)',
        }}
      />
      <div
        className="absolute rounded-full blur-3xl opacity-20"
        style={{
          width: '250px', height: '250px',
          bottom: '100px', left: '-30px',
          background: isArt
            ? 'radial-gradient(circle, #C9A7F4, #A7C4F4)'
            : 'radial-gradient(circle, #7FA7F4, #7FCDBE)',
        }}
      />
      <div
        className="absolute rounded-full blur-3xl opacity-15"
        style={{
          width: '200px', height: '200px',
          top: '40%', left: '40%',
          background: isArt ? 'radial-gradient(circle, #FFD6E7, #E8D5F5)' : 'radial-gradient(circle, #C8F0E8, #C8E8F5)',
        }}
      />
    </div>
  );

  return (
    <div style={bgStyle}>
      <BgBlobs />

      {/* Confetti canvas */}
      <canvas id="confetti-canvas" style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 9999 }} />

      {/* Floating XP Popups */}
      <FloatingXP mode={state.mode} xp={state.xp} />

      <div className="relative" style={{ zIndex: 1 }}>
        {/* ── HEADER ── */}
        <header
          className="sticky top-0 z-50 px-4 py-3"
          style={{
            background: isArt
              ? 'rgba(255,240,250,0.85)'
              : 'rgba(240,252,250,0.85)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            borderBottom: `1px solid ${accentColor}25`,
          }}
        >
          {/* Title Row */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="text-2xl animate-float inline-block">
                {isArt ? '🎨' : '💼'}
              </span>
              <div>
                <h1
                  className="text-xl font-extrabold leading-tight"
                  style={{
                    background: `linear-gradient(135deg, ${accentColor2}, ${accentColor})`,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    fontFamily: 'Quicksand, sans-serif',
                  }}
                >
                  VibeFocus
                </h1>
                <p className="text-xs opacity-50 leading-none" style={{ fontFamily: 'Nunito' }}>
                  {isArt ? 'Art School Mode ✨' : 'Job Hunt Mode 💪'}
                </p>
              </div>
            </div>

            {/* XP Badge */}
            <div
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full"
              style={{
                background: `linear-gradient(135deg, ${accentColor2}20, ${accentColor}20)`,
                border: `1px solid ${accentColor}30`,
              }}
            >
              <span className="text-sm">⭐</span>
              <span
                className="font-bold text-sm"
                style={{ color: accentColor, fontFamily: 'Quicksand, sans-serif' }}
              >
                {state.xp.toLocaleString()} XP
              </span>
            </div>
          </div>

          {/* Mode Toggle */}
          <ModeToggle mode={state.mode} onToggle={setMode} />
        </header>

        {/* ── MAIN LAYOUT ── */}
        <main className="max-w-6xl mx-auto px-4 py-5">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

            {/* ── LEFT SIDEBAR ── */}
            <div className="space-y-5">
              {/* Avatar */}
              <div
                className="rounded-3xl p-5 flex flex-col items-center gap-4 soft-shadow"
                style={{
                  background: isArt ? 'rgba(255,240,250,0.9)' : 'rgba(240,250,248,0.9)',
                  border: `1px solid ${accentColor}25`,
                }}
              >
                <Avatar mode={state.mode} isSessionActive={isSessionActive} />
                <XPBar xp={state.xp} totalXp={state.totalXp} mode={state.mode} />
              </div>

              {/* Lo-Fi Player */}
              <LofiPlayer
                mode={state.mode}
                currentTrackIndex={state.currentTrackIndex}
                volume={state.volume}
                onTrackChange={setTrackIndex}
                onVolumeChange={setVolume}
              />

              {/* Session History */}
              <div
                className="rounded-3xl p-4 soft-shadow"
                style={{
                  background: isArt ? 'rgba(255,240,250,0.85)' : 'rgba(240,250,248,0.85)',
                  border: `1px solid ${accentColor}20`,
                }}
              >
                <h3
                  className="font-bold text-sm mb-3 flex items-center gap-2"
                  style={{ color: accentColor, fontFamily: 'Quicksand, sans-serif' }}
                >
                  📅 Recent Sessions
                </h3>
                {state.sessionHistory.length === 0 ? (
                  <p className="text-xs text-center opacity-30 py-3" style={{ fontFamily: 'Quicksand' }}>
                    No sessions yet~<br />Start your first one! 🌟
                  </p>
                ) : (
                  <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                    {state.sessionHistory.slice(0, 8).map(session => (
                      <div
                        key={session.id}
                        className="flex items-center justify-between py-1.5 px-2 rounded-xl"
                        style={{ background: 'rgba(255,255,255,0.5)' }}
                      >
                        <div className="flex items-center gap-2">
                          <span>{session.mode === 'art' ? '🎨' : '💼'}</span>
                          <span className="text-xs opacity-60" style={{ fontFamily: 'Nunito' }}>
                            {session.duration}min
                          </span>
                        </div>
                        <span
                          className="text-xs font-bold"
                          style={{ color: accentColor }}
                        >
                          +{session.xpEarned} XP
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* ── CENTER MAIN ── */}
            <div className="lg:col-span-1 space-y-5">
              {/* Panel Tabs */}
              <div
                className="flex gap-1 p-1 rounded-2xl"
                style={{ background: 'rgba(255,255,255,0.5)', border: `1px solid ${accentColor}20` }}
              >
                {(['main', 'shop', 'history'] as const).map(panel => (
                  <button
                    key={panel}
                    onClick={() => setActivePanel(panel)}
                    className="flex-1 py-2 rounded-xl text-xs font-bold smooth-transition"
                    style={{
                      background: activePanel === panel ? 'rgba(255,255,255,0.9)' : 'transparent',
                      color: activePanel === panel ? accentColor : 'rgba(100,80,120,0.5)',
                      boxShadow: activePanel === panel ? '0 2px 8px rgba(0,0,0,0.1)' : 'none',
                      fontFamily: 'Quicksand, sans-serif',
                    }}
                  >
                    {panel === 'main' ? (isArt ? '🎨 Practice' : '💼 Hunt') : panel === 'shop' ? (isArt ? '🌿 Shop' : '☕ Café') : '📊 Stats'}
                  </button>
                ))}
              </div>

              {activePanel === 'main' && (
                <>
                  {isArt ? (
                    <ArtMode
                      courses={state.courses}
                      onAddCourse={addCourse}
                      onRemoveCourse={removeCourse}
                      onEarnXP={handleEarnXP}
                      xp={state.xp}
                    />
                  ) : (
                    <JobMode
                      onEarnXP={handleEarnXP}
                      onSessionEnd={handleSessionEnd}
                      xp={state.xp}
                    />
                  )}
                </>
              )}

              {activePanel === 'shop' && (
                isArt ? (
                  <div
                    className="rounded-3xl p-5 soft-shadow"
                    style={{ background: 'rgba(255,245,250,0.9)', border: `1px solid ${accentColor}25` }}
                  >
                    <PlantShelf
                      mode={state.mode}
                      unlockedPlantIds={state.unlockedPlants}
                      customPlants={state.customPlants}
                      xp={state.xp}
                      onUnlockPlant={unlockPlant}
                      onSpendXP={handleSpendXP}
                      onAddCustomPlant={addCustomPlant}
                    />
                  </div>
                ) : (
                  <div
                    className="rounded-3xl p-5 soft-shadow-mint"
                    style={{ background: 'rgba(240,250,248,0.9)', border: `1px solid ${accentColor}25` }}
                  >
                    <CafeShop
                      mode={state.mode}
                      items={getCafeItems()}
                      xp={state.xp}
                      onUnlock={handleUnlockCafeItem}
                    />
                  </div>
                )
              )}

              {activePanel === 'history' && (
                <div
                  className="rounded-3xl p-5 soft-shadow"
                  style={{
                    background: isArt ? 'rgba(255,245,250,0.9)' : 'rgba(240,250,248,0.9)',
                    border: `1px solid ${accentColor}25`,
                  }}
                >
                  <h2
                    className="text-lg font-bold mb-4 flex items-center gap-2"
                    style={{ color: accentColor, fontFamily: 'Quicksand, sans-serif' }}
                  >
                    📊 Your Journey
                  </h2>

                  {/* Summary Stats */}
                  <div className="grid grid-cols-2 gap-3 mb-5">
                    {[
                      { label: 'Total XP', value: state.totalXp.toLocaleString(), emoji: '⭐', color: accentColor },
                      { label: 'Sessions', value: state.sessionHistory.length, emoji: '🎯', color: accentColor2 },
                      { label: 'Plants', value: state.unlockedPlants.length, emoji: '🌱', color: accentColor },
                      { label: 'Hours', value: `${Math.round(state.sessionHistory.reduce((a, s) => a + s.duration, 0) / 60 * 10) / 10}h`, emoji: '⏱️', color: accentColor2 },
                    ].map(stat => (
                      <div
                        key={stat.label}
                        className="p-3 rounded-2xl text-center"
                        style={{ background: `${stat.color}15`, border: `1px solid ${stat.color}25` }}
                      >
                        <div className="text-xl mb-0.5">{stat.emoji}</div>
                        <div className="text-lg font-bold" style={{ color: stat.color, fontFamily: 'Quicksand' }}>
                          {stat.value}
                        </div>
                        <div className="text-xs opacity-50" style={{ fontFamily: 'Nunito' }}>{stat.label}</div>
                      </div>
                    ))}
                  </div>

                  {/* Full History */}
                  <h3
                    className="font-bold text-sm mb-3"
                    style={{ color: accentColor, fontFamily: 'Quicksand' }}
                  >
                    All Sessions
                  </h3>
                  <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                    {state.sessionHistory.length === 0 ? (
                      <p className="text-center text-sm opacity-30 py-6" style={{ fontFamily: 'Quicksand' }}>
                        No sessions yet~ Keep going! 🌟
                      </p>
                    ) : (
                      state.sessionHistory.map(session => (
                        <div
                          key={session.id}
                          className="flex items-center gap-3 p-3 rounded-2xl"
                          style={{ background: 'rgba(255,255,255,0.6)' }}
                        >
                          <span className="text-lg">{session.mode === 'art' ? '🎨' : '💼'}</span>
                          <div className="flex-1 min-w-0">
                            <p
                              className="text-xs font-semibold truncate"
                              style={{ color: accentColor, fontFamily: 'Quicksand' }}
                            >
                              {session.courseName || (session.mode === 'art' ? 'Art Practice' : 'Job Hunt Session')}
                            </p>
                            <p className="text-xs opacity-40" style={{ fontFamily: 'Nunito' }}>
                              {new Date(session.date).toLocaleDateString('en-US', {
                                month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
                              })}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-bold" style={{ color: accentColor }}>+{session.xpEarned} XP</p>
                            <p className="text-xs opacity-40">{session.duration}min</p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* ── RIGHT SIDEBAR ── */}
            <div className="space-y-5">
              {/* Shop Preview / Plant Shelf (always visible on large screens) */}
              <div
                className="rounded-3xl p-5 soft-shadow"
                style={{
                  background: isArt ? 'rgba(255,245,250,0.9)' : 'rgba(240,250,248,0.9)',
                  border: `1px solid ${accentColor}25`,
                }}
              >
                {isArt ? (
                  <PlantShelf
                    mode={state.mode}
                    unlockedPlantIds={state.unlockedPlants}
                    customPlants={state.customPlants}
                    xp={state.xp}
                    onUnlockPlant={unlockPlant}
                    onSpendXP={handleSpendXP}
                    onAddCustomPlant={addCustomPlant}
                  />
                ) : (
                  <CafeShop
                    mode={state.mode}
                    items={getCafeItems()}
                    xp={state.xp}
                    onUnlock={handleUnlockCafeItem}
                  />
                )}
              </div>

              {/* Motivational Quote */}
              <div
                className="rounded-3xl p-4 text-center soft-shadow"
                style={{
                  background: isArt
                    ? 'linear-gradient(135deg, rgba(244,167,195,0.2), rgba(201,167,244,0.2))'
                    : 'linear-gradient(135deg, rgba(127,205,190,0.2), rgba(127,179,205,0.2))',
                  border: `1px solid ${accentColor}20`,
                }}
              >
                <MotivationalQuote mode={state.mode} />
              </div>
            </div>
          </div>
        </main>

        {/* ── FOOTER ── */}
        <footer
          className="text-center py-4 text-xs opacity-30"
          style={{ fontFamily: 'Nunito, sans-serif' }}
        >
          Made with 💜 · VibeFocus v1.0 · All progress saved locally ✨
        </footer>
      </div>
    </div>
  );
}

// Motivational quotes component
function MotivationalQuote({ mode }: { mode: 'art' | 'job' }) {
  const artQuotes = [
    { text: "Every expert was once a beginner. Keep drawing! ✏️", author: "— Unknown" },
    { text: "Creativity takes courage. One stroke at a time! 🎨", author: "— Henri Matisse" },
    { text: "You don't have to be great to start, but you have to start to be great.", author: "— Zig Ziglar" },
    { text: "Art enables us to find ourselves and lose ourselves at the same time.", author: "— Thomas Merton" },
    { text: "The secret to getting ahead is getting started. Pick up the pencil! ✨", author: "— Mark Twain" },
  ];

  const jobQuotes = [
    { text: "Every rejection is redirection. Your dream job is out there! 💪", author: "— Unknown" },
    { text: "Success is not final, failure is not fatal: it is the courage to continue.", author: "— Winston Churchill" },
    { text: "The best time to plant a tree was 20 years ago. The second best time is now.", author: "— Chinese Proverb" },
    { text: "Opportunities don't happen. You create them. Keep applying! 🚀", author: "— Chris Grosser" },
    { text: "A smooth sea never made a skilled sailor. You've got this! ⚓", author: "— Franklin D. Roosevelt" },
  ];

  const quotes = mode === 'art' ? artQuotes : jobQuotes;
  const [quoteIdx] = useState(() => Math.floor(Math.random() * quotes.length));
  const quote = quotes[quoteIdx];
  const accentColor = mode === 'art' ? '#C9A7F4' : '#7FCDBE';

  return (
    <>
      <p
        className="text-sm font-semibold leading-relaxed mb-2"
        style={{ color: accentColor, fontFamily: 'Quicksand, sans-serif' }}
      >
        "{quote.text}"
      </p>
      <p className="text-xs opacity-50" style={{ fontFamily: 'Nunito' }}>{quote.author}</p>
    </>
  );
}
