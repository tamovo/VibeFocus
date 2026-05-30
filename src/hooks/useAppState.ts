import { useEffect, useRef, useState } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { useAuth } from '../contexts/AuthContext';
import type { AppState, CharacterCustomization } from '../types';
import { CAFE_ITEMS } from '../data/cafeItems';

export type SyncStatus = 'idle' | 'loading' | 'saving' | 'saved' | 'error';
export type SyncTarget = 'unknown' | 'local' | 'cloud';

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
  const { user } = useAuth();
  const [rawState, setState] = useLocalStorage<AppState>('vibefocus_state', DEFAULT_STATE);

  const state: AppState = {
    ...DEFAULT_STATE,
    ...rawState,
    characterCustomization: {
      ...DEFAULT_STATE.characterCustomization,
      ...rawState.characterCustomization,
    },
  };

  const tokenRef = useRef<string | undefined>(user?.idToken);
  const skipNextSave = useRef(false);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const [syncStatus, setSyncStatus] = useState<SyncStatus>('idle');
  const [syncTarget, setSyncTarget] = useState<SyncTarget>('unknown');

  useEffect(() => {
    tokenRef.current = user?.idToken;
  }, [user?.idToken]);

  // Load from D1 when user signs in
  useEffect(() => {
    if (!user) {
      setSyncTarget('local');
      setSyncStatus('idle');
      return;
    }
    setSyncStatus('loading');
    fetch('/api/settings', {
      headers: { 'Authorization': `Bearer ${user.idToken}` },
    })
      .then(r => {
        if (r.status === 503) { setSyncTarget('local'); setSyncStatus('idle'); return null; }
        setSyncTarget('cloud');
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
      .catch(() => { setSyncTarget('local'); setSyncStatus('idle'); });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.sub]);

  // Save to D1 (debounced 2s)
  useEffect(() => {
    if (skipNextSave.current) { skipNextSave.current = false; return; }
    if (!tokenRef.current) return;
    clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      const token = tokenRef.current;
      if (!token) return;
      setSyncStatus('saving');
      fetch('/api/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ settings: rawState }),
      })
        .then(r => {
          if (r.status === 503) { setSyncTarget('local'); setSyncStatus('idle'); return; }
          if (r.ok) {
            setSyncTarget('cloud');
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
    setState(prev => ({ ...prev, xp: prev.xp + amount, totalXp: prev.totalXp + amount }));
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
      unlockedPlants: prev.unlockedPlants.includes(plantId) ? prev.unlockedPlants : [...prev.unlockedPlants, plantId],
    }));
  };

  const unlockCafeItem = (itemId: string) => {
    setState(prev => ({
      ...prev,
      unlockedCafeItems: prev.unlockedCafeItems.includes(itemId) ? prev.unlockedCafeItems : [...prev.unlockedCafeItems, itemId],
    }));
  };

  const addCustomPlant = (plant: AppState['customPlants'][0]) => {
    setState(prev => ({
      ...prev,
      customPlants: [...prev.customPlants, plant],
      unlockedPlants: [...prev.unlockedPlants, plant.id],
    }));
  };

  const removeCustomPlant = (plantId: string) => {
    setState(prev => ({
      ...prev,
      customPlants: prev.customPlants.filter(p => p.id !== plantId),
      unlockedPlants: prev.unlockedPlants.filter(id => id !== plantId),
    }));
  };

  const renameCustomPlant = (plantId: string, name: string) => {
    setState(prev => ({
      ...prev,
      customPlants: prev.customPlants.map(p => p.id === plantId ? { ...p, name } : p),
    }));
  };

  const addSession = (session: AppState['sessionHistory'][0]) => {
    setState(prev => ({ ...prev, sessionHistory: [session, ...prev.sessionHistory].slice(0, 50) }));
  };

  const setTrackIndex = (index: number) => {
    setState(prev => ({ ...prev, currentTrackIndex: index }));
  };

  const setVolume = (volume: number) => {
    setState(prev => ({ ...prev, volume }));
  };

  const setCharacterCustomization = (mode: AppState['mode'], customization: CharacterCustomization) => {
    setState(prev => ({ ...prev, characterCustomization: { ...prev.characterCustomization, [mode]: customization } }));
  };

  const getCafeItems = () => {
    return CAFE_ITEMS.map(item => ({ ...item, unlocked: state.unlockedCafeItems.includes(item.id) }));
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
    removeCustomPlant,
    renameCustomPlant,
    addSession,
    setTrackIndex,
    setVolume,
    getCafeItems,
    setCharacterCustomization,
    syncStatus,
    syncTarget,
  };
}
