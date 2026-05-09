import type { Challenge } from '@/store/gameStore';

/**
 * CHALLENGES
 * 
 * Static pool of algorithm strategies for Phase 3.
 */
export const CHALLENGES: Challenge[] = [
  {
    id: 'binary-search',
    name: 'Binary Search',
    difficulty: 'easy',
    mpCost: 10,
    damageMult: 1.2,
    description: 'Halve the search space, crush the beast\'s defenses.',
    timingWindow: 3000,
    icon: 'search'
  },
  {
    id: 'merge-sort',
    name: 'Merge Sort',
    difficulty: 'medium',
    mpCost: 20,
    damageMult: 2.5,
    description: 'Divide, conquer, and merge for maximum impact.',
    timingWindow: 2000,
    icon: 'sort'
  },
  {
    id: 'dijkstra',
    name: 'Dijkstra\'s Path',
    difficulty: 'hard',
    mpCost: 45,
    damageMult: 4.8,
    description: 'Find the shortest path to total annihilation.',
    timingWindow: 1500,
    icon: 'graph'
  },
  {
    id: 'knapsack',
    name: '0/1 Knapsack',
    difficulty: 'medium',
    mpCost: 25,
    damageMult: 3.2,
    description: 'Optimal substructure yields maximum damage.',
    timingWindow: 2200,
    icon: 'dp'
  },
  {
    id: 'huffman',
    name: 'Huffman Coding',
    difficulty: 'easy',
    mpCost: 15,
    damageMult: 1.8,
    description: 'Compress the enemy until they cease to exist.',
    timingWindow: 2800,
    icon: 'greedy'
  },
  {
    id: 'quick-sort',
    name: 'Quick Sort',
    difficulty: 'medium',
    mpCost: 22,
    damageMult: 2.8,
    description: 'Pivot and partition for a devastating blow.',
    timingWindow: 1800,
    icon: 'sort'
  }
];

export function getMockBoss(): any {
  return {
    id: 'boss-void-stalker',
    name: 'VOID STALKER',
    currentHp: 1500,
    maxHp: 1500,
    attackDamage: 15,
    availableChallenges: CHALLENGES.slice(0, 3),
    phase: 1
  };
}
