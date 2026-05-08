import { motion, AnimatePresence } from "motion/react";
import { Panel, Button, Divider } from "./SystemUI";
import { Sword, Zap, Shield, Sparkles } from "lucide-react";

interface Boon {
  id: string;
  title: string;
  type: "attack" | "utility" | "defense" | "legendary";
  description: string;
  icon: React.ElementType;
}

interface RewardBoonProps {
  isOpen: boolean;
  onSelect: (boon: Boon) => void;
}

export function RewardBoon({ isOpen, onSelect }: RewardBoonProps) {
  const boons: Boon[] = [
    {
      id: "1",
      title: "QUICK SORT BLADE",
      type: "attack",
      description: "Your physical attacks now deal O(n log n) damage. Critical hits trigger a recursive slash.",
      icon: Sword
    },
    {
      id: "2",
      title: "STACK SHIELD",
      type: "defense",
      description: "Last-in, first-out protection. Absorbs the most recent damage instance entirely.",
      icon: Shield
    },
    {
      id: "3",
      title: "ARCANE POINTER",
      type: "legendary",
      description: "Directly manipulate the memory of enemies. 15% chance to cause 'Segmentation Fault' (Instant Kill).",
      icon: Sparkles
    }
  ];

  const typeColors = {
    attack: "#EF4444",
    utility: "#7C3AED",
    defense: "#3B82F6",
    legendary: "#F0A500"
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          className="absolute inset-0 z-[150] flex flex-col items-center justify-center p-12 bg-[#07060F]/80 backdrop-blur-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div 
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            className="flex flex-col items-center max-w-5xl w-full"
          >
            <h2 className="text-[#F0A500] text-4xl mb-2 tracking-[0.2em] font-['Cinzel Decorative']" style={{ fontFamily: "'Cinzel Decorative', serif" }}>
              CHOOSE YOUR REWARD
            </h2>
            <p className="text-[#9D93C0] mb-12 font-['Cinzel'] tracking-widest uppercase text-sm">
              The Ancients grant you a Boon for your logic
            </p>

            <div className="flex gap-8 w-full justify-center">
              {boons.map((boon, index) => (
                <motion.div
                  key={boon.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + index * 0.1 }}
                  className="flex-1 max-w-[280px]"
                >
                  <div 
                    onClick={() => onSelect(boon)}
                    className="relative h-[450px] bg-[#0C0A18] border border-[#2D2850] group cursor-pointer hover:-translate-y-4 transition-all duration-500 hover:shadow-[0_20px_50px_rgba(0,0,0,0.8)] overflow-hidden"
                  >
                    {/* Top Type Accent */}
                    <div 
                      className="absolute top-0 left-0 right-0 h-2" 
                      style={{ backgroundColor: typeColors[boon.type] }}
                    />
                    
                    {/* Glow behind icon */}
                    <div 
                      className="absolute top-20 left-1/2 -translate-x-1/2 w-32 h-32 blur-[60px] opacity-20 transition-opacity group-hover:opacity-40"
                      style={{ backgroundColor: typeColors[boon.type] }}
                    />

                    <div className="relative z-10 flex flex-col items-center p-8 h-full text-center">
                      <div 
                        className="w-16 h-16 rounded-full border border-[#2D2850] flex items-center justify-center mb-8 mt-12 transition-transform duration-500 group-hover:scale-110"
                        style={{ color: typeColors[boon.type], borderColor: `${typeColors[boon.type]}40` }}
                      >
                        <boon.icon size={32} />
                      </div>

                      <h3 className="text-[#E2D9F3] text-xl font-['Cinzel'] tracking-widest mb-4 group-hover:text-white transition-colors">
                        {boon.title}
                      </h3>
                      
                      <div className="w-12 h-0.5 bg-[#2D2850] mb-6 group-hover:w-20 transition-all duration-500" />

                      <p className="text-[#9D93C0] text-sm font-['Lato'] leading-relaxed mb-auto group-hover:text-[#E2D9F3] transition-colors">
                        {boon.description}
                      </p>

                      <div className="mt-auto w-full pt-6">
                        <span className="text-[10px] tracking-[0.3em] uppercase" style={{ color: typeColors[boon.type] }}>
                          {boon.type}
                        </span>
                      </div>
                    </div>

                    {/* Background Decorative Text */}
                    <div className="absolute -bottom-4 -left-4 text-6xl font-black text-white/5 select-none rotate-12 group-hover:rotate-0 transition-transform duration-700">
                      {boon.type.toUpperCase()}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
