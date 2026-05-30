import { useEffect, useRef, useState } from 'react';
import { useLocalStorage } from './useLocalStorage';
import type { AppState, CharacterCustomization } from '../types';
import { CAFE_ITEMS } from '../data/cafeItems';

const USER_ID_KEY = 'vibefocus_user_id';

function getOrCreateUserId(): string {
  let id = localStorage.getItem(USER_ID_KEY);
  if (!id) { id = crypto.randomUUID(); localStorage.setItem(USER_ID_KEY, id); }
  return id;
}

export type SyncStatus = 'idle' | 'loading' | 'saving' | 'saved' | 'error';

const DEFAULT_STATE: AppState = {
  mode: 'art',
  xp: 0,
  totalXp: 0,
  courses: [
    { id: 'default1', name: 'Character Drawing Basics', totalExpectedTime: 120, targetSessionTime: 25 },
    { id: 'default2', name: 'Color Theory', totalExpectedTime: 60, targetSessionTime: 20 },
    { id: 'default3', name: 'Gesture Drawing', totalExpectedTime: 90, targetSessionTime: 15 },
  ],
  unlockedPlants: [],
  unlockedCafeItems: [],
  sessionHistory: [],
  customPlants: [],
  currentTrackIndex: 0,
  volume: 70,
  characterCustomization: {
    art: { name: 'Yuki', hairColor: '#8B4B6B', eyeColor: '#6B21A8', skinColor: '#FFD8C8', outfitColor: '#C9A7F4', accentColor: '#FF69B4' },
    job: { name: 'Hiro', hairColor: '#4A6B8B', eyeColor: '#1E40AF', skinColor: '#FFD8C8', outfitColor: '#7FB3CD', accentColor: '#FFB3C6' },
  },
};

export function useAppState() {
  const [rawState, setState] = useLocalStorage<AppState>('vibefocus_state', DEFAULT_STATE);

  // Merge with defaults so newly added fields don't crash on existing stored states
  const state: AppState = {
    ...DEFAULT_STATE,
    ...rawState,
    characterCustomization: {
      ...DEFAULT_STATE.characterCustomization,
      ...rawState.characterCustomization,
    },
  };

  const userId = useRef(getOrCreateUserId());
  const skipNextSave = useRef(false);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const [syncStatus, setSyncStatus] = useState<SyncStatus>('idle');

  // Load from D1 on mount
  useEffect(() => {
    setSyncStatus('loading');
    fetch(`/api/settings?user_id=${userId.current}`)
      .then(r => {
        if (r.status === 503) { setSyncStatus('idle'); return null; } // D1 not bound — silent
        return r.ok ? r.json() : null;
      })
      .then((data: { settings: AppState } | null) => {
        if (data?.settings) {
          skipNextSave.current = true;
          setState({
            ...DEFAULT_STATE,
            ...data.settings,
            characterCustomization: {
              ...DEFAULT_STATE.characterCustomization,
              ...data.settings.characterCustomization,
            },
          });
        }
        setSyncStatus('idle');
      })
      .catch(() => setSyncStatus('idle'));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Save to D1 (debounced 2s, skips the setState triggered by the load above)
  useEffect(() => {
    if (skipNextSave.current) { skipNextSave.current = false; return; }
    clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      setSyncStatus('saving');
      fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: userId.current, settings: rawState }),
      })
        .then(r => {
          if (r.status === 503) { setSyncStatus('idle'); return; } // D1 not bound — silent
          if (r.ok) {
            setSyncStatus('saved');
            setTimeout(() => setSyncStatus('idle'), 3000);
          } else {
            setSyncStatus('error');
          }
        })
        .catch(() => setSyncStatus('error'));
    }, 2000);
    return () => clearTimeout(saveTimer.current);
  }, [rawState]);

  const addXP = (amount: number) => {
    setState(prev => ({
      ...prev,
      xp: prev.xp + amount,
      totalXp: prev.totalXp + amount,
    }));
  };

  const spendXP = (amount: number): boolean => {
    if (state.xp < amount) return false;
    setState(prev => ({ ...prev, xp: prev.xp - amount }));
    return true;
  };

  const setMode = (mode: AppState['mode']) => {
    setState(prev => ({ ...prev, mode }));
  };

  const addCourse = (course: AppState['courses'][0]) => {
    setState(prev => ({ ...prev, courses: [...prev.courses, course] }));
  };

  const removeCourse = (id: string) => {
    setState(prev => ({ ...prev, courses: prev.courses.filter(c => c.id !== id) }));
  };

  const unlockPlant = (plantId: string) => {
    setState(prev => ({
      ...prev,
      unlockedPlants: prev.unlockedPlants.includes(plantId)
        ? prev.unlockedPlants
        : [...prev.unlockedPlants, plantId],
    }));
  };

  const unlockCafeItem = (itemId: string) => {
    setState(prev => ({
      ...prev,
      unlockedCafeItems: prev.unlockedCafeItems.includes(itemId)
        ? prev.unlockedCafeItems
        : [...prev.unlockedCafeItems, itemId],
    }));
  };

  const addCustomPlant = (plant: AppState['customPlants'][0]) => {
    setState(prev => ({
      ...prev,
      customPlants: [...prev.customPlants, plant],
      unlockedPlants: [...prev.unlockedPlants, plant.id],
    }));
  };

  const addSession = (session: AppState['sessionHistory'][0]) => {
    setState(prev => ({
      ...prev,
      sessionHistory: [session, ...prev.sessionHistory].slice(0, 50),
    }));
  };

  const setTrackIndex = (index: number) => {
    setState(prev => ({ ...prev, currentTrackIndex: index }));
  };

  const setVolume = (volume: number) => {
    setState(prev => ({ ...prev, volume }));
  };

  const setCharacterCustomization = (mode: AppState['mode'], customization: CharacterCustomization) => {
    setState(prev => ({
      ...prev,
      characterCustomization: { ...prev.characterCustomization, [mode]: customization },
    }));
  };

  // Get all cafe items merged with unlock state
  const getCafeItems = () => {
    return CAFE_ITEMS.map(item => ({
      ...item,
      unlocked: state.unlockedCafeItems.includes(item.id),
    }));
  };

  return {
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
    setCharacterCustomization,
    syncStatus,
    userId: userId.current,
  };
}
