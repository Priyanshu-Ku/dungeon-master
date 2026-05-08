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
import { Leaderboard } from "@/components/Leaderboard";
import { PlayerProfile } from "@/components/PlayerProfile";
import { VictoryDefeatScreen } from "@/components/VictoryDefeatScreen";
import { LoadingScreen } from "@/components/LoadingScreen";
import { PauseMenu } from "@/components/PauseMenu";

type GameState = "menu" | "playing" | "design-system" | "settings";

export default function Home() {
  const [gameState, setGameState] = useState<GameState>("menu");
  const [isInventoryOpen, setIsInventoryOpen] = useState(false);
  const [isTerminalOpen, setIsTerminalOpen] = useState(false);
  const [isMapOpen, setIsMapOpen] = useState(false);
  const [isDialogueOpen, setIsDialogueOpen] = useState(false);
  const [isBoonOpen, setIsBoonOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isLeaderboardOpen, setIsLeaderboardOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isVictoryOpen, setIsVictoryOpen] = useState(false);
  const [isDefeatOpen, setIsDefeatOpen] = useState(false);
  const [isLoadingOpen, setIsLoadingOpen] = useState(false);
  const [isPauseOpen, setIsPauseOpen] = useState(false);
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
              
              {isLeaderboardOpen && (
                <Leaderboard onClose={() => setIsLeaderboardOpen(false)} />
              )}

              {isProfileOpen && (
                <PlayerProfile onClose={() => setIsProfileOpen(false)} />
              )}
              
              {isVictoryOpen && (
                <VictoryDefeatScreen 
                  result="victory" 
                  onContinue={() => setIsVictoryOpen(false)} 
                  onLeaderboard={() => { setIsVictoryOpen(false); setIsLeaderboardOpen(true); }}
                />
              )}

              {isDefeatOpen && (
                <VictoryDefeatScreen 
                  result="defeat" 
                  onRetry={() => setIsDefeatOpen(false)} 
                  onRetreat={() => setIsDefeatOpen(false)}
                />
              )}

              {isLoadingOpen && (
                <LoadingScreen />
              )}

              {isPauseOpen && (
                <PauseMenu 
                  onResume={() => setIsPauseOpen(false)} 
                  onSettings={() => { setIsPauseOpen(false); /* toggle settings */ }}
                  onViewMap={() => { setIsPauseOpen(false); setIsMapOpen(true); }}
                  onQuit={() => setIsPauseOpen(false)}
                />
              )}
            </AnimatePresence>

            {/* Dev Controls to toggle new screens */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-[300] pointer-events-auto opacity-20 hover:opacity-100 transition-opacity">
              <button onClick={() => setIsMapOpen(true)} className="px-2 py-1 bg-black text-[8px] text-white border border-white/20">MAP</button>
              <button onClick={() => setIsDialogueOpen(true)} className="px-2 py-1 bg-black text-[8px] text-white border border-white/20">TALK</button>
              <button onClick={() => setIsBoonOpen(true)} className="px-2 py-1 bg-black text-[8px] text-white border border-white/20">BOON</button>
              <button onClick={() => setIsLeaderboardOpen(true)} className="px-2 py-1 bg-black text-[8px] text-white border border-white/20">RANK</button>
              <button onClick={() => setIsProfileOpen(true)} className="px-2 py-1 bg-black text-[8px] text-white border border-white/20">PROFILE</button>
              <button onClick={() => setIsLoadingOpen(!isLoadingOpen)} className="px-2 py-1 bg-black text-[8px] text-white border border-white/20">LOAD</button>
              <button onClick={() => setIsPauseOpen(true)} className="px-2 py-1 bg-black text-[8px] text-white border border-white/20">PAUSE</button>
              <button onClick={() => setIsVictoryOpen(true)} className="px-2 py-1 bg-[#1A2E1A] text-[8px] text-[#4ADE80] border border-[#4ADE80]/30">WIN</button>
              <button onClick={() => setIsDefeatOpen(true)} className="px-2 py-1 bg-[#3A0F0F] text-[8px] text-[#F87171] border border-[#F87171]/30">LOSE</button>
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