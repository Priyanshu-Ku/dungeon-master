import { create } from 'zustand';
import { executeCode } from '@/lib/codeSandbox';

export interface TestCase {
  input: string;
  expected: string;
  actual?: string;
  status: 'pending' | 'passed' | 'failed';
}

export interface Problem {
  id: string;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  description: string;
  starterCode: string;
  fnName: string; // The function name to call
  testCases: TestCase[];
  timeLimit?: number; // In seconds
}

interface ProblemState {
  currentProblem: Problem | null;
  code: string;
  isExecuting: boolean;
  output: string;
  
  // Actions
  setProblem: (problem: Problem) => void;
  setCode: (code: string) => void;
  runCode: () => Promise<void>;
  resetProblem: () => void;
}

export const useProblemStore = create<ProblemState>((set, get) => ({
  currentProblem: null,
  code: '',
  isExecuting: false,
  output: '',

  setProblem: (problem) => set({ 
    currentProblem: problem, 
    code: problem.starterCode,
    output: '',
  }),

  setCode: (code) => set({ code }),

  runCode: async () => {
    set({ isExecuting: true, output: 'Transmitting fragment to sandbox...' });
    
    // MOCK: Auto-succeed after a slight delay
    setTimeout(() => {
      const { currentProblem } = get();
      if (!currentProblem) return;

      const updatedTestCases = currentProblem.testCases.map(tc => ({
        ...tc,
        actual: tc.expected,
        status: 'passed' as const
      }));

      set({ 
        isExecuting: false, 
        output: 'RESONANCE STABILIZED. Fragments matched. Puzzle solved!',
        currentProblem: { ...currentProblem, testCases: updatedTestCases }
      });
    }, 1500);
  },

  resetProblem: () => set({ currentProblem: null, code: '', output: '' })
}));
