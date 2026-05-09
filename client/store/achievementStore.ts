import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { BADGES } from '@/lib/achievementData';
import { useToastStore } from '@/components/ui/Toast';

interface AchievementState {
  unlockedBadgeIds: string[];
  progress: Record<string, number>;

  // Actions
  unlockBadge: (id: string) => void;
  updateProgress: (id: string, amount: number) => void;
  isUnlocked: (id: string) => boolean;
  resetAchievements: () => void;
}

export const useAchievementStore = create<AchievementState>()(
  persist(
    (set, get) => ({
      unlockedBadgeIds: [],
      progress: {},

      unlockBadge: (id) => {
        const { unlockedBadgeIds } = get();
        if (unlockedBadgeIds.includes(id)) return;

        const badge = BADGES[id];
        if (!badge) return;

        set({ unlockedBadgeIds: [...unlockedBadgeIds, id] });
        
        // Trigger global notification
        useToastStore.getState().addToast(`BADGE UNLOCKED: ${badge.title}`, 'success');
      },

      updateProgress: (id, amount) => {
        const currentProgress = get().progress[id] || 0;
        const newProgress = currentProgress + amount;
        
        set((state) => ({
          progress: { ...state.progress, [id]: newProgress }
        }));

        // Check for specific thresholds (could be moved to a listener)
        if (id === 'daily_completions' && newProgress >= 5) {
          get().unlockBadge('daily_specialist');
        }
        if (id === 'codex_opens' && newProgress >= 10) {
          get().unlockBadge('lore_keeper');
        }
      },

      isUnlocked: (id) => get().unlockedBadgeIds.includes(id),

      resetAchievements: () => set({ unlockedBadgeIds: [], progress: {} })
    }),
    {
      name: 'obsidian_achievements_v1'
    }
  )
);
