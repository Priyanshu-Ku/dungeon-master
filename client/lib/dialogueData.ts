/**
 * dialogueData.ts
 * 
 * Static definitions for narrative speakers and dialogue sequences.
 */

export interface Speaker {
  id: string;
  name: string;
  color: string;
  avatar?: string;
}

export interface DialogueStep {
  speakerId: string;
  text: string;
  mood?: 'neutral' | 'angry' | 'mysterious' | 'defeated';
}

export const SPEAKERS: Record<string, Speaker> = {
  narrator: {
    id: 'narrator',
    name: 'SYSTEM',
    color: '#94A3B8'
  },
  architect: {
    id: 'architect',
    name: 'The Void Architect',
    color: '#7C3AED'
  },
  player: {
    id: 'player',
    name: 'Explorer',
    color: '#00E5FF'
  }
};

export const DIALOGUE_SEQUENCES: Record<string, DialogueStep[]> = {
  boss_intro_architect: [
    { speakerId: 'narrator', text: 'Critical mass detected. The architecture is shifting...' },
    { speakerId: 'architect', text: 'Another fragment of code, adrift in the static. Do you truly believe you can solve what I have spent eons abstracting?', mood: 'mysterious' },
    { speakerId: 'player', text: 'I am here to decrypt the core. Step aside.' },
    { speakerId: 'architect', text: 'Decrypt? You are but a debugger in a world of compiled destiny. Let us see if your logic holds against my entropy.', mood: 'angry' }
  ],
  boss_defeat_architect: [
    { speakerId: 'architect', text: 'Impossible... my recursions were perfect... how could a simple debugger...', mood: 'defeated' },
    { speakerId: 'narrator', text: 'The Void Architect dissolves. Sector 01 is now under your control.' }
  ]
};

export const CODEX_ENTRIES = [
  {
    id: 'the-void',
    title: 'The Void',
    category: 'Lore',
    content: 'The Void is the space between execution cycles. It is here that discarded code, forgotten variables, and corrupted pointers coalesce into the Architect’s domain.'
  },
  {
    id: 'resonance',
    title: 'Resonance',
    category: 'Tutorial',
    content: 'Your real-world algorithmic performance (Resonance) provides bounded modifiers to your processing power. The higher your streak, the more efficient your decryption.'
  }
];
