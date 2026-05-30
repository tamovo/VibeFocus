export type AppMode = 'art' | 'job';

export interface Course {
  id: string;
  name: string;
  totalExpectedTime: number; // minutes
  targetSessionTime: number; // minutes
}

export interface Plant {
  id: string;
  name: string;
  emoji: string;
  rarity: 'common' | 'rare' | 'legendary';
  color: string;
  description: string;
  isCustom?: boolean;
  customImageUrl?: string;
  unlockedAt?: number;
}

export interface CafeItem {
  id: string;
  name: string;
  emoji: string;
  cost: number;
  description: string;
  category: 'drink' | 'snack' | 'decor' | 'study';
  unlocked: boolean;
}

export interface SessionHistory {
  id: string;
  date: string;
  duration: number; // minutes
  xpEarned: number;
  mode: AppMode;
  courseName?: string;
}

export interface AppState {
  mode: AppMode;
  xp: number;
  totalXp: number;
  courses: Course[];
  unlockedPlants: string[];
  unlockedCafeItems: string[];
  sessionHistory: SessionHistory[];
  customPlants: Plant[];
  currentTrackIndex: number;
  volume: number;
}

export interface RadioTheme {
  id: string;
  name: string;
  emoji: string;
  description: string;
  streamUrl: string;
  mood: string;
}
