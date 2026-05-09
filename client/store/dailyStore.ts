import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { getTodayKey, isToday } from '@/lib/dailyChallenge';

interface DailyState {
  lastCompletedDate: string | null;
  isDailyActive: boolean;

  // Actions
  startDaily: () => void;
  completeDaily: () => void;
  exitDaily: () => void;
  
  // Selectors
  hasCompletedToday: () => boolean;
}

export const useDailyStore = create<DailyState>()(
  persist(
    (set, get) => ({
      lastCompletedDate: null,
      isDailyActive: false,

      startDaily: () => set({ isDailyActive: true }),
      
      completeDaily: () => set({ 
        lastCompletedDate: getTodayKey(), 
        isDailyActive: false 
      }),

      exitDaily: () => set({ isDailyActive: false }),

      hasCompletedToday: () => isToday(get().lastCompletedDate)
    }),
    {
      name: 'obsidian_daily_v1'
    }
  )
);
