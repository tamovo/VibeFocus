import { useLocalStorage } from './useLocalStorage';
import type { AppState } from '../types';
import { CAFE_ITEMS } from '../data/cafeItems';

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
};

export function useAppState() {
  const [state, setState] = useLocalStorage<AppState>('vibefocus_state', DEFAULT_STATE);

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
  };
}
