import type { Plant } from '../types';

export const PLANTS: Plant[] = [
  // Common (20 plants)
  { id: 'p1', name: 'Rosy Succulent', emoji: '🌵', rarity: 'common', color: '#FFB3C6', description: 'A chubby little succulent blushing pink at the tips.' },
  { id: 'p2', name: 'Cloud Fern', emoji: '🌿', rarity: 'common', color: '#B3E5D1', description: 'Soft fronds that look like tiny green clouds.' },
  { id: 'p3', name: 'Moonbeam Aloe', emoji: '🌱', rarity: 'common', color: '#FFFACD', description: 'Pale yellow-tipped aloe that glows at night.' },
  { id: 'p4', name: 'Blushing Cactus', emoji: '🌵', rarity: 'common', color: '#FFD6E7', description: 'A round cactus wearing a permanent rosy blush.' },
  { id: 'p5', name: 'Lavender Sprout', emoji: '🪴', rarity: 'common', color: '#E8D5F5', description: 'Tiny lavender seedling in a terracotta pot.' },
  { id: 'p6', name: 'Dewdrop Moss', emoji: '🌿', rarity: 'common', color: '#C8F0E8', description: 'Velvety moss covered in tiny morning dewdrops.' },
  { id: 'p7', name: 'Peach Blossom', emoji: '🌸', rarity: 'common', color: '#FFDAB9', description: 'Delicate peach blossoms on a twiggy branch.' },
  { id: 'p8', name: 'Baby Bamboo', emoji: '🎋', rarity: 'common', color: '#90EE90', description: 'Three tiny bamboo stalks tied with a ribbon.' },
  { id: 'p9', name: 'Cotton Dandelion', emoji: '🌼', rarity: 'common', color: '#FFFDE7', description: 'Fluffy white dandelion with golden stem.' },
  { id: 'p10', name: 'Petal Pothos', emoji: '🍃', rarity: 'common', color: '#98FB98', description: 'Heart-shaped pothos leaves on a trailing vine.' },
  { id: 'p11', name: 'Cherry Pebble', emoji: '🍒', rarity: 'common', color: '#FF9999', description: 'Smooth pebble-shaped succulent, cherry red.' },
  { id: 'p12', name: 'Sky Hyacinth', emoji: '💜', rarity: 'common', color: '#DDA0DD', description: 'Dense purple blooms with a sweet honey scent.' },
  { id: 'p13', name: 'Minty Sprig', emoji: '🌿', rarity: 'common', color: '#A8E6CF', description: 'Fresh mint sprig that smells like candy.' },
  { id: 'p14', name: 'Amber Jade', emoji: '💚', rarity: 'common', color: '#ADFF2F', description: 'Classic jade plant with amber-tipped leaves.' },
  { id: 'p15', name: 'Strawberry Cress', emoji: '🍓', rarity: 'common', color: '#FF6B6B', description: 'Tiny red-speckled watercress in a blue saucer.' },
  { id: 'p16', name: 'Snowflake Ficus', emoji: '❄️', rarity: 'common', color: '#E0F7FA', description: 'White-variegated ficus leaves like tiny snowflakes.' },
  { id: 'p17', name: 'Pillow Cactus', emoji: '🌵', rarity: 'common', color: '#C8E6C9', description: 'An adorably round, pillow-soft-looking cactus.' },
  { id: 'p18', name: 'Violet Oxalis', emoji: '🌺', rarity: 'common', color: '#9B59B6', description: 'Purple butterfly-wing leaves that fold at night.' },
  { id: 'p19', name: 'Daisy Topiary', emoji: '🌻', rarity: 'common', color: '#FFF176', description: 'Ball-shaped topiary covered in tiny daisies.' },
  { id: 'p20', name: 'Freckled Peperomia', emoji: '🍃', rarity: 'common', color: '#C5E1A5', description: 'Plump leaves with adorable dark green freckles.' },

  // Rare (20 plants)
  { id: 'p21', name: 'Aurora Orchid', emoji: '🌺', rarity: 'rare', color: '#FF69B4', description: 'Orchid petals that shift like northern lights.' },
  { id: 'p22', name: 'Galaxy Echeveria', emoji: '🌸', rarity: 'rare', color: '#7B68EE', description: 'Dark purple rosette with star-white edges.' },
  { id: 'p23', name: 'Glitter Fern', emoji: '✨', rarity: 'rare', color: '#FFD700', description: 'Each frond tip sparkles with natural golden dust.' },
  { id: 'p24', name: 'Neon Venus', emoji: '🌿', rarity: 'rare', color: '#39FF14', description: 'Venus flytrap glowing neon green in the dark.' },
  { id: 'p25', name: 'Moonstone Sedum', emoji: '🌑', rarity: 'rare', color: '#D4E6F1', description: 'Plump blue-white leaves like polished moonstones.' },
  { id: 'p26', name: 'Rose Quartz Cactus', emoji: '💎', rarity: 'rare', color: '#FFB3C6', description: 'Crystalline pink cactus that catches the light.' },
  { id: 'p27', name: 'Sapphire Bromeliad', emoji: '💙', rarity: 'rare', color: '#4169E1', description: 'Deep blue bromeliad center filled with rainwater.' },
  { id: 'p28', name: 'Caramel Monstera', emoji: '🍃', rarity: 'rare', color: '#D2691E', description: 'Giant split leaf with caramel-brown variegation.' },
  { id: 'p29', name: 'Pixel Cactus', emoji: '🎮', rarity: 'rare', color: '#76B900', description: 'Blocky pixelated cactus straight from a retro game.' },
  { id: 'p30', name: 'Cotton Candy Tulip', emoji: '🌷', rarity: 'rare', color: '#FFB3DE', description: 'Swirled pink-and-blue tulip that smells like spun sugar.' },
  { id: 'p31', name: 'Prism Aloe', emoji: '🌈', rarity: 'rare', color: '#FF7F50', description: 'Translucent aloe leaves that refract rainbow colors.' },
  { id: 'p32', name: 'Velvet Anthurium', emoji: '❤️', rarity: 'rare', color: '#DC143C', description: 'Deep red heart-shaped leaf with velvet texture.' },
  { id: 'p33', name: 'Lilac Bonsai', emoji: '🌳', rarity: 'rare', color: '#DDA0DD', description: 'Tiny twisted bonsai with purple seasonal blooms.' },
  { id: 'p34', name: 'Bubblegum Stonecrop', emoji: '🫧', rarity: 'rare', color: '#FF85C2', description: 'Pastel pink cluster that looks like bubblegum drops.' },
  { id: 'p35', name: 'Arctic Agave', emoji: '⛄', rarity: 'rare', color: '#B0E0E6', description: 'Pale blue-white agave with frost-bitten tips.' },
  { id: 'p36', name: 'Terracotta Dragon', emoji: '🐉', rarity: 'rare', color: '#CD853F', description: 'Dragon tree in a hand-painted terracotta pot.' },
  { id: 'p37', name: 'Celadon Haworthia', emoji: '🍵', rarity: 'rare', color: '#ACE1AF', description: 'Porcelain-green haworthia with white racing stripes.' },
  { id: 'p38', name: 'Midnight Calla', emoji: '🖤', rarity: 'rare', color: '#2F2F4F', description: 'Deep purple-black calla lily, elegant and mysterious.' },
  { id: 'p39', name: 'Peony Bromeliad', emoji: '🌸', rarity: 'rare', color: '#FFB6C1', description: 'Layered pink blooms resembling a garden peony.' },
  { id: 'p40', name: 'Amber Pitcher Plant', emoji: '🍯', rarity: 'rare', color: '#FFB347', description: 'Honey-gold pitcher plant with crimson veins.' },

  // Legendary (10 plants)
  { id: 'p41', name: 'Stardust Lotus', emoji: '🪷', rarity: 'legendary', color: '#FFD700', description: 'A lotus that blooms only under starlight, petals dusted with gold.' },
  { id: 'p42', name: 'Nebula Alocasia', emoji: '🌌', rarity: 'legendary', color: '#8B4513', description: 'Massive leaves patterned like a cosmic nebula.' },
  { id: 'p43', name: 'Crystal Corpse Flower', emoji: '💎', rarity: 'legendary', color: '#E6E6FA', description: 'A rare crystalline bloom, oddly beautiful.' },
  { id: 'p44', name: 'Celestial Begonia', emoji: '⭐', rarity: 'legendary', color: '#FFFACD', description: 'Silver-spotted leaves that mirror the night sky.' },
  { id: 'p45', name: 'Rainbow Hoya', emoji: '🌈', rarity: 'legendary', color: '#FF6B6B', description: 'Waxy flowers in every color, cascading like a waterfall.' },
  { id: 'p46', name: 'Phantom Orchid', emoji: '👻', rarity: 'legendary', color: '#F5F5F5', description: 'Translucent white orchid, appears to float mid-air.' },
  { id: 'p47', name: 'Solar Flare Agave', emoji: '☀️', rarity: 'legendary', color: '#FF4500', description: 'Orange-red agave with yellow edges like solar flares.' },
  { id: 'p48', name: 'Aurora Pitcher', emoji: '🌌', rarity: 'legendary', color: '#40E0D0', description: 'Iridescent turquoise pitcher plant, a living gem.' },
  { id: 'p49', name: 'Opal Cactus', emoji: '💠', rarity: 'legendary', color: '#A8C0FF', description: 'Milky-white cactus that reflects opal rainbow shimmers.' },
  { id: 'p50', name: 'Cosmic Bonsai', emoji: '🌳', rarity: 'legendary', color: '#9B59B6', description: 'Ancient bonsai whose leaves glow faintly purple at dusk.' },
];

export const getPlantById = (id: string): Plant | undefined =>
  PLANTS.find(p => p.id === id);

export const getRandomUnlockedPlant = (
  alreadyUnlocked: string[],
  customPlants: Plant[]
): Plant | null => {
  const allPlants = [...PLANTS, ...customPlants];
  const available = allPlants.filter(p => !alreadyUnlocked.includes(p.id));
  if (available.length === 0) return null;
  return available[Math.floor(Math.random() * available.length)];
};
