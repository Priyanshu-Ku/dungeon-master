/**
 * derivedStats.ts
 * 
 * Pure selectors for calculating runtime player stats from base stats and modifiers.
 * Implements a strict pipeline: Base -> Additive -> Multiplicative -> Final.
 */

import { ItemInstance } from '@/lib/lootSystem';
import { MetaModifiers } from './metaBonuses';

export interface BasePlayerStats {
  hp: number;
  maxHp: number;
  mp: number;
  maxMp: number;
  level: number;
}

export interface DerivedPlayerStats {
  maxHp: number;
  maxMp: number;
  damageMultiplier: number; // 1.0 = baseline
  timingWindowBonus: number; // ms
}

/**
 * Pure function to calculate derived stats.
 * Side-effect free, deterministic, and cacheable.
 */
export function calculateDerivedStats(
  base: BasePlayerStats, 
  equippedItems: ItemInstance[],
  meta: MetaModifiers
): DerivedPlayerStats {
  
  // 1. Initialize with Base Stats
  let derivedMaxHp = base.maxHp;
  let derivedMaxMp = base.maxMp;
  let derivedDamageMult = 1.0;
  let derivedTimingBonus = 0;

  // 2. Apply Additive Modifiers (Equipment + Meta)
  equippedItems.forEach(item => {
    derivedMaxHp += item.rolledStats.hpBonus;
    derivedMaxMp += item.rolledStats.mpBonus;
    derivedTimingBonus += item.rolledStats.timingBonus;
  });

  derivedMaxHp += meta.additive.hp;
  derivedMaxMp += meta.additive.mp;
  derivedTimingBonus += meta.utility.timingWindow;

  // 3. Apply Multiplicative Modifiers (Equipment + Meta + Level)
  let totalMultBonus = 0;
  equippedItems.forEach(item => {
    totalMultBonus += item.rolledStats.damageMult;
  });
  
  totalMultBonus += meta.multiplicative.damage;

  // Level Scaling (+5% damage per level above 1)
  const levelBonus = (base.level - 1) * 0.05;
  totalMultBonus += levelBonus;

  derivedDamageMult += totalMultBonus;

  // 4. Final Bounds Clamping
  return {
    maxHp: Math.max(1, derivedMaxHp),
    maxMp: Math.max(0, derivedMaxMp),
    damageMultiplier: Math.max(0.1, derivedDamageMult),
    timingWindowBonus: Math.max(0, derivedTimingBonus)
  };
}
