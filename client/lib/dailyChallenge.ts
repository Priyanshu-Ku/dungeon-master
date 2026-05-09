/**
 * dailyChallenge.ts
 * 
 * Logic for generating deterministic seeds based on the current date.
 * Ensures all players encounter the same dungeon on the same day.
 */

/**
 * Generates a string seed in the format YYYY-MM-DD.
 */
export function getDailySeed(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `DAILY-${year}-${month}-${day}`;
}

/**
 * Returns the current date as a simple comparable string.
 */
export function getTodayKey(): string {
  const now = new Date();
  return `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`;
}

/**
 * Checks if a date key matches today.
 */
export function isToday(dateKey: string | null): boolean {
  if (!dateKey) return false;
  return dateKey === getTodayKey();
}
