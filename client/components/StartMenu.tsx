import { motion } from "motion/react";
import { useState } from "react";

interface StartMenuProps {
  onStart: (action: string) => void;
}

export function StartMenu({ onStart }: StartMenuProps) {
  const [isHovering, setIsHovering] = useState<string | null>(null);

  const menuItems = [
    { id: "continue", label: "CONTINUE JOURNEY" },
    { id: "new", label: "NEW EXPEDITION" },
    { id: "design", label: "UI COMPENDIUM" },
    { id: "settings", label: "SYSTEM SETTINGS" },
    { id: "exit", label: "EXIT TO DESKTOP" }
  ];

  return (
    <motion.div 
      className="absolute inset-0 flex flex-col items-center justify-center z-50 bg-[#07060F]/60 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1.5 }}
    >
      {/* Cinematic Vignette specific to title screen */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_0%,#07060F_80%)]" />

      <div className="relative z-10 flex flex-col items-center">
        {/* Game Title */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1.5, delay: 0.5 }}
          className="text-center mb-24"
        >
          <h2 className="text-[#F0A500] text-sm tracking-[0.5em] mb-4" style={{ fontFamily: "'Cinzel', serif" }}>
            A TALE OF ALGORITHMS
          </h2>
          <h1 
            className="text-7xl text-[#E2D9F3] tracking-widest text-shadow-lg drop-shadow-[0_0_25px_rgba(240,165,0,0.3)]"
            style={{ fontFamily: "'Cinzel Decorative', serif" }}
          >
            CAPSULE
          </h1>
          <div className="w-full h-px bg-gradient-to-r from-transparent via-[#7A5A10] to-transparent mt-8 opacity-50" />
        </motion.div>

        {/* Menu Items */}
        <motion.div 
          className="flex flex-col items-center gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.5 }}
        >
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={item.id === "new" || item.id === "continue" || item.id === "design" ? () => onStart(item.id) : undefined}
              onMouseEnter={() => setIsHovering(item.id)}
              onMouseLeave={() => setIsHovering(null)}
              className="relative px-8 py-3 group"
              style={{ fontFamily: "'Cinzel', serif" }}
            >
              <span className={`relative z-10 text-lg tracking-[0.2em] transition-colors duration-300 ${isHovering === item.id ? 'text-[#F0A500]' : 'text-[#9D93C0]'}`}>
                {item.label}
              </span>
              
              {/* Hover effect graphics */}
              <motion.div 
                className="absolute inset-0 border-y border-[#7A5A10] bg-[#1E1A35]/20"
                initial={{ opacity: 0, scaleX: 0.8 }}
                animate={{ 
                  opacity: isHovering === item.id ? 1 : 0,
                  scaleX: isHovering === item.id ? 1 : 0.8
                }}
                transition={{ duration: 0.2 }}
              />
              
              {/* Side diamonds */}
              {isHovering === item.id && (
                <>
                  <motion.div layoutId="left-diamond" className="absolute left-0 top-1/2 -translate-y-1/2 w-2 h-2 rotate-45 bg-[#F0A500] shadow-[0_0_10px_#F0A500]" />
                  <motion.div layoutId="right-diamond" className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 rotate-45 bg-[#F0A500] shadow-[0_0_10px_#F0A500]" />
                </>
              )}
            </button>
          ))}
        </motion.div>
      </div>
    </motion.div>
  );
}
