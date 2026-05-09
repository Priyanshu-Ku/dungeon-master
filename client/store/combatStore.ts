import { create } from 'zustand';

export type CombatPhase =
  | 'EXPLORATION'
  | 'BOSS_CINEMATIC'
  | 'DECISION'
  | 'TIMING'
  | 'HIT_RESULT'
  | 'BOSS_RETALIATION'
  | 'VICTORY'
  | 'DEFEAT';

export type HitQuality = 'PERFECT' | 'GOOD' | 'MISS' | null;

export interface Challenge {
  id: string;
  name: string;
  difficulty: 'easy' | 'medium' | 'hard';
  mpCost: number;
  damageMult: number;
  description: string;
  timingWindow: number;
  icon: 'search' | 'dp' | 'greedy' | 'graph' | 'sort';
}

export interface Boss {
  id: string;
  name: string;
  currentHp: number;
  maxHp: number;
  attackDamage: number;
  availableChallenges: Challenge[];
  phase: 1 | 2 | 3;
}

export interface SerializedCombatState {
  playerHp: number;
  playerMaxHp: number;
  playerMp: number;
  playerMaxMp: number;
  playerXp: number;
  playerLevel: number;
}

interface CombatState {
  combatPhase: CombatPhase;
  currentBoss: Boss | null;
  selectedChallenge: Challenge | null;
  hitQuality: HitQuality;
  lastDamageDealt: number;
  lastDamageTaken: number;
  
  // Player Data
  playerHp: number;
  playerMaxHp: number;
  playerMp: number;
  playerMaxMp: number;
  playerXp: number;
  playerLevel: number;
  activeDialogueLine: string | null;
  activeSpeaker: string | null;
  showCheckpointNotif: boolean;
  showCodingChallenge: boolean;
  triggerPostSolveDialogue: boolean;

  // Actions
  setCombatPhase: (phase: CombatPhase) => void;
  setActiveDialogue: (line: string | null, speaker: string | null) => void;
  setShowCheckpointNotif: (show: boolean) => void;
  setShowCodingChallenge: (show: boolean) => void;
  setTriggerPostSolveDialogue: (trigger: boolean) => void;
  setCurrentBoss: (boss: Boss | null) => void;
  setSelectedChallenge: (challenge: Challenge | null) => void;
  setHitQuality: (quality: HitQuality) => void;
  applyHit: (quality: HitQuality) => void;
  applyBossRetaliation: () => void;
  resetCombat: () => void;
  drainMp: (amount: number) => void;
  addXp: (amount: number) => void;

  // Persistence
  serializeCombatState: () => SerializedCombatState;
  hydrateCombatState: (data: SerializedCombatState) => void;
}

export const useCombatStore = create<CombatState>((set, get) => ({
  combatPhase: 'EXPLORATION',
  currentBoss: null,
  selectedChallenge: null,
  hitQuality: null,
  lastDamageDealt: 0,
  lastDamageTaken: 0,
  
  playerHp: 100,
  playerMaxHp: 100,
  playerMp: 60,
  playerMaxMp: 60,
  playerXp: 0,
  playerLevel: 1,
  activeDialogueLine: null,
  activeSpeaker: null,
  showCheckpointNotif: false,
  showCodingChallenge: false,
  triggerPostSolveDialogue: false,

  setCombatPhase: (phase) => set({ combatPhase: phase }),
  setActiveDialogue: (line, speaker) => set({ activeDialogueLine: line, activeSpeaker: speaker }),
  setShowCheckpointNotif: (show) => set({ showCheckpointNotif: show }),
  setShowCodingChallenge: (show) => set({ showCodingChallenge: show }),
  setTriggerPostSolveDialogue: (trigger) => set({ triggerPostSolveDialogue: trigger }),
  setCurrentBoss: (boss) => set({ currentBoss: boss }),
  setSelectedChallenge: (challenge) => set({ selectedChallenge: challenge }),
  setHitQuality: (quality) => set({ hitQuality: quality }),

  drainMp: (amount) => set((state) => ({ playerMp: Math.max(0, state.playerMp - amount) })),

  addXp: (amount) => set((state) => {
    let newXp = state.playerXp + amount;
    let newLevel = state.playerLevel;
    const xpThreshold = 100 * Math.pow(1.5, newLevel - 1);
    
    if (newXp >= xpThreshold) {
      newXp -= xpThreshold;
      newLevel += 1;
    }
    
    return { playerXp: newXp, playerLevel: newLevel };
  }),

  applyHit: (quality) => {
    const { selectedChallenge, currentBoss } = get();
    if (!selectedChallenge || !currentBoss) return;

    let damage = 0;
    if (quality === 'PERFECT') damage = Math.floor(selectedChallenge.damageMult * 20 * 1.5);
    else if (quality === 'GOOD') damage = Math.floor(selectedChallenge.damageMult * 20);

    set((state) => ({
      hitQuality: quality,
      lastDamageDealt: damage,
      currentBoss: state.currentBoss ? { ...state.currentBoss, currentHp: Math.max(0, state.currentBoss.currentHp - damage) } : null,
    }));
  },

  applyBossRetaliation: () => {
    const { currentBoss } = get();
    if (!currentBoss) return;
    const damage = Math.floor(currentBoss.attackDamage * (Math.random() * 0.4 + 0.8));
    set((state) => ({ 
      lastDamageTaken: damage,
      playerHp: Math.max(0, state.playerHp - damage)
    }));
  },

  resetCombat: () => set({
    combatPhase: 'EXPLORATION',
    selectedChallenge: null,
    hitQuality: null,
    lastDamageDealt: 0,
    lastDamageTaken: 0,
    playerHp: 100,
    playerMp: 60,
    playerXp: 0,
    playerLevel: 1,
  }),

  // Persistence
  serializeCombatState: () => {
    const state = get();
    return {
      playerHp: state.playerHp,
      playerMaxHp: state.playerMaxHp,
      playerMp: state.playerMp,
      playerMaxMp: state.playerMaxMp,
      playerXp: state.playerXp,
      playerLevel: state.playerLevel,
    };
  },

  hydrateCombatState: (data) => {
    set({
      playerHp: data.playerHp,
      playerMaxHp: data.playerMaxHp,
      playerMp: data.playerMp,
      playerMaxMp: data.playerMaxMp,
      playerXp: data.playerXp,
      playerLevel: data.playerLevel,
    });
  },
}));
