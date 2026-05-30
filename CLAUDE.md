# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

VibeFocus is a gamified productivity/focus app built with React + TypeScript + Vite. It has two modes — **Art School Mode** and **Job Hunt Mode** — each with a distinct color palette, timer mechanic, and rewards shop. All state is persisted to `localStorage` (no backend).

## Commands

All commands must be run from the `vibefocus/` subdirectory (the actual project root):

```bash
npm run dev       # Start Vite dev server (hot reload)
npm run build     # Type-check with tsc, then Vite production build
npm run preview   # Serve the production build locally
```

There is no lint script or test framework configured.

## Architecture

### State Management

All application state lives in a single `AppState` object (defined in `src/types.ts`), managed by `useAppState` (`src/hooks/useAppState.ts`), which wraps `useLocalStorage` (`src/hooks/useLocalStorage.ts`). The localStorage key is `vibefocus_state`.

`App.tsx` is the only consumer of `useAppState` — all state mutations and the full state object are threaded down as props. Components never read from localStorage directly.

**XP has two values:**
- `xp` — spendable currency (decremented when buying items)
- `totalXp` — cumulative lifetime XP (never decremented, used for stats)

### Mode System

`AppMode = 'art' | 'job'` controls which timer component renders and which shop panel appears. The mode also drives the entire visual theme:

- **Art mode** — pink/lavender accents (`#C9A7F4`, `#F4A7C3`), Plant Shelf shop, courses-based countdown timer
- **Job mode** — mint/blue accents (`#7FCDBE`, `#7FB3CD`), Café Shop, open-ended stopwatch

### XP Earning

- **ArtMode** (`src/components/ArtMode.tsx`): Fixed **+100 XP** per completed course session. "I Finished It!" button is locked for the first 60 seconds of a session to prevent abuse.
- **JobMode** (`src/components/JobMode.tsx`): **+1 XP per minute** of active tracking time, awarded via a `setInterval` every 60 seconds.

### Rewards / Shops

- **PlantShelf** (`src/components/PlantShelf.tsx`): Gacha pull costs **500 XP**. Pulls one random plant from `src/data/plants.ts` (50 built-in: 20 common, 20 rare, 10 legendary). Custom plants can be added via image upload (stored as base64 data URLs in `localStorage`).
- **CafeShop** (`src/components/CafeShop.tsx`): Fixed-cost items from `src/data/cafeItems.ts`; `getCafeItems()` in `useAppState` merges the static item list with per-item unlock state from `state.unlockedCafeItems`.

### Styling

- **Tailwind CSS v4** with the Vite plugin (`@tailwindcss/vite`). There is **no `tailwind.config.js`** — all theme tokens are declared in the `@theme {}` block inside `src/index.css`.
- Custom CSS classes (`.soft-shadow`, `.smooth-transition`, `.glass`, `.animate-*`, etc.) are defined in `src/index.css`.
- Fonts: **Quicksand** for headings/bold UI, **Nunito** for body text — loaded from Google Fonts in `index.html`.
- All inline `style` props use mode-derived accent color variables (`accentColor`, `accentColor2`) computed at the component level from `state.mode`.

### Confetti

`canvas-confetti` fires on Art Mode session completion. It targets the `<canvas id="confetti-canvas">` element rendered in `App.tsx` (fixed, full-viewport, `z-index: 9999`, pointer-events none).

### Lo-Fi Player

`src/components/LofiPlayer.tsx` uses `src/data/lofiTracks.ts` — a static list of 6 CC-licensed MP3s hosted on Internet Archive. Track index and volume are persisted in `AppState`.
