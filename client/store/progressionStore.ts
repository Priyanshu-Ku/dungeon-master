import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ProgressionState {
  ngPlusCount: number;
  totalRunsCompleted: number;
  highestDepthReached: number;

  // Actions
  incrementNGPlus: () => void;
  recordRunCompletion: (depth: number) => void;
  resetProgression: () => void;
}

export const useProgressionStore = create<ProgressionState>()(
  persist(
    (set) => ({
      ngPlusCount: 0,
      totalRunsCompleted: 0,
      highestDepthReached: 0,

      incrementNGPlus: () => set((state) => ({ 
        ngPlusCount: state.ngPlusCount + 1,
        totalRunsCompleted: state.totalRunsCompleted + 1 
      })),

      recordRunCompletion: (depth) => set((state) => ({
        totalRunsCompleted: state.totalRunsCompleted + 1,
        highestDepthReached: Math.max(state.highestDepthReached, depth)
      })),

      resetProgression: () => set({ 
        ngPlusCount: 0, 
        totalRunsCompleted: 0, 
        highestDepthReached: 0 
      })
    }),
    {
      name: 'obsidian_progression_v1'
    }
  )
);
