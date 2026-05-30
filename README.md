# 🎨 VibeFocus

> A cozy, gamified productivity app with pastel aesthetics, lo-fi music, and plant gacha!

## ✨ Features

### 🎨 Art School Mode
- **Session Picker** — Click "What Should I Do?" to get a randomly selected course + countdown timer
- **Anti-Cheat Lock** — "I Finished It!" is locked for the first 60 seconds with a gentle reminder
- **Confetti + 100 XP** — Every completed session triggers a canvas-confetti burst and awards XP
- **50-Plant Gacha** — Spend 500 XP to pull a random plant from 50 unique curated designs (Common → Rare → Legendary)
- **Upload Your Own Plants** — Drag-drop or click to upload PNG/JPEG drawings; they're saved permanently in your collection and placed on the shelf

### 💼 Job Hunt Mode
- **Live XP Stopwatch** — A real-time stopwatch that awards **1 XP per minute** automatically while running
- **Stop & Save** — Pauses accumulation and saves the session to history
- **Office Café Shop** — Spend XP to unlock café items (drinks, snacks, decor, study gear)

### 🎵 Lo-Fi Radio
- 6 distinct ambient/lo-fi tracks with equalizer visualizer
- Volume slider, prev/next controls, track list with live playback indicators
- Track preference saved to localStorage

### 💾 Persistence
All data is saved to **browser localStorage**:
- XP balance & total earned
- Course list (custom + defaults)
- Unlocked plants & café items
- Session history (last 50)
- Custom uploaded plant images (base64)
- Volume & track preference

---

## 🚀 Getting Started

```bash
npm install
npm run dev     # Start dev server at http://localhost:5173
npm run build   # Production build
npm run preview # Preview production build
```

---

## 🌿 Plant Rarity System

| Rarity | Count | XP Cost |
|--------|-------|---------|
| Common | 20 | 500 XP each pull |
| Rare | 20 | 500 XP each pull |
| Legendary | 10 | 500 XP each pull |
| Custom (yours!) | ∞ | Free (upload) |

---

## 🛠️ Tech Stack

- **React 19** + TypeScript
- **Tailwind CSS v4** (Vite plugin)
- **canvas-confetti** for celebration bursts
- **HTML5 Audio API** for lo-fi playback
- **localStorage** for all persistence

---

*Made with 💜 — VibeFocus v1.0*
