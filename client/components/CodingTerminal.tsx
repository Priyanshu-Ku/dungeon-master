import { motion } from "motion/react";
import { X, Play, AlertCircle, Scroll, BookOpen, Sparkles } from "lucide-react";
import { useState } from "react";
import { Panel } from "./SystemUI";

interface CodingTerminalProps {
  onClose: () => void;
}

export function CodingTerminal({ onClose }: CodingTerminalProps) {
  const [isRunning, setIsRunning] = useState(false);
  const [hasError, setHasError] = useState(false);

  const handleRun = () => {
    setIsRunning(true);
    setHasError(false);
    
    // Simulate arcane manifestation
    setTimeout(() => {
      setIsRunning(false);
      setHasError(true);
    }, 1800);
  };

  return (
    <motion.div 
      className="absolute inset-0 bg-[#07060F]/95 backdrop-blur-2xl flex items-center justify-center p-12 z-50 overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Background Arcane Mists */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,#2D1B69_0%,#07060F_80%)] opacity-30" />
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10 pointer-events-none" />

      {/* Floating Runic Characters in Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-[0.03]">
        <div className="absolute top-10 left-20 text-9xl font-serif rotate-12">ᛉ</div>
        <div className="absolute bottom-20 right-40 text-9xl font-serif -rotate-12">ᚦ</div>
        <div className="absolute top-1/2 left-1/4 text-8xl font-serif rotate-45">ᚨ</div>
      </div>

      <div className="w-full max-w-6xl h-full max-h-[750px] relative">
        <Panel variant="stone" padding="none" topBorder="gold">
          
          {/* Header: The Obsidian Header */}
          <div className="flex justify-between items-center p-6 border-b border-[#2D2850]/50 bg-[#0C0A18]/80 relative">
            <div className="flex items-center gap-6">
              <div className="p-3 bg-[#13111C] border border-[#F0A500]/20 shadow-[0_0_15px_rgba(240,165,0,0.1)]">
                <BookOpen size={24} className="text-[#F0A500]" />
              </div>
              <div>
                <h2 className="text-[#F0A500] text-2xl tracking-[0.2em] font-black uppercase" style={{ fontFamily: "'Cinzel Decorative', serif" }}>
                  The Obsidian Obelisk
                </h2>
                <span className="text-[#9D93C0] text-[10px] tracking-[0.5em] uppercase font-bold opacity-60">
                  Oracle of Recursive Truth
                </span>
              </div>
            </div>
            
            <button 
              onClick={onClose} 
              className="text-[#9D93C0] hover:text-[#F0A500] transition-all hover:rotate-90 p-2 pointer-events-auto"
            >
              <X size={32} strokeWidth={1} />
            </button>
          </div>

          {/* Main Interface Split */}
          <div className="flex h-[calc(100%-100px)]">
            
            {/* Left: Challenge Scroll */}
            <div className="w-[35%] border-r border-[#2D2850]/30 p-10 flex flex-col bg-[#07060F]/40 overflow-y-auto">
              <div className="flex items-center gap-3 mb-8">
                <Scroll size={18} className="text-[#F0A500]" />
                <h3 className="text-[#E2D9F3] text-sm tracking-[0.3em] uppercase font-black font-['Cinzel']">
                  The Incantation
                </h3>
              </div>
              
              <div className="text-[#9D93C0] font-['Lato'] space-y-6 leading-relaxed">
                <p className="italic text-lg text-[#E2D9F3]/90">
                  "The Great Seal of the Stack Overseer demands a sequence of balance..."
                </p>
                <p className="text-[15px]">
                  Divine a function <span className="text-[#F0A500] font-bold">isValidSequence(arr)</span> that returns <span className="text-[#F0A500]">true</span> if the array strictly alternates between Light (Even) and Shadow (Odd) numbers.
                </p>
                
                <div className="bg-[#13111C] p-6 border-l-2 border-[#F0A500]/40 rounded-r-sm space-y-4">
                  <div className="text-xs">
                    <span className="text-[#F0A500] block mb-2 uppercase font-bold tracking-widest">Example 1</span>
                    <code className="text-[#E2D9F3] block">Input: [1, 2, 3, 4] → true</code>
                  </div>
                  <div className="text-xs">
                    <span className="text-[#F0A500] block mb-2 uppercase font-bold tracking-widest">Example 2</span>
                    <code className="text-[#E2D9F3] block">Input: [1, 3, 2] → false</code>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: The Arcane Editor */}
            <div className="flex-1 flex flex-col bg-[#0C0A18]/30">
              
              {/* Editor Workspace */}
              <div className="flex-1 p-10 overflow-y-auto font-mono text-[15px] relative">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/granite.png')] opacity-[0.02] pointer-events-none" />
                
                <div className="space-y-1 relative z-10">
                  <div className="flex gap-6 group">
                    <span className="w-8 text-[#2D2850] text-right text-xs">1</span>
                    <span className="text-[#7C3AED] font-bold">function</span> 
                    <span className="text-[#F0A500]">isValidSequence</span>(arr) {'{'}
                  </div>
                  <div className="flex gap-6">
                    <span className="w-8 text-[#2D2850] text-right text-xs">2</span>
                    <span className="text-[#9D93C0] italic opacity-40">{"// Divine the logic within..."}</span>
                  </div>
                  <div className="flex gap-6">
                    <span className="w-8 text-[#2D2850] text-right text-xs">3</span>
                    <span className="ml-8 text-[#7C3AED] font-bold">if</span> (arr.length {'<='} 1) 
                    <span className="text-[#7C3AED] font-bold"> return</span> 
                    <span className="text-[#F0A500] font-bold"> true</span>;
                  </div>
                  <div className="flex gap-6">
                    <span className="w-8 text-[#2D2850] text-right text-xs">4</span>
                  </div>
                  <div className="flex gap-6">
                    <span className="w-8 text-[#2D2850] text-right text-xs">5</span>
                    <span className="ml-8 text-[#7C3AED] font-bold">for</span> 
                    (<span className="text-[#7C3AED]">let</span> i = 1; i {'<'} arr.length; i++) {'{'}
                  </div>
                  <div className="flex gap-6 bg-[#7C3AED]/10 border-l-2 border-[#7C3AED]">
                    <span className="w-8 text-[#7C3AED] text-right text-xs">6</span>
                    <span className="ml-8 text-[#EF4444] font-bold">{"// OMEN: BALANCE BREACH DETECTED"}</span>
                  </div>
                  <div className="flex gap-6 bg-[#7C3AED]/5 relative">
                    <span className="w-8 text-[#2D2850] text-right text-xs">7</span>
                    <div className="ml-8 flex items-center">
                      <span className="text-[#E2D9F3]">
                        <span className="text-[#7C3AED] font-bold">if</span> (arr[i] % 2 === arr[i-1] % 2)
                      </span>
                      <motion.div 
                        animate={{ opacity: [1, 0] }} 
                        transition={{ repeat: Infinity, duration: 1 }}
                        className="w-2.5 h-5 bg-[#F0A500] ml-2 shadow-[0_0_10px_#F0A500]"
                      />
                    </div>
                  </div>
                  <div className="flex gap-6">
                    <span className="w-8 text-[#2D2850] text-right text-xs">8</span>
                    <span className="ml-16 text-[#7C3AED] font-bold">return</span> 
                    <span className="text-[#F0A500] font-bold"> false</span>;
                  </div>
                  <div className="flex gap-6">
                    <span className="w-8 text-[#2D2850] text-right text-xs">9</span>
                    <span className="ml-8">{'}'}</span>
                  </div>
                  <div className="flex gap-6">
                    <span className="w-8 text-[#2D2850] text-right text-xs">10</span>
                    <span className="ml-8 text-[#7C3AED] font-bold">return</span> 
                    <span className="text-[#F0A500] font-bold"> true</span>;
                  </div>
                  <div className="flex gap-6">
                    <span className="w-8 text-[#2D2850] text-right text-xs">11</span>
                    <span>{'}'}</span>
                  </div>
                </div>
              </div>

              {/* Oracle Feedback Footer */}
              <div className={`p-8 border-t transition-all duration-700 ${hasError ? 'border-[#EF4444]/50 bg-[#EF4444]/5' : 'border-[#2D2850]/50 bg-[#07060F]/60'}`}>
                <div className="flex justify-between items-center mb-6">
                  <div className="flex items-center gap-3">
                    <Sparkles size={16} className={hasError ? 'text-[#EF4444]' : 'text-[#F0A500]'} />
                    <span className={`text-xs uppercase tracking-[0.4em] font-black font-['Cinzel'] ${hasError ? 'text-[#EF4444]' : 'text-[#9D93C0]'}`}>
                      Oracle Resonance
                    </span>
                  </div>
                  
                  <button 
                    onClick={handleRun}
                    disabled={isRunning}
                    className="group relative pointer-events-auto active:scale-95 transition-all overflow-hidden"
                  >
                    <div className="px-10 py-3 bg-[#0C0A18] border border-[#F0A500]/40 text-[#F0A500] text-xs font-black tracking-[0.3em] uppercase font-['Cinzel'] group-hover:bg-[#F0A500]/10 transition-colors">
                      {isRunning ? 'Invoking...' : 'Invoke Spell'}
                    </div>
                  </button>
                </div>

                <div className="font-['Lato'] text-sm min-h-[60px]">
                  {isRunning && (
                    <motion.p 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-[#F0A500] italic"
                    >
                      "Incanting runes... searching for divine symmetry..."
                    </motion.p>
                  )}
                  
                  {!isRunning && hasError && (
                    <motion.div 
                      initial={{ y: 10, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      className="text-[#EF4444] space-y-2"
                    >
                      <div className="flex items-center gap-2 font-bold text-[#EF4444] font-['Cinzel'] tracking-widest text-[11px]">
                        <AlertCircle size={14} /> DARK OMEN DETECTED: TEST FAILED
                      </div>
                      <p className="text-xs italic opacity-80 pl-6">
                        "Your logic falters at [2, 4, 6]. The Light and Shadow have merged, breaking the required alternation."
                      </p>
                    </motion.div>
                  )}

                  {!isRunning && !hasError && (
                    <p className="text-[#9D93C0]/60 italic">
                      "The obelisk awaits your command. Divine the solution to pass the trial."
                    </p>
                  )}
                </div>
              </div>

            </div>
          </div>
        </Panel>
      </div>
    </motion.div>
  );
}
