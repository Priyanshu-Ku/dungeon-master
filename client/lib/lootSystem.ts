/**
 * lootSystem.ts
 * 
 * Item Registry and Deterministic Loot Generation for Obsidian Depths.
 * Separates immutable definitions from runtime instances.
 */

export type ItemSlot = 'CODEX' | 'FOCUS' | 'SIGIL' | 'MANTLE';
export type ItemTier = 'Common' | 'Rare' | 'Epic' | 'Obsidian';

export interface ItemDefinition {
  id: string;
  name: string;
  slot: ItemSlot;
  baseTier: ItemTier;
  description: string;
  lore: string;
  // Base stats that this item type provides
  stats: {
    hpBonus?: number;
    mpBonus?: number;
    damageMult?: number;
    timingBonus?: number; // ms added to timing windows
  };
}

export interface ItemInstance {
  instanceId: string;
  definitionId: string;
  rarity: ItemTier;
  rolledStats: {
    hpBonus: number;
    mpBonus: number;
    damageMult: number;
    timingBonus: number;
  };
}

// --- ITEM REGISTRY ---
export const ITEM_REGISTRY: Record<string, ItemDefinition> = {
  'codex-binary': {
    id: 'codex-binary',
    name: 'Binary Codex',
    slot: 'CODEX',
    baseTier: 'Common',
    description: 'A worn book of basic search algorithms.',
    lore: 'The foundation of all traversal.',
    stats: { damageMult: 0.1 }
  },
  'focus-crystal': {
    id: 'focus-crystal',
    name: 'Resonance Crystal',
    slot: 'FOCUS',
    baseTier: 'Rare',
    description: 'Increases processing efficiency.',
    lore: 'Focus the mind, optimize the flow.',
    stats: { mpBonus: 20, timingBonus: 100 }
  },
  'sigil-void': {
    id: 'sigil-void',
    name: 'Void Sigil',
    slot: 'SIGIL',
    baseTier: 'Epic',
    description: 'Taps into the entropy of the depths.',
    lore: 'Nothingness is the ultimate compression.',
    stats: { damageMult: 0.4, hpBonus: -10 }
  },
  'mantle-obsidian': {
    id: 'mantle-obsidian',
    name: 'Obsidian Mantle',
    slot: 'MANTLE',
    baseTier: 'Obsidian',
    description: 'The skin of the dungeon itself.',
    lore: 'You are the depths now.',
    stats: { hpBonus: 50, mpBonus: 50, damageMult: 0.2 }
  }
};

// --- DETERMINISTIC GENERATION ---

class SeededRNG {
  private seed: number;
  constructor(seed: string) {
    let h = 0;
    for (let i = 0; i < seed.length; i++) h = (Math.imul(31, h) + seed.charCodeAt(i)) | 0;
    this.seed = h;
  }
  next() {
    this.seed = (this.seed * 1664525 + 1013904223) % 4294967296;
    return this.seed / 4294967296;
  }
}

export function generateLoot(roomSeed: string, difficulty: 'easy' | 'medium' | 'hard'): ItemInstance[] {
  const rng = new SeededRNG(roomSeed);
  const items: ItemInstance[] = [];
  
  // Decide number of drops
  const numDrops = difficulty === 'hard' ? 2 : 1;
  const ids = Object.keys(ITEM_REGISTRY);

  for (let i = 0; i < numDrops; i++) {
    const defId = ids[Math.floor(rng.next() * ids.length)];
    const def = ITEM_REGISTRY[defId];
    
    // Roll rarity (simplified for Phase 4C)
    const roll = rng.next();
    let rarity: ItemTier = def.baseTier;
    if (roll > 0.95) rarity = 'Obsidian';
    else if (roll > 0.8) rarity = 'Epic';
    else if (roll > 0.5) rarity = 'Rare';

    // Scale stats based on rarity
    const multiplier = rarity === 'Obsidian' ? 2.5 : rarity === 'Epic' ? 1.8 : rarity === 'Rare' ? 1.3 : 1.0;

    items.push({
      instanceId: `item-${roomSeed}-${i}`,
      definitionId: defId,
      rarity,
      rolledStats: {
        hpBonus: Math.floor((def.stats.hpBonus || 0) * multiplier),
        mpBonus: Math.floor((def.stats.mpBonus || 0) * multiplier),
        damageMult: Number(((def.stats.damageMult || 0) * multiplier).toFixed(2)),
        timingBonus: Math.floor((def.stats.timingBonus || 0) * multiplier)
      }
    });
  }

  return items;
}
