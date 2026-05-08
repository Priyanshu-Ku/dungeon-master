import { motion } from "motion/react";
import { Terminal, X, Play, AlertTriangle } from "lucide-react";
import { useState } from "react";

interface CodingTerminalProps {
  onClose: () => void;
}

export function CodingTerminal({ onClose }: CodingTerminalProps) {
  const [isRunning, setIsRunning] = useState(false);
  const [hasError, setHasError] = useState(false);

  const handleRun = () => {
    setIsRunning(true);
    setHasError(false);
    
    // Simulate run time and then an error
    setTimeout(() => {
      setIsRunning(false);
      setHasError(true);
    }, 1500);
  };

  return (
    <motion.div 
      className="absolute inset-0 bg-[#07060F]/95 backdrop-blur-xl flex items-center justify-center p-8 z-50"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4, ease: "circOut" }}
    >
      {/* Scanline Overlay specific to terminal */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-10"
        style={{
          background: "linear-gradient(transparent 50%, rgba(0,0,0,0.25) 50%)",
          backgroundSize: "100% 4px"
        }}
      />

      <div className="w-full max-w-5xl h-full max-h-[700px] bg-[#0D1117] border border-[#22D3EE]/30 shadow-[0_0_30px_rgba(34,211,238,0.1)] flex flex-col relative overflow-hidden font-mono">
        
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-[#22D3EE]/20 bg-[#13102A]">
          <div className="flex items-center gap-3">
            <Terminal size={20} className="text-[#22D3EE]" />
            <h2 className="text-[#22D3EE] font-medium tracking-wider">
              SYS.OVERRIDE // GATE_04
            </h2>
          </div>
          <button onClick={onClose} className="text-[#C9D1D9] hover:text-[#22D3EE] transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 flex overflow-hidden">
          
          {/* Instructions (Left) */}
          <div className="w-1/3 border-r border-[#22D3EE]/20 p-6 flex flex-col bg-[#07060F]/50">
            <h3 className="text-[#E2D9F3] text-lg mb-4" style={{ fontFamily: "'Cinzel', serif" }}>
              CHALLENGE ALGORITHM
            </h3>
            
            <div className="text-[#C9D1D9] text-sm space-y-4 font-mono leading-relaxed">
              <p>
                The door mechanism requires a valid sequence to open.
              </p>
              <p>
                Write a function <span className="text-[#4ADE80]">isValidSequence(arr)</span> that returns true if the array strictly alternates between even and odd numbers.
              </p>
              
              <div className="bg-[#13102A] p-3 border border-[#2D2850] text-xs">
                <span className="text-[#7A5A10] block mb-1">Example 1:</span>
                Input: [1, 2, 3, 4]<br/>
                Output: true
              </div>
              
              <div className="bg-[#13102A] p-3 border border-[#2D2850] text-xs">
                <span className="text-[#7A5A10] block mb-1">Example 2:</span>
                Input: [1, 3, 2]<br/>
                Output: false
              </div>
            </div>
          </div>

          {/* Code Editor (Right) */}
          <div className="w-2/3 flex flex-col relative">
            
            {/* Mock Editor Area */}
            <div className="flex-1 p-6 overflow-y-auto text-[#C9D1D9] text-sm leading-relaxed whitespace-pre font-mono">
              <div className="flex">
                <div className="w-8 text-[#2D2850] select-none text-right pr-4">1</div>
                <div><span className="text-[#7C3AED]">function</span> <span className="text-[#3B82F6]">isValidSequence</span>(arr) {'{'}</div>
              </div>
              <div className="flex">
                <div className="w-8 text-[#2D2850] select-none text-right pr-4">2</div>
                <div>  <span className="text-[#9D93C0]">{"// Write your logic here"}</span></div>
              </div>
              <div className="flex">
                <div className="w-8 text-[#2D2850] select-none text-right pr-4">3</div>
                <div>  <span className="text-[#7C3AED]">if</span> (arr.length {'<='} 1) <span className="text-[#7C3AED]">return</span> <span className="text-[#F0A500]">true</span>;</div>
              </div>
              <div className="flex">
                <div className="w-8 text-[#2D2850] select-none text-right pr-4">4</div>
                <div>  </div>
              </div>
              <div className="flex">
                <div className="w-8 text-[#2D2850] select-none text-right pr-4">5</div>
                <div>  <span className="text-[#7C3AED]">for</span> (<span className="text-[#7C3AED]">let</span> i = 1; i {'<'} arr.length; i++) {'{'}</div>
              </div>
              <div className="flex bg-[#22D3EE]/10 relative">
                {/* Active line highlight */}
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#22D3EE]" />
                <div className="w-8 text-[#22D3EE] select-none text-right pr-4">6</div>
                <div>    <span className="text-[#9D93C0]">{"// ERROR IN LOGIC BELOW"}</span></div>
              </div>
              <div className="flex bg-[#22D3EE]/5">
                <div className="w-8 text-[#2D2850] select-none text-right pr-4">7</div>
                <div className="flex items-center">
                  <span>    <span className="text-[#7C3AED]">if</span> (arr[i] % 2 === arr[i-1] % 2)</span>
                  {/* Blinking Cursor */}
                  <motion.div 
                    animate={{ opacity: [1, 0] }} 
                    transition={{ repeat: Infinity, duration: 0.8 }}
                    className="w-2 h-4 bg-[#22D3EE] ml-1 inline-block align-middle"
                  />
                </div>
              </div>
              <div className="flex">
                <div className="w-8 text-[#2D2850] select-none text-right pr-4">8</div>
                <div>      <span className="text-[#7C3AED]">return</span> <span className="text-[#F0A500]">false</span>;</div>
              </div>
              <div className="flex">
                <div className="w-8 text-[#2D2850] select-none text-right pr-4">9</div>
                <div>  {'}'}</div>
              </div>
              <div className="flex">
                <div className="w-8 text-[#2D2850] select-none text-right pr-4">10</div>
                <div>  <span className="text-[#7C3AED]">return</span> <span className="text-[#F0A500]">true</span>;</div>
              </div>
              <div className="flex">
                <div className="w-8 text-[#2D2850] select-none text-right pr-4">11</div>
                <div>{'}'}</div>
              </div>
            </div>

            {/* Console Output (Glitch effect on error) */}
            <div className={`h-48 border-t ${hasError ? 'border-[#EF4444]' : 'border-[#2D2850]'} bg-[#07060F] p-4 flex flex-col`}>
              <div className="flex justify-between items-center mb-2">
                <span className={`text-xs uppercase tracking-widest ${hasError ? 'text-[#EF4444]' : 'text-[#9D93C0]'}`}>
                  Console Output
                </span>
                <button 
                  onClick={handleRun}
                  disabled={isRunning}
                  className="flex items-center gap-2 px-4 py-1.5 bg-[#22D3EE]/10 border border-[#22D3EE] text-[#22D3EE] text-xs uppercase hover:bg-[#22D3EE]/20 transition-colors disabled:opacity-50"
                >
                  {isRunning ? 'Executing...' : <><Play size={12} /> Execute Code</>}
                </button>
              </div>
              
              <div className="flex-1 font-mono text-sm overflow-y-auto">
                {isRunning && <span className="text-[#22D3EE]">Compiling sequence...</span>}
                
                {!isRunning && hasError && (
                  <motion.div 
                    initial={{ x: -10, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    className="text-[#EF4444] flex flex-col gap-1"
                  >
                    <div className="flex items-center gap-2">
                      <AlertTriangle size={14} />
                      <span className="font-bold">RUNTIME ERROR:</span> Test case failed.
                    </div>
                    <span className="text-[#EF4444]/80 text-xs ml-5">
                      Expected: false | Received: true<br/>
                      Input: [2, 4, 6]
                    </span>
                    {/* Fake Glitch artifact */}
                    <div className="absolute bottom-4 right-4 text-[10px] text-[#EF4444]/40 select-none">
                      ERR_OVERFLOW_0x892A
                    </div>
                  </motion.div>
                )}

                {!isRunning && !hasError && (
                  <span className="text-[#9D93C0]">Ready. Awaiting execution.</span>
                )}
              </div>
            </div>

          </div>
        </div>
      </div>
    </motion.div>
  );
}
