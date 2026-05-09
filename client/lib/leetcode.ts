// ─────────────────────────────────────────────────────────────────────────────
// lib/leetcode.ts
// Data bridge between LeetCode API and player stats.
// ─────────────────────────────────────────────────────────────────────────────

export interface LeetCodeStats {
  easySolved: number;
  mediumSolved: number;
  hardSolved: number;
  totalSolved: number;
}

export interface PlayerStats {
  hp: number;
  maxHp: number;
  mp: number;
  maxMp: number;
  level: number;
  xp: number;
  xpToNextLevel: number;
}

/**
 * Fetches LeetCode statistics for the given username.
 * Currently returns mocked data.
 * TODO: Replace with real LeetCode API call via /api/leetcode
 */
export async function fetchLeetCodeStats(
  _username: string
): Promise<LeetCodeStats> {
  // Mocked data — real integration wired in Phase 2
  return {
    easySolved: 42,
    mediumSolved: 18,
    hardSolved: 5,
    totalSolved: 65,
  };
}

/**
 * Maps LeetCode solve counts to in-game player stats.
 *
 * Mapping rules:
 *   maxHp        = easySolved * 2
 *   hp           = maxHp
 *   maxMp        = mediumSolved * 3
 *   mp           = maxMp
 *   level        = Math.floor(totalSolved / 10)
 *   xp           = (totalSolved % 10) * 100
 *   xpToNextLevel = 1000
 */
export function mapStatsToPlayer(stats: LeetCodeStats): PlayerStats {
  const maxHp = stats.easySolved * 2;
  const maxMp = stats.mediumSolved * 3;
  const level = Math.floor(stats.totalSolved / 10);
  const xp = (stats.totalSolved % 10) * 100;

  return {
    hp: maxHp,
    maxHp,
    mp: maxMp,
    maxMp,
    level,
    xp,
    xpToNextLevel: 1000,
  };
}
