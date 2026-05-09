/**
 * leetcodeService.ts
 * 
 * Pure data fetching service for LeetCode profile integration.
 * Handles API communication, retries, and error mapping.
 * No gameplay logic.
 */

export interface LeetCodeProfile {
  username: string;
  realName: string;
  totalSolved: number;
  easySolved: number;
  mediumSolved: number;
  hardSolved: number;
  ranking: number;
  streak: number;
  lastUpdate: number;
}

const API_ENDPOINT = '/api/leetcode';
const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 1000;

/**
 * Fetch a LeetCode profile by username.
 */
export async function fetchLeetCodeProfile(username: string): Promise<LeetCodeProfile> {
  let attempt = 0;

  while (attempt < MAX_RETRIES) {
    try {
      const response = await fetch(`${API_ENDPOINT}?username=${encodeURIComponent(username)}`);
      
      if (!response.ok) {
        if (response.status === 404) throw new Error('User not found');
        if (response.status === 429) throw new Error('Rate limit exceeded');
        throw new Error(`API Error: ${response.statusText}`);
      }

      const data = await response.json();
      return {
        username: data.username,
        realName: data.realName || data.username,
        totalSolved: data.totalSolved || 0,
        easySolved: data.easySolved || 0,
        mediumSolved: data.mediumSolved || 0,
        hardSolved: data.hardSolved || 0,
        ranking: data.ranking || 0,
        streak: data.streak || 0,
        lastUpdate: Date.now()
      };
    } catch (error) {
      attempt++;
      if (attempt >= MAX_RETRIES) throw error;
      await new Promise(resolve => setTimeout(resolve, RETRY_DELAY_MS * attempt));
    }
  }

  throw new Error('Failed to fetch profile after multiple attempts');
}
