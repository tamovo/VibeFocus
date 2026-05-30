import type { CafeItem } from '../types';

export const CAFE_ITEMS: CafeItem[] = [
  // Drinks
  { id: 'c1', name: 'Matcha Latte', emoji: '🍵', cost: 50, description: 'A frothy matcha latte with oat milk foam art', category: 'drink', unlocked: false },
  { id: 'c2', name: 'Cherry Blossom Tea', emoji: '🌸', cost: 40, description: 'Delicate sakura tea in a glass teapot', category: 'drink', unlocked: false },
  { id: 'c3', name: 'Lavender Lemonade', emoji: '💜', cost: 45, description: 'Purple lavender syrup swirled into lemonade', category: 'drink', unlocked: false },
  { id: 'c4', name: 'Strawberry Boba', emoji: '🍓', cost: 60, description: 'Strawberry milk tea with chewy tapioca pearls', category: 'drink', unlocked: false },
  { id: 'c5', name: 'Honey Cloud Coffee', emoji: '☁️', cost: 55, description: 'Fluffy whipped cream cloud floating on espresso', category: 'drink', unlocked: false },
  { id: 'c6', name: 'Peach Oolong', emoji: '🍑', cost: 35, description: 'Warm peach oolong with a wedge of fresh fruit', category: 'drink', unlocked: false },

  // Snacks
  { id: 'c7', name: 'Bunny Macarons', emoji: '🐰', cost: 80, description: 'Pastel macarons shaped like sleeping bunny faces', category: 'snack', unlocked: false },
  { id: 'c8', name: 'Star Shortbread', emoji: '⭐', cost: 65, description: 'Buttery star cookies dusted with edible gold', category: 'snack', unlocked: false },
  { id: 'c9', name: 'Cloud Bread', emoji: '🍞', cost: 50, description: 'Fluffy cloud-shaped sandwich bread, pastel pink', category: 'snack', unlocked: false },
  { id: 'c10', name: 'Mochi Box', emoji: '🧁', cost: 90, description: 'Six assorted mochi in a cute gift box', category: 'snack', unlocked: false },
  { id: 'c11', name: 'Croissant Bear', emoji: '🥐', cost: 70, description: 'Flaky croissant with a bear face pressed on top', category: 'snack', unlocked: false },

  // Decor
  { id: 'c12', name: 'Fairy Lights', emoji: '✨', cost: 120, description: 'Warm twinkling lights to frame your workspace', category: 'decor', unlocked: false },
  { id: 'c13', name: 'Mini Succulent Pot', emoji: '🪴', cost: 100, description: 'Tiny terracotta pot with a smiling succulent', category: 'decor', unlocked: false },
  { id: 'c14', name: 'Vintage Clock', emoji: '🕰️', cost: 150, description: 'Pastel pink vintage desk clock with gold hands', category: 'decor', unlocked: false },
  { id: 'c15', name: 'Sticker Pack', emoji: '🌟', cost: 80, description: 'Collection of 20 holographic productivity stickers', category: 'decor', unlocked: false },
  { id: 'c16', name: 'Cozy Candle', emoji: '🕯️', cost: 110, description: 'Vanilla-lavender soy candle in a hexagon jar', category: 'decor', unlocked: false },

  // Study Items
  { id: 'c17', name: 'Pastel Planner', emoji: '📓', cost: 130, description: 'Soft cover planner with weekly spreads & stickers', category: 'study', unlocked: false },
  { id: 'c18', name: 'Cloud Headphones', emoji: '🎧', cost: 200, description: 'Pastel white wireless headphones, noise-canceling', category: 'study', unlocked: false },
  { id: 'c19', name: 'Aesthetic Desk Lamp', emoji: '💡', cost: 175, description: 'Curved LED lamp with warm color temperature', category: 'study', unlocked: false },
  { id: 'c20', name: 'Focus Toolkit', emoji: '🗂️', cost: 250, description: 'The ultimate set: pomodoro timer, index cards, gel pens', category: 'study', unlocked: false },
];
