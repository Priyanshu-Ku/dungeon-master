import React from "react";
import { motion } from "motion/react";
import { Pause } from "lucide-react";
import { Panel, Button } from "./SystemUI";

interface PauseMenuProps {
  onResume: () => void;
  onSettings?: () => void;
  onViewMap?: () => void;
  onQuit?: () => void;
}

export function PauseMenu({ onResume, onSettings, onViewMap, onQuit }: PauseMenuProps) {
  return (
    <div className="absolute inset-0 z-[150] w-full h-full bg-[#00000095] backdrop-blur-[2px] flex items-center justify-center">
      
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.2 }}
        className="relative z-10 w-full max-w-[360px]"
      >
        <Panel variant="rune" padding="standard" className="bg-[#13111C]">
          
          {/* Header */}
          <div className="flex flex-col items-center justify-center mb-8 gap-3">
            <Pause size={28} className="text-[#F0A500] drop-shadow-[0_0_10px_rgba(240,165,0,0.5)]" />
            <h2 className="font-['Cinzel'] text-[20px] text-[#F0A500] tracking-[0.2em] uppercase">
              Game Paused
            </h2>
            <div className="w-full h-px bg-gradient-to-r from-transparent via-[#2D2850] to-transparent" />
          </div>

          {/* Menu Items */}
          <div className="flex flex-col gap-3 mb-8">
            <Button variant="ghost" onClick={onResume} className="w-full text-center">Resume</Button>
            <Button variant="ghost" onClick={onSettings} className="w-full text-center">Settings</Button>
            <Button variant="ghost" onClick={onViewMap} className="w-full text-center">View Map</Button>
            <Button variant="ghost" onClick={onQuit} className="w-full text-center">Quit to Menu</Button>
          </div>

          {/* Footer */}
          <div className="text-center font-['Cinzel'] text-[10px] text-[#4B456A] tracking-widest">
            CAPSULE v1.0
          </div>
          
        </Panel>
      </motion.div>

    </div>
  );
}

