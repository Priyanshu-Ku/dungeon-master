import { create } from 'zustand';

export type AppView = 'MENU' | 'GAME' | 'ONBOARDING' | 'LOADING' | 'CINEMATIC' | 'DASHBOARD';

interface MetaState {
  currentView: AppView;
  hasCompletedOnboarding: boolean;
  
  // Actions
  setView: (view: AppView) => void;
  completeOnboarding: () => void;
  
  // Persistence
  initializeMeta: () => void;
}

export const useMetaStore = create<MetaState>((set, get) => ({
  currentView: 'MENU',
  hasCompletedOnboarding: false,

  setView: (view) => set({ currentView: view }),

  completeOnboarding: () => {
    set({ hasCompletedOnboarding: true, currentView: 'LOADING' });
    localStorage.setItem('obsidian_onboarding_complete', 'true');
  },

  initializeMeta: () => {
    const onboardingComplete = localStorage.getItem('obsidian_onboarding_complete') === 'true';
    const hasSave = localStorage.getItem('obsidian_depths_save_v1') !== null;
    
    set({ 
      hasCompletedOnboarding: onboardingComplete,
      currentView: hasSave ? 'MENU' : 'MENU' // Always start at menu
    });
  }
}));
