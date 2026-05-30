import { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import type { Course, Plant } from '../types';

interface ArtModeProps {
  courses: Course[];
  onAddCourse: (course: Course) => void;
  onRemoveCourse: (id: string) => void;
  onEarnXP: (amount: number) => void;
  xp: number;
}

type TimerState = 'idle' | 'running' | 'finished';

export default function ArtMode({ courses, onAddCourse, onRemoveCourse, onEarnXP, xp }: ArtModeProps) {
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [timerState, setTimerState] = useState<TimerState>('idle');
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [sessionStart, setSessionStart] = useState<number | null>(null);
  const [tooFastLocked, setTooFastLocked] = useState(false);
  const [tooFastMsg, setTooFastMsg] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newCourseName, setNewCourseName] = useState('');
  const [newTotalTime, setNewTotalTime] = useState('');
  const [newSessionTime, setNewSessionTime] = useState('');
  const [justFinished, setJustFinished] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const resultCardRef = useRef<HTMLDivElement | null>(null);

  // Clear interval on unmount
  useEffect(() => {
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, []);

  const selectRandom = () => {
    if (courses.length === 0) return;
    const random = courses[Math.floor(Math.random() * courses.length)];
    setSelectedCourse(random);
    setTimerState('idle');
    setSecondsLeft(random.targetSessionTime * 60);
    setSessionStart(null);
    setTooFastLocked(false);
    setTooFastMsg(false);
    setJustFinished(false);
    if (intervalRef.current) clearInterval(intervalRef.current);
    setTimeout(() => resultCardRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 50);
  };

  const startTimer = () => {
    if (!selectedCourse || timerState === 'running') return;
    const now = Date.now();
    setSessionStart(now);
    setTimerState('running');
    setTooFastLocked(true);
    setTooFastMsg(false);

    // Lock "I Finished It!" for first 60 seconds
    setTimeout(() => setTooFastLocked(false), 60000);

    intervalRef.current = setInterval(() => {
      setSecondsLeft(prev => {
        if (prev <= 1) {
          clearInterval(intervalRef.current!);
          setTimerState('finished');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const pauseTimer = () => {
    if (timerState !== 'running') return;
    setTimerState('idle');
    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  const handleFinished = () => {
    if (tooFastLocked) {
      setTooFastMsg(true);
      return;
    }
    if (timerState === 'idle' && !sessionStart) return;

    // Complete session
    if (intervalRef.current) clearInterval(intervalRef.current);
    setTimerState('finished');
    setJustFinished(true);
    onEarnXP(100);

    // Confetti burst!
    const canvas = document.getElementById('confetti-canvas') as HTMLCanvasElement | null;
    const myConfetti = canvas
      ? confetti.create(canvas, { resize: true })
      : confetti;

    myConfetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.6 },
      colors: ['#F4A7C3', '#C9A7F4', '#A7C4F4', '#FFD700', '#FFB3D9', '#E8D5F5'],
      scalar: 1.1,
    });
    setTimeout(() => {
      myConfetti({
        particleCount: 60,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.6 },
        colors: ['#F4A7C3', '#C9A7F4', '#FFD700'],
      });
      myConfetti({
        particleCount: 60,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.6 },
        colors: ['#F4A7C3', '#C9A7F4', '#FFD700'],
      });
    }, 200);
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const getTimerColor = () => {
    if (timerState === 'finished') return '#FFD700';
    if (secondsLeft <= 30 && timerState === 'running') return '#F4A7C3';
    return '#C9A7F4';
  };

  const handleAddCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCourseName.trim()) return;
    onAddCourse({
      id: `course_${Date.now()}`,
      name: newCourseName.trim(),
      totalExpectedTime: parseInt(newTotalTime) || 60,
      targetSessionTime: parseInt(newSessionTime) || 25,
    });
    setNewCourseName('');
    setNewTotalTime('');
    setNewSessionTime('');
    setShowAddForm(false);
  };

  return (
    <div className="space-y-5 animate-slide-up">
      {/* What Should I Do? */}
      <div
        className="rounded-3xl p-5 soft-shadow"
        style={{ background: 'rgba(255,245,250,0.9)', border: '1px solid rgba(244,167,195,0.3)' }}
      >
        <h2
          className="text-lg font-bold mb-4 flex items-center gap-2"
          style={{ color: '#C9A7F4', fontFamily: 'Quicksand, sans-serif' }}
        >
          🎲 Session Picker
        </h2>

        <button
          onClick={selectRandom}
          disabled={courses.length === 0}
          className="w-full py-3 rounded-2xl font-bold text-white smooth-transition active:scale-95"
          style={{
            background: courses.length === 0 ? 'rgba(201,167,244,0.3)' : 'linear-gradient(135deg, #F4A7C3, #C9A7F4)',
            boxShadow: courses.length === 0 ? 'none' : '0 4px 15px rgba(201,167,244,0.4)',
            fontFamily: 'Quicksand, sans-serif',
            fontSize: '1rem',
            cursor: courses.length === 0 ? 'not-allowed' : 'pointer',
          }}
        >
          ✨ What Should I Do?
        </button>
        {courses.length === 0 && (
          <p className="text-center text-xs mt-2 opacity-50" style={{ color: '#C9A7F4', fontFamily: 'Nunito' }}>
            👇 Add a course below to get started!
          </p>
        )}

        {/* Selected Course Display */}
        {selectedCourse && (
          <div
            ref={resultCardRef}
            className="mt-4 p-4 rounded-2xl"
            style={{
              background: 'linear-gradient(135deg, rgba(244,167,195,0.15), rgba(201,167,244,0.15))',
              border: '1px solid rgba(201,167,244,0.3)',
            }}
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="text-xs opacity-50 mb-1" style={{ fontFamily: 'Nunito, sans-serif' }}>Today's practice:</p>
                <h3
                  className="text-lg font-bold"
                  style={{ color: '#8B5CF6', fontFamily: 'Quicksand, sans-serif' }}
                >
                  {selectedCourse.name}
                </h3>
                <p className="text-xs mt-1 opacity-60">
                  🎯 Session: {selectedCourse.targetSessionTime} min
                  {' '}· Total goal: {selectedCourse.totalExpectedTime} min
                </p>
              </div>
              {justFinished && (
                <div
                  className="flex flex-col items-center animate-bounce-in"
                  style={{ color: '#FFD700' }}
                >
                  <span className="text-3xl">🏆</span>
                  <span className="text-xs font-bold">+100 XP!</span>
                </div>
              )}
            </div>

            {/* Timer Display */}
            <div className="flex items-center justify-center my-3">
              <div
                className="text-5xl font-mono font-bold smooth-transition"
                style={{
                  color: getTimerColor(),
                  textShadow: `0 0 20px ${getTimerColor()}60`,
                  fontFamily: 'Quicksand, sans-serif',
                  letterSpacing: '0.05em',
                }}
              >
                {timerState === 'idle' && !sessionStart
                  ? formatTime(selectedCourse.targetSessionTime * 60)
                  : formatTime(secondsLeft)}
              </div>
            </div>

            {timerState === 'finished' ? (
              <div className="text-center">
                <p className="text-sm font-semibold mb-2" style={{ color: '#FFD700' }}>
                  🌟 Session complete! Amazing work~
                </p>
                <button
                  onClick={selectRandom}
                  className="px-4 py-2 rounded-xl text-sm font-semibold text-white smooth-transition"
                  style={{ background: 'linear-gradient(135deg, #F4A7C3, #C9A7F4)' }}
                >
                  Next Session ✨
                </button>
              </div>
            ) : (
              <div className="flex gap-2">
                {timerState === 'idle' ? (
                  <button
                    onClick={startTimer}
                    className="flex-1 py-2.5 rounded-xl font-bold text-white text-sm smooth-transition active:scale-95"
                    style={{
                      background: 'linear-gradient(135deg, #F4A7C3, #C9A7F4)',
                      boxShadow: '0 3px 10px rgba(201,167,244,0.3)',
                    }}
                  >
                    ▶ Start Session
                  </button>
                ) : (
                  <button
                    onClick={pauseTimer}
                    className="flex-1 py-2.5 rounded-xl font-bold text-white text-sm smooth-transition active:scale-95"
                    style={{ background: 'rgba(201,167,244,0.5)' }}
                  >
                    ⏸ Pause
                  </button>
                )}

                <div className="relative flex-1">
                  <button
                    onClick={handleFinished}
                    disabled={timerState === 'idle' && !sessionStart}
                    className="w-full py-2.5 rounded-xl font-bold text-white text-sm smooth-transition active:scale-95 disabled:opacity-40"
                    style={{
                      background: tooFastLocked
                        ? 'rgba(200,180,200,0.5)'
                        : 'linear-gradient(135deg, #A7C4F4, #C9A7F4)',
                      cursor: tooFastLocked ? 'not-allowed' : 'pointer',
                    }}
                  >
                    {tooFastLocked ? '🔒 Wait...' : '🎉 I Finished It!'}
                  </button>
                  {tooFastMsg && (
                    <p
                      className="absolute -bottom-6 left-0 right-0 text-center text-xs animate-slide-up"
                      style={{ color: 'rgba(255,255,255,0.8)', fontSize: '10px' }}
                    >
                      A bit too fast! It's not possible to finish yet, please continue your practice~
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Course Manager */}
      <div
        className="rounded-3xl p-5 soft-shadow"
        style={{ background: 'rgba(255,245,250,0.9)', border: '1px solid rgba(244,167,195,0.3)' }}
      >
        <div className="flex items-center justify-between mb-4">
          <h2
            className="text-lg font-bold flex items-center gap-2"
            style={{ color: '#C9A7F4', fontFamily: 'Quicksand, sans-serif' }}
          >
            📚 My Courses
          </h2>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="text-sm px-3 py-1.5 rounded-xl font-semibold smooth-transition active:scale-95"
            style={{
              background: showAddForm ? 'rgba(244,167,195,0.3)' : 'linear-gradient(135deg, #F4A7C3, #C9A7F4)',
              color: showAddForm ? '#C9A7F4' : 'white',
            }}
          >
            {showAddForm ? '✕ Cancel' : '+ Add'}
          </button>
        </div>

        {showAddForm && (
          <form onSubmit={handleAddCourse} className="mb-4 p-4 rounded-2xl animate-slide-up space-y-3"
            style={{ background: 'rgba(244,167,195,0.1)', border: '1px dashed rgba(201,167,244,0.4)' }}>
            <input
              type="text"
              placeholder="Course name (e.g. Character Proportions)"
              value={newCourseName}
              onChange={e => setNewCourseName(e.target.value)}
              className="w-full px-3 py-2 rounded-xl text-sm outline-none"
              style={{
                background: 'rgba(255,255,255,0.8)',
                border: '1px solid rgba(201,167,244,0.3)',
                color: '#6B5B8A',
                fontFamily: 'Nunito, sans-serif',
              }}
            />
            <div className="flex gap-2">
              <input
                type="number"
                placeholder="Total time (min)"
                value={newTotalTime}
                onChange={e => setNewTotalTime(e.target.value)}
                className="flex-1 px-3 py-2 rounded-xl text-sm outline-none"
                style={{
                  background: 'rgba(255,255,255,0.8)',
                  border: '1px solid rgba(201,167,244,0.3)',
                  color: '#6B5B8A',
                }}
              />
              <input
                type="number"
                placeholder="Session time (min)"
                value={newSessionTime}
                onChange={e => setNewSessionTime(e.target.value)}
                className="flex-1 px-3 py-2 rounded-xl text-sm outline-none"
                style={{
                  background: 'rgba(255,255,255,0.8)',
                  border: '1px solid rgba(201,167,244,0.3)',
                  color: '#6B5B8A',
                }}
              />
            </div>
            <button
              type="submit"
              className="w-full py-2 rounded-xl text-sm font-bold text-white"
              style={{ background: 'linear-gradient(135deg, #F4A7C3, #C9A7F4)' }}
            >
              Add Course ✨
            </button>
          </form>
        )}

        <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
          {courses.length === 0 ? (
            <p className="text-center text-sm opacity-40 py-4" style={{ fontFamily: 'Quicksand, sans-serif' }}>
              No courses yet~ Add one above! 🎨
            </p>
          ) : (
            courses.map(course => (
              <div
                key={course.id}
                className="flex items-center justify-between p-3 rounded-2xl smooth-transition"
                style={{
                  background: selectedCourse?.id === course.id
                    ? 'rgba(201,167,244,0.2)'
                    : 'rgba(255,255,255,0.5)',
                  border: selectedCourse?.id === course.id
                    ? '1px solid rgba(201,167,244,0.5)'
                    : '1px solid transparent',
                }}
              >
                <div>
                  <p className="font-semibold text-sm" style={{ color: '#8B5CF6' }}>{course.name}</p>
                  <p className="text-xs opacity-50">⏱ {course.targetSessionTime}min session · 🎯 {course.totalExpectedTime}min total</p>
                </div>
                <button
                  onClick={() => onRemoveCourse(course.id)}
                  className="text-xs px-2 py-1 rounded-lg opacity-40 hover:opacity-70 smooth-transition"
                  style={{ color: '#F4A7C3' }}
                >
                  ✕
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
