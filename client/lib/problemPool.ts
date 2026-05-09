import { Problem } from '@/store/problemStore';

/**
 * problemPool.ts
 * 
 * A comprehensive database of algorithmic fragments categorized by difficulty and gimmick.
 * Used for dynamic problem generation during boss encounters.
 */

export const PROBLEM_POOL: Problem[] = [
  // --- RECURSION FOCUS ---
  {
    id: 'fibonacci-resonance',
    title: 'Fibonacci Resonance',
    difficulty: 'Easy',
    description: 'Calculate the Nth number in the Fibonacci sequence. The Architect demands a recursive approach.',
    starterCode: 'return function fib(n) {\n  // Implement recursion...\n}',
    fnName: 'fib',
    testCases: [
      { input: '5', expected: '5', status: 'pending' },
      { input: '10', expected: '55', status: 'pending' }
    ]
  },
  {
    id: 'factorial-void',
    title: 'Factorial Void',
    difficulty: 'Easy',
    description: 'Find the factorial of N. Ensure your recursion depth is sufficient.',
    starterCode: 'return function factorial(n) {\n  // Implement recursion...\n}',
    fnName: 'factorial',
    testCases: [
      { input: '5', expected: '120', status: 'pending' },
      { input: '0', expected: '1', status: 'pending' }
    ]
  },

  // --- ARRAYS / EASY ---
  {
    id: 'resonance-sum',
    title: 'Resonance Sum',
    difficulty: 'Easy',
    description: 'Given an array of integers, return the sum of all resonance points.',
    starterCode: 'return function sumArray(arr) {\n  // Calculate sum...\n}',
    fnName: 'sumArray',
    testCases: [
      { input: '[1,2,3,4,5]', expected: '15', status: 'pending' },
      { input: '[]', expected: '0', status: 'pending' }
    ]
  },

  // --- GRAPHS / MEDIUM ---
  {
    id: 'connectivity-matrix',
    title: 'Connectivity Matrix',
    difficulty: 'Medium',
    description: 'Determine if node A is connected to node B in a directed graph.',
    starterCode: 'return function isConnected(graph, start, end) {\n  // Implement BFS/DFS...\n}',
    fnName: 'isConnected',
    testCases: [
      { input: '{"0":[1],"1":[2],"2":[]}, 0, 2', expected: 'true', status: 'pending' },
      { input: '{"0":[1],"1":[],"2":[]}, 0, 2', expected: 'false', status: 'pending' }
    ]
  }
];

export function getProblemsByGimmick(gimmick: string): Problem[] {
  switch (gimmick) {
    case 'RECURSION_FOCUS':
      return PROBLEM_POOL.filter(p => p.id.includes('fibonacci') || p.id.includes('factorial'));
    case 'GRAPH_ONLY':
      return PROBLEM_POOL.filter(p => p.difficulty === 'Medium');
    default:
      return PROBLEM_POOL;
  }
}

export function getRandomProblem(difficulty?: string): Problem {
  const filtered = difficulty ? PROBLEM_POOL.filter(p => p.difficulty === difficulty) : PROBLEM_POOL;
  return filtered[Math.floor(Math.random() * filtered.length)];
}
