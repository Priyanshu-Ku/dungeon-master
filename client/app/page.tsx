"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { StartMenu } from "@/components/StartMenu";
import { DungeonHUD } from "@/components/DungeonHUD";
import { Inventory } from "@/components/Inventory";
import { CodingTerminal } from "@/components/CodingTerminal";
import { GameWrapper } from "@/components/GameWrapper";
import { DesignSystemViewer } from "@/components/DesignSystemViewer";
import { WorldMap } from "@/components/WorldMap";
import { DialogueSystem } from "@/components/DialogueSystem";
import { RewardBoon } from "@/components/RewardBoon";
import { SettingsOverlay } from "@/components/SettingsOverlay";
import AuthModal from "@/components/AuthModal";

type GameState = "menu" | "playing" | "design-system" | "settings";

export default function Home() {
  const [gameState, setGameState] = useState<GameState>("menu");
  const [isInventoryOpen, setIsInventoryOpen] = useState(false);
  const [isTerminalOpen, setIsTerminalOpen] = useState(false);
  const [isMapOpen, setIsMapOpen] = useState(false);
  const [isDialogueOpen, setIsDialogueOpen] = useState(false);
  const [isBoonOpen, setIsBoonOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const handleStartGame = (action: string) => {
    if (action === "exit") {
      alert("Exiting to Desktop... (Mock)");
      return;
    }

    setIsTransitioning(true);
    
    // Delay actual state switch to allow exit animations to play
    setTimeout(() => {
      if (action === "design") {
        setGameState("design-system");
      } else if (action === "settings") {
        setGameState("settings");
      } else {
        setGameState("playing");
      }
      // Keep flash for a moment after switch
      setTimeout(() => setIsTransitioning(false), 500);
    }, 1500);
  };

  const handleBackToMenu = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setGameState("menu");
      setTimeout(() => setIsTransitioning(false), 500);
    }, 1500);
  };

  const toggleInventory = () => setIsInventoryOpen(!isInventoryOpen);
  const toggleTerminal = () => setIsTerminalOpen(!isTerminalOpen);

  return (
    <main className="relative w-screen h-screen overflow-hidden">
      <AnimatePresence mode="wait">
        {gameState === "menu" && (
          <StartMenu 
            key="menu" 
            onStart={handleStartGame} 
            onOpenAuth={() => setIsAuthOpen(true)}
          />
        )}

        {gameState === "design-system" && (
          <DesignSystemViewer key="design" onBack={handleBackToMenu} />
        )}

        {gameState === "settings" && (
          <SettingsOverlay key="settings" onBack={handleBackToMenu} />
        )}

        {gameState === "playing" && (
          <GameWrapper key="game">
            <DungeonHUD 
              onOpenInventory={toggleInventory}
              onOpenCoding={toggleTerminal}
              onBackToMenu={handleBackToMenu}
              onOpenSettings={() => handleStartGame("settings")}
            />
            
            <AnimatePresence>
              {isInventoryOpen && (
                <Inventory onClose={toggleInventory} />
              )}
              
              {isTerminalOpen && (
                <CodingTerminal onClose={toggleTerminal} />
              )}

              {isMapOpen && (
                <WorldMap isOpen={isMapOpen} onClose={() => setIsMapOpen(false)} />
              )}

              {isDialogueOpen && (
                <DialogueSystem isOpen={isDialogueOpen} onClose={() => setIsDialogueOpen(false)} />
              )}

              {isBoonOpen && (
                <RewardBoon isOpen={isBoonOpen} onSelect={() => setIsBoonOpen(false)} />
              )}
            </AnimatePresence>

            {/* Dev Controls to toggle new screens */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-[300] pointer-events-auto opacity-20 hover:opacity-100 transition-opacity">
              <button onClick={() => setIsMapOpen(true)} className="px-2 py-1 bg-black text-[8px] text-white border border-white/20">MAP</button>
              <button onClick={() => setIsDialogueOpen(true)} className="px-2 py-1 bg-black text-[8px] text-white border border-white/20">TALK</button>
              <button onClick={() => setIsBoonOpen(true)} className="px-2 py-1 bg-black text-[8px] text-white border border-white/20">BOON</button>
            </div>
          </GameWrapper>
        )}
      </AnimatePresence>

      {/* Auth Modal */}
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />

      {/* Cinematic Transition Flash Overlay */}
      <AnimatePresence>
        {isTransitioning && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="absolute inset-0 z-[100] pointer-events-none bg-white"
            style={{ mixBlendMode: 'screen' }}
          >
            <div className="absolute inset-0 bg-gradient-radial from-white via-[#F0A500]/20 to-transparent" />
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}