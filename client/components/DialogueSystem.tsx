import { motion, AnimatePresence } from "motion/react";
import { PortraitFrame, Panel } from "./SystemUI";
import { useState, useEffect } from "react";

interface DialogueStep {
  name: string;
  text: string;
  image: string;
  side: "left" | "right";
}

interface DialogueSystemProps {
  isOpen: boolean;
  onClose: () => void;
}

export function DialogueSystem({ isOpen, onClose }: DialogueSystemProps) {
  const [currentStep, setCurrentStep] = useState(0);

  const steps: DialogueStep[] = [
    {
      name: "ARCH-MAGUS KADIN",
      text: "The Obsidian Gate does not yield to brute force, traveler. It requires the logic of the Ancients to decipher its runes.",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Kadin&backgroundColor=0c0a18",
      side: "left"
    },
    {
      name: "KAELEN",
      text: "I've faced recursive loops before. This will be no different.",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Kaelen&backgroundColor=0c0a18",
      side: "right"
    },
    {
      name: "ARCH-MAGUS KADIN",
      text: "Confidence is a double-edged blade. The sequence must alternate perfectly, or the stack will overflow and consume you.",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Kadin&backgroundColor=0c0a18",
      side: "left"
    }
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onClose();
    }
  };

  const step = steps[currentStep];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          className="absolute inset-0 z-[100] flex flex-col justify-end p-12 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Backdrop Shadow Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#07060F] via-transparent to-transparent opacity-80" />

          <div className="relative flex items-end justify-center gap-8 w-full max-w-6xl mx-auto pointer-events-auto">
            
            {/* Left Portrait */}
            <motion.div 
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className={step.side === 'left' ? 'z-20' : 'z-10'}
            >
              <PortraitFrame 
                name="ARCH-MAGUS KADIN" 
                image="https://api.dicebear.com/7.x/avataaars/svg?seed=Kadin&backgroundColor=0c0a18" 
                active={step.side === 'left'}
              />
            </motion.div>

            {/* Dialogue Box */}
            <motion.div 
              className="flex-1 mb-4"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              onClick={handleNext}
            >
              <Panel variant="stone" padding="modal" className="cursor-pointer group relative overflow-hidden">
                {/* Hades Style Corner Accents */}
                <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-[#F0A500] opacity-40 group-hover:opacity-100 transition-opacity" />
                <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-[#F0A500] opacity-40 group-hover:opacity-100 transition-opacity" />
                
                <div className="flex flex-col gap-2">
                  <span className="text-[#F0A500] font-['Cinzel'] text-xs tracking-[0.3em] uppercase">
                    {step.name}
                  </span>
                  <p className="text-[#E2D9F3] text-xl font-['Lato'] leading-relaxed min-h-[80px]">
                    {step.text}
                  </p>
                  
                  <div className="flex justify-end items-center gap-2 mt-4">
                    <span className="text-[#9D93C0] text-[10px] tracking-widest uppercase font-['Lato'] animate-pulse">
                      Click to continue
                    </span>
                    <div className="w-2 h-2 bg-[#F0A500] rotate-45 shadow-[0_0_8px_#F0A500]" />
                  </div>
                </div>
              </Panel>
            </motion.div>

            {/* Right Portrait */}
            <motion.div 
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className={step.side === 'right' ? 'z-20' : 'z-10'}
            >
              <PortraitFrame 
                name="KAELEN" 
                image="https://api.dicebear.com/7.x/avataaars/svg?seed=Kaelen&backgroundColor=0c0a18" 
                active={step.side === 'right'}
                side="right"
              />
            </motion.div>

          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
