/**
 * metaBonuses.ts
 * 
 * Pure selectors to convert LeetCode stats into bounded gameplay modifiers.
 * Strictly bounded to prevent game balance breakage.
 */

import { LeetCodeProfile } from '@/lib/leetcodeService';

export interface MetaModifiers {
  additive: {
    hp: number;
    mp: number;
  };
  multiplicative: {
    damage: number; // 0.1 = +10%
    xp: number;
  };
  utility: {
    timingWindow: number; // ms
  };
}

const DEFAULT_MODIFIERS: MetaModifiers = {
  additive: { hp: 0, mp: 0 },
  multiplicative: { damage: 0, xp: 0 },
  utility: { timingWindow: 0 }
};

/**
 * Pure function to map LeetCode stats to modifiers.
 * Includes strict upper bounds (CAPS).
 */
export function getMetaModifiers(profile: LeetCodeProfile | null): MetaModifiers {
  if (!profile) return DEFAULT_MODIFIERS;

  // 1. Additive: Hard Solved -> HP, Medium Solved -> MP
  const hpBonus = Math.min(50, Math.floor(profile.hardSolved * 2)); // Cap at 50
  const mpBonus = Math.min(30, Math.floor(profile.mediumSolved * 0.5)); // Cap at 30

  // 2. Multiplicative: Total Solved -> Damage, Easy Solved -> XP
  const damageMult = Math.min(0.2, (profile.totalSolved / 500) * 0.1); // Cap at 20%
  const xpMult = Math.min(0.15, (profile.easySolved / 300) * 0.1); // Cap at 15%

  // 3. Utility: Streak -> Timing Window
  const timingBonus = Math.min(150, profile.streak * 5); // Cap at 150ms

  return {
    additive: {
      hp: hpBonus,
      mp: mpBonus
    },
    multiplicative: {
      damage: damageMult,
      xp: xpMult
    },
    utility: {
      timingWindow: timingBonus
    }
  };
}
