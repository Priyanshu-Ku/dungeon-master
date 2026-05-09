'use client';

import { useEffect, useState } from 'react';
import { useGameStore } from '@/store/gameStore';

/**
 * useLeetCode
 * 
 * Fetches mock/real LeetCode stats and maps them to player attributes.
 * easySolved     -> +5 maxHP each
 * mediumSolved   -> +8 maxMP each
 * hardSolved     -> +3 to level
 * acceptanceRate -> critChance (acceptanceRate / 100)
 */
export function useLeetCode() {
  const { setPlayer } = useGameStore();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [rawData, setRawData] = useState<any>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        // Attempt fetch, fallback to mock if API is down or returns error
        const res = await fetch('/api/leetcode').catch(() => null);
        let data;
        
        if (res && res.ok) {
          data = await res.json();
        } else {
          // Mock data as requested
          data = {
            totalSolved: 47,
            easySolved: 23,
            mediumSolved: 18,
            hardSolved: 6,
            acceptanceRate: 61, // as percentage
            currentStreak: 4
          };
        }

        setRawData(data);

        // Mapping Logic
        const baseXP = data.totalSolved * 100;
        const extraHP = data.easySolved * 5;
        const extraMP = data.mediumSolved * 8;
        const levelBonus = data.hardSolved * 3;
        
        const mappedStats = {
          maxHp: 100 + extraHP,
          hp: 100 + extraHP,
          maxMp: 100 + extraMP,
          mp: 100 + extraMP,
          level: 1 + levelBonus,
          xp: baseXP % 1000,
          maxXp: 1000,
          totalSolved: data.totalSolved,
          acceptanceRate: data.acceptanceRate / 100,
          currentStreak: data.currentStreak,
          activeBuff: data.currentStreak >= 3 ? 'STREAK_BONUS' : null,
        };

        setPlayer(mappedStats);
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
        setLoading(false);
      }
    }

    fetchData();
  }, [setPlayer]);

  return { loading, error, rawData };
}
