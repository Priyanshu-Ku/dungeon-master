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
    
    const { currentProblem, code } = get();
    if (!currentProblem) return;

    let allPassed = true;
    const updatedTestCases: TestCase[] = [];

    for (const tc of currentProblem.testCases) {
      // Parse inputs (assumed to be JSON strings for simplicity in this shell)
      let parsedInputs: any[];
      try {
        parsedInputs = JSON.parse(`[${tc.input}]`);
      } catch (e) {
        set({ isExecuting: false, output: 'ERROR: Malformed testcase input.' });
        return;
      }

      const result = await executeCode(
        code, 
        currentProblem.fnName, 
        parsedInputs, 
        JSON.parse(tc.expected)
      );

      updatedTestCases.push({
        ...tc,
        actual: JSON.stringify(result.actual),
        status: result.passed ? 'passed' : 'failed'
      });

      if (!result.passed) allPassed = false;
    }

    set({ 
      isExecuting: false, 
      output: allPassed ? 'RESONANCE STABILIZED. Fragments matched.' : 'DECRYPTION FAILED. Logic mismatch detected.',
      currentProblem: { ...currentProblem, testCases: updatedTestCases }
    });
  },

  resetProblem: () => set({ currentProblem: null, code: '', output: '' })
}));
