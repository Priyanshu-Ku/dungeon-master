/**
 * codeSandbox.ts
 * 
 * Isolated (browser-level) execution environment for algorithmic fragments.
 * Uses a temporary Worker to prevent the main thread from hanging on infinite loops.
 */

export interface SandboxResult {
  passed: boolean;
  actual?: any;
  error?: string;
  duration: number;
}

export async function executeCode(
  code: string, 
  fnName: string, 
  inputs: any[], 
  expected: any, 
  timeoutMs: number = 2000
): Promise<SandboxResult> {
  const start = performance.now();

  return new Promise((resolve) => {
    // Create a worker blob to execute the code safely
    const workerCode = `
      self.onmessage = function(e) {
        const { code, fnName, inputs } = e.data;
        try {
          // Reconstruct the function from string
          const userFn = new Function('return ' + code)();
          const result = userFn(...inputs);
          self.postMessage({ result });
        } catch (err) {
          self.postMessage({ error: err.message });
        }
      };
    `;

    const blob = new Blob([workerCode], { type: 'application/javascript' });
    const worker = new Worker(URL.createObjectURL(blob));

    const timeout = setTimeout(() => {
      worker.terminate();
      resolve({
        passed: false,
        error: 'EXECUTION_TIMEOUT: Logic recursion too deep.',
        duration: performance.now() - start
      });
    }, timeoutMs);

    worker.onmessage = (e) => {
      clearTimeout(timeout);
      worker.terminate();
      URL.revokeObjectURL(worker.objectURL);

      const { result, error } = e.data;
      if (error) {
        resolve({ passed: false, error, duration: performance.now() - start });
      } else {
        // Deep equality check (simplified for now)
        const passed = JSON.stringify(result) === JSON.stringify(expected);
        resolve({ passed, actual: result, duration: performance.now() - start });
      }
    };

    worker.postMessage({ code, fnName, inputs });
  });
}
