/**
 * progressionScaling.ts
 * 
 * Pure functions for calculating difficulty multipliers based on NG+ level.
 * Formula: 1 + (NG+ * scalingFactor)
 */

interface DifficultyModifiers {
  bossHpMultiplier: number;
  bossDamageMultiplier: number;
  playerDamageTakenMultiplier: number;
  rewardMultiplier: number;
}

const SCALING_FACTORS = {
  BOSS_HP: 0.25,        // +25% per NG+
  BOSS_DAMAGE: 0.15,    // +15% per NG+
  PLAYER_DEFENSE: 0.1,  // +10% damage taken per NG+
  REWARDS: 0.2          // +20% XP/Loot quality per NG+ (theoretical)
};

/**
 * Calculates difficulty multipliers for a given NG+ count.
 */
export function getDifficultyModifiers(ngPlus: number): DifficultyModifiers {
  return {
    bossHpMultiplier: 1 + (ngPlus * SCALING_FACTORS.BOSS_HP),
    bossDamageMultiplier: 1 + (ngPlus * SCALING_FACTORS.BOSS_DAMAGE),
    playerDamageTakenMultiplier: 1 + (ngPlus * SCALING_FACTORS.PLAYER_DEFENSE),
    rewardMultiplier: 1 + (ngPlus * SCALING_FACTORS.REWARDS)
  };
}

/**
 * Bounds the scaling to prevent overflow or extreme difficulty.
 */
export function getBoundedModifiers(ngPlus: number): DifficultyModifiers {
  const boundedNg = Math.min(ngPlus, 20); // Cap scaling at NG+20
  return getDifficultyModifiers(boundedNg);
}
