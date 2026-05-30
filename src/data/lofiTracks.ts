import type { RadioTheme } from '../types';

// SomaFM — free internet radio, CC-licensed, infinite streams, no API key needed.
// All streams are Icecast (CORS-friendly) and available at ice1/ice2/ice3.somafm.com.
export const RADIO_THEMES: RadioTheme[] = [
  {
    id: 'groovesalad',
    name: 'Groove Salad',
    emoji: '🥗',
    description: 'Ambient · Electronica',
    streamUrl: 'https://ice1.somafm.com/groovesalad-128-mp3',
    mood: 'focus',
  },
  {
    id: 'jazz',
    name: 'Jazz Universe',
    emoji: '🎷',
    description: 'Nu Jazz · Fusion',
    streamUrl: 'https://ice1.somafm.com/sonicuniverse-128-mp3',
    mood: 'vibey',
  },
  {
    id: 'fluid',
    name: 'Fluid',
    emoji: '🌊',
    description: 'Liquid Jazz · Chill',
    streamUrl: 'https://ice1.somafm.com/fluid-128-mp3',
    mood: 'calm',
  },
  {
    id: 'lush',
    name: 'Lush',
    emoji: '🌿',
    description: 'Indie · Dream Pop',
    streamUrl: 'https://ice1.somafm.com/lush-128-mp3',
    mood: 'dreamy',
  },
  {
    id: 'drone',
    name: 'Drone Zone',
    emoji: '🌌',
    description: 'Deep Ambient · Drone',
    streamUrl: 'https://ice1.somafm.com/dronezone-128-mp3',
    mood: 'deep',
  },
  {
    id: 'beats',
    name: 'Beat Blender',
    emoji: '🎧',
    description: 'Electronic Beats',
    streamUrl: 'https://ice1.somafm.com/beatblender-128-mp3',
    mood: 'energy',
  },
];
