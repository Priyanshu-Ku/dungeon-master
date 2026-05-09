import { create } from 'zustand';
import { LeetCodeProfile, fetchLeetCodeProfile } from '@/lib/leetcodeService';

export interface SerializedLeetCodeState {
  username: string | null;
  profile: LeetCodeProfile | null;
  lastSyncAt: number | null;
}

interface LeetCodeState {
  username: string | null;
  profile: LeetCodeProfile | null;
  syncStatus: 'IDLE' | 'LOADING' | 'ERROR';
  lastSyncAt: number | null;
  error: string | null;

  // Actions
  linkAccount: (username: string) => Promise<void>;
  unlinkAccount: () => void;
  syncProfile: () => Promise<void>;
  
  // Persistence
  serializeLeetCodeState: () => SerializedLeetCodeState;
  hydrateLeetCodeState: (data: SerializedLeetCodeState) => void;
}

export const useLeetCodeStore = create<LeetCodeState>((set, get) => ({
  username: null,
  profile: null,
  syncStatus: 'IDLE',
  lastSyncAt: null,
  error: null,

  linkAccount: async (username) => {
    set({ syncStatus: 'LOADING', error: null });
    try {
      const profile = await fetchLeetCodeProfile(username);
      set({ 
        username, 
        profile, 
        syncStatus: 'IDLE', 
        lastSyncAt: Date.now() 
      });
    } catch (err: any) {
      set({ syncStatus: 'ERROR', error: err.message });
      throw err;
    }
  },

  unlinkAccount: () => set({ 
    username: null, 
    profile: null, 
    lastSyncAt: null, 
    syncStatus: 'IDLE' 
  }),

  syncProfile: async () => {
    const { username } = get();
    if (!username) return;

    set({ syncStatus: 'LOADING', error: null });
    try {
      const profile = await fetchLeetCodeProfile(username);
      set({ 
        profile, 
        syncStatus: 'IDLE', 
        lastSyncAt: Date.now() 
      });
    } catch (err: any) {
      set({ syncStatus: 'ERROR', error: err.message });
    }
  },

  serializeLeetCodeState: () => ({
    username: get().username,
    profile: get().profile,
    lastSyncAt: get().lastSyncAt
  }),

  hydrateLeetCodeState: (data) => set({
    username: data.username,
    profile: data.profile,
    lastSyncAt: data.lastSyncAt,
    syncStatus: 'IDLE'
  })
}));
