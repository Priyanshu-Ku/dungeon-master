import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ProgressionState {
  ngPlusCount: number;
  totalRunsCompleted: number;
  highestDepthReached: number;
  wizardCheckpointReached: boolean;
  hasHydrated: boolean;

  // Actions
  incrementNGPlus: () => void;
  recordRunCompletion: (depth: number) => void;
  setWizardCheckpointReached: (reached: boolean) => void;
  setHasHydrated: (hydrated: boolean) => void;
  resetProgression: () => void;
}

export const useProgressionStore = create<ProgressionState>()(
  persist(
    (set) => ({
      ngPlusCount: 0,
      totalRunsCompleted: 0,
      highestDepthReached: 0,
      wizardCheckpointReached: false,
      hasHydrated: false,

      incrementNGPlus: () => set((state) => ({ 
        ngPlusCount: state.ngPlusCount + 1,
        totalRunsCompleted: state.totalRunsCompleted + 1 
      })),

      recordRunCompletion: (depth) => set((state) => ({
        totalRunsCompleted: state.totalRunsCompleted + 1,
        highestDepthReached: Math.max(state.highestDepthReached, depth)
      })),

      setWizardCheckpointReached: (reached) => set({ wizardCheckpointReached: reached }),
      setHasHydrated: (hydrated) => set({ hasHydrated: hydrated }),

      resetProgression: () => set({ 
        ngPlusCount: 0, 
        totalRunsCompleted: 0, 
        highestDepthReached: 0,
        wizardCheckpointReached: false
      })
    }),
    {
      name: 'obsidian_progression_v1',
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      }
    }
  )
);
