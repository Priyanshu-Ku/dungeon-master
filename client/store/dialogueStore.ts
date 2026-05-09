import { create } from 'zustand';
import { DialogueStep, DIALOGUE_SEQUENCES } from '@/lib/dialogueData';

interface DialogueState {
  isActive: boolean;
  currentSequence: DialogueStep[];
  currentIndex: number;
  onComplete: (() => void) | null;

  // Actions
  startDialogue: (sequenceId: string, onComplete?: () => void) => void;
  advanceDialogue: () => void;
  closeDialogue: () => void;
}

export const useDialogueStore = create<DialogueState>((set, get) => ({
  isActive: false,
  currentSequence: [],
  currentIndex: 0,
  onComplete: null,

  startDialogue: (sequenceId, onComplete) => {
    const sequence = DIALOGUE_SEQUENCES[sequenceId];
    if (!sequence) return;

    set({
      isActive: true,
      currentSequence: sequence,
      currentIndex: 0,
      onComplete: onComplete || null
    });
  },

  advanceDialogue: () => {
    const { currentIndex, currentSequence, onComplete } = get();
    
    if (currentIndex < currentSequence.length - 1) {
      set({ currentIndex: currentIndex + 1 });
    } else {
      set({ isActive: false, currentSequence: [], currentIndex: 0 });
      if (onComplete) onComplete();
    }
  },

  closeDialogue: () => {
    set({ isActive: false, currentSequence: [], currentIndex: 0, onComplete: null });
  }
}));
