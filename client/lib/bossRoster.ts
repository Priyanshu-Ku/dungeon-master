/**
 * bossRoster.ts
 * 
 * Defines the unique legendary bosses of the Obsidian Depths.
 * Each boss features distinct audiovisual themes and coding-specific gimmicks.
 */

export type BossGimmick = 
  | 'RECURSION_FOCUS' 
  | 'GRAPH_ONLY' 
  | 'HIDDEN_TESTS' 
  | 'TIME_DILATION' 
  | 'MEMORY_LEAK';

export interface BossData {
  id: string;
  name: string;
  title: string;
  maxHp: number;
  damage: number;
  gimmick: BossGimmick;
  color: string;
  introDialogue: string;
  defeatDialogue: string;
}

export const BOSS_ROSTER: BossData[] = [
  {
    id: 'recursive_shade',
    name: 'The Recursive Shade',
    title: 'Architect of Loops',
    maxHp: 200,
    damage: 15,
    gimmick: 'RECURSION_FOCUS',
    color: '#7C3AED',
    introDialogue: 'Your logic is linear. My domain is infinite. Can your recursion reach my core?',
    defeatDialogue: 'The stack... it collapsed...'
  },
  {
    id: 'graph_sovereign',
    name: 'Graph Sovereign',
    title: 'Master of Connectivity',
    maxHp: 350,
    damage: 25,
    gimmick: 'GRAPH_ONLY',
    color: '#00E5FF',
    introDialogue: 'The path to victory is a node you cannot reach. Every edge leads to ruin.',
    defeatDialogue: 'A shortest path... found...'
  },
  {
    id: 'null_emperor',
    name: 'Null Emperor',
    title: 'The Pointer of Void',
    maxHp: 500,
    damage: 40,
    gimmick: 'HIDDEN_TESTS',
    color: '#EF4444',
    introDialogue: 'You see the tests I show you. But the void hides the truth.',
    defeatDialogue: 'Null pointer... reference... exception...'
  },
  {
    id: 'time_keeper',
    name: 'The Chronicler',
    title: 'Time Dilation Protocol',
    maxHp: 400,
    damage: 30,
    gimmick: 'TIME_DILATION',
    color: '#FFD700',
    introDialogue: 'Execution time is a luxury you do not have. Tick... Tock...',
    defeatDialogue: 'Time... has... stopped...'
  }
];

export function getBossByDepth(depth: number): BossData {
  // Simple modulo for now, could be scaled by depth
  return BOSS_ROSTER[depth % BOSS_ROSTER.length];
}
