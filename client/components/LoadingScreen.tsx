import React, { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Panel } from "./SystemUI";

const LORE_TIPS = [
  "Tip: Dynamic Programming requires you to store past solutions. Remember the past, or be doomed to recalculate it.",
  "Tip: The Array Sentinel strikes in linear time. Ensure your complexity is optimal.",
  "Lore: The original architects built these halls using ancient binary trees.",
  "Tip: When lost in a graph, a Breadth-First Search will always find the shortest path out.",
];

export function LoadingScreen() {
  const [tip, setTip] = useState("");
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    setTip(LORE_TIPS[Math.floor(Math.random() * LORE_TIPS.length)]);
    
    // Simulate loading
    const interval = setInterval(() => {
      setProgress(p => {
        if (p >= 100) {
          clearInterval(interval);
          return 100;
        }
        return p + Math.floor(Math.random() * 15) + 5;
      });
    }, 400);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absolute inset-0 z-[200] w-full h-full bg-[#020408] overflow-hidden flex flex-col items-center justify-center p-6">
      
      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 30 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-[#F0A500] rounded-full shadow-[0_0_8px_#F0A500]"
            initial={{ 
              x: `${Math.random() * 100}vw`, 
              y: `${Math.random() * 100}vh`, 
              opacity: 0,
              scale: Math.random() * 0.5 + 0.2
            }}
            animate={{ 
              y: [null, `${Math.random() * -20 - 10}vh`],
              opacity: [0, Math.random() * 0.5 + 0.3, 0],
            }}
            transition={{ 
              duration: Math.random() * 5 + 3, 
              repeat: Infinity, 
              delay: Math.random() * 2,
              ease: "linear" 
            }}
          />
        ))}
      </div>

      <div className="relative z-10 flex flex-col items-center">
        {/* Animated Rune Circle */}
        <div className="relative w-32 h-32 flex items-center justify-center mb-12">
          {/* Thin gold ring */}
          <motion.div 
            className="absolute inset-0 rounded-full border border-[#F0A500]/40 shadow-[0_0_15px_rgba(240,165,0,0.2)]"
            animate={{ rotate: 360 }}
            transition={{ duration: 10, ease: "linear", repeat: Infinity }}
          >
            {/* Ticks on ring */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1 h-2 bg-[#F0A500]" />
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-2 bg-[#F0A500]" />
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-2 h-1 bg-[#F0A500]" />
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-1 bg-[#F0A500]" />
          </motion.div>
          
          {/* Inner Arcane Glyph */}
          <motion.div 
            className="text-6xl text-[#7C3AED] drop-shadow-[0_0_15px_rgba(124,58,237,0.8)] font-['Cinzel_Decorative']"
            animate={{ rotate: -360, opacity: [0.6, 1, 0.6] }}
            transition={{ 
              rotate: { duration: 15, ease: "linear", repeat: Infinity },
              opacity: { duration: 2, ease: "easeInOut", repeat: Infinity }
            }}
          >
            ᛉ
          </motion.div>
        </div>

        <h2 className="font-['Cinzel'] text-[12px] text-[#F0A500] tracking-[0.3em] uppercase mb-4 glow-orange">
          Loading Dungeon...
        </h2>

        {/* Progress Bar (Rune Frame Style) */}
        <Panel variant="rune" padding="compact" className="w-[300px] h-[30px] p-1 flex items-center mb-16">
          <div className="w-full h-full bg-[#0A0812] border border-[#2D2850] relative overflow-hidden">
            <motion.div 
              className="absolute top-0 left-0 h-full bg-gradient-to-r from-[#5B21B6] to-[#7C3AED] shadow-[0_0_15px_rgba(124,58,237,0.6)]"
              initial={{ width: "0%" }}
              animate={{ width: `${progress}%` }}
              transition={{ ease: "easeOut" }}
            >
              {/* Arcane pulse inside bar */}
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20 mix-blend-overlay animate-pulse" />
            </motion.div>
          </div>
        </Panel>

        {/* Lore Tip */}
        <motion.p 
          className="font-['Lato'] text-[13px] text-[#9D93C0] italic text-center max-w-md opacity-80"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          {tip}
        </motion.p>
      </div>

    </div>
  );
}
