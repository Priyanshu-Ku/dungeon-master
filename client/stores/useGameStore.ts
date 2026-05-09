import { create } from 'zustand';
import * as THREE from 'three';

export type GamePhase = 'EXPLORING' | 'CODING' | 'AWAKENING' | 'SUCCESS';

interface Badge {
  id: string;
  displayName: string;
  icon: string;
}

interface PlayerStats {
  hp: number;
  maxHp: number;
  mp: number;
  maxMp: number;
  level: number;
  xp: number;
  maxXp: number;
  totalSolved: number;
  badges: Badge[];
  inventory: string[];
  syncStatus: 'idle' | 'syncing' | 'success' | 'error';
}

interface GameState {
  phase: GamePhase;
  playerPos: THREE.Vector3;
  currentAnim: string;
  activeNodeId: string | null;
  interactPrompt: boolean;
  playerStats: PlayerStats;
  
  // Actions
  setPhase: (phase: GamePhase) => void;
  setPlayerPos: (pos: THREE.Vector3) => void;
  setCurrentAnim: (anim: string) => void;
  setActiveNodeId: (id: string | null) => void;
  setInteractPrompt: (show: boolean) => void;
  triggerChallenge: (nodeId: string) => void;
  syncLeetCode: (username: string) => Promise<void>;
  initialize: () => void;
  addInventoryItem: (item: string) => void;
}

export const useGameStore = create<GameState>((set, get) => ({
  phase: 'EXPLORING',
  playerPos: new THREE.Vector3(0, 0, 0),
  currentAnim: 'Idle',
  activeNodeId: null,
  interactPrompt: false,
  playerStats: {
    hp: 850,
    maxHp: 1000,
    mp: 220,
    maxMp: 300,
    level: 3,
    xp: 450,
    maxXp: 600,
    totalSolved: 0,
    badges: [],
    inventory: [],
    syncStatus: 'idle',
  },

  setPhase: (phase) => set({ phase }),
  setPlayerPos: (pos) => set({ playerPos: pos }),
  setCurrentAnim: (anim) => set({ currentAnim: anim }),
  setActiveNodeId: (id) => set({ activeNodeId: id }),
  setInteractPrompt: (show) => set({ interactPrompt: show }),
  triggerChallenge: (nodeId) => set({ 
    phase: 'CODING', 
    activeNodeId: nodeId,
    currentAnim: 'Interact' 
  }),
  syncLeetCode: async (username: string) => {
    set((state) => ({ playerStats: { ...state.playerStats, syncStatus: 'syncing' } }));
    
    try {
      const res = await fetch('/api/leetcode', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username }),
      });
      
      const data = await res.json();
      
      if (data.totalSolved !== undefined) {
        const solved = data.totalSolved;
        const level = Math.floor(solved / 10) + 1;
        const maxHp = 1000 + (level * 100);
        const maxMp = 300 + (level * 50);
        
        const newState = {
          playerStats: {
            ...get().playerStats,
            totalSolved: solved,
            badges: data.badges || [],
            level: level,
            maxHp: maxHp,
            hp: maxHp * 0.85,
            maxMp: maxMp,
            mp: maxMp * 0.7,
            syncStatus: 'success',
          }
        };
        set(newState);
        localStorage.setItem('dungeon_stats', JSON.stringify(newState.playerStats));
      } else {
        set((state) => ({ playerStats: { ...state.playerStats, syncStatus: 'error' } }));
      }
    } catch (err) {
      set((state) => ({ playerStats: { ...state.playerStats, syncStatus: 'error' } }));
    }
  },

  initialize: () => {
    if (typeof window === 'undefined') return;
    const saved = localStorage.getItem('dungeon_stats');
    if (saved) {
      try {
        const stats = JSON.parse(saved);
        set({ playerStats: stats });
      } catch (e) {
        console.error("Failed to restore stats", e);
      }
    }
  },
  
  addInventoryItem: (item: string) => {
    set((state) => {
      if (state.playerStats.inventory.includes(item)) return state;
      const newStats = {
        ...state.playerStats,
        inventory: [...state.playerStats.inventory, item]
      };
      localStorage.setItem('dungeon_stats', JSON.stringify(newStats));
      return { playerStats: newStats };
    });
  }
}));
