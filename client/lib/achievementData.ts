/**
 * achievementData.ts
 * 
 * Definitions for all badges and milestones in Obsidian Depths.
 */

export interface Badge {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'combat' | 'exploration' | 'meta';
}

export const BADGES: Record<string, Badge> = {
  first_descent: {
    id: 'first_descent',
    title: 'First Descent',
    description: 'Survive your first descent into the depths.',
    icon: 'Sword',
    category: 'combat'
  },
  master_debugger: {
    id: 'master_debugger',
    title: 'Master Debugger',
    description: 'Defeat a boss without taking any damage.',
    icon: 'Terminal',
    category: 'combat'
  },
  infinite_explorer: {
    id: 'infinite_explorer',
    title: 'Infinite Explorer',
    description: 'Reach New Game+ level 5.',
    icon: 'Zap',
    category: 'meta'
  },
  daily_specialist: {
    id: 'daily_specialist',
    title: 'Daily Specialist',
    description: 'Complete 5 Daily Protocols.',
    icon: 'Calendar',
    category: 'meta'
  },
  lore_keeper: {
    id: 'lore_keeper',
    title: 'Lore Keeper',
    description: 'Open the Ancient Codex 10 times.',
    icon: 'Book',
    category: 'exploration'
  }
};
