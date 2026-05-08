"use client";

import { useState } from "react";
import { AnimatePresence } from "motion/react";
import { StartMenu } from "@/components/StartMenu";
import { HUD } from "@/components/HUD";
import { Inventory } from "@/components/Inventory";
import { CodingTerminal } from "@/components/CodingTerminal";
import { GameWrapper } from "@/components/GameWrapper";
import { DesignSystemViewer } from "@/components/DesignSystemViewer";

type GameState = "menu" | "playing" | "design-system";

export default function Home() {
  const [gameState, setGameState] = useState<GameState>("menu");
  const [isInventoryOpen, setIsInventoryOpen] = useState(false);
  const [isTerminalOpen, setIsTerminalOpen] = useState(false);

  const handleStartGame = (action: string) => {
    if (action === "design") {
      setGameState("design-system");
    } else {
      setGameState("playing");
    }
  };

  const toggleInventory = () => setIsInventoryOpen(!isInventoryOpen);
  const toggleTerminal = () => setIsTerminalOpen(!isTerminalOpen);

  return (
    <main className="relative w-screen h-screen overflow-hidden">
      <AnimatePresence mode="wait">
        {gameState === "menu" && (
          <StartMenu key="menu" onStart={handleStartGame} />
        )}

        {gameState === "design-system" && (
          <DesignSystemViewer key="design" onBack={() => setGameState("menu")} />
        )}

        {gameState === "playing" && (
          <GameWrapper key="game">
            <HUD 
              isActive={!isInventoryOpen && !isTerminalOpen}
              onOpenInventory={toggleInventory}
              onOpenCoding={toggleTerminal}
            />
            
            <AnimatePresence>
              {isInventoryOpen && (
                <Inventory onClose={toggleInventory} />
              )}
              
              {isTerminalOpen && (
                <CodingTerminal onClose={toggleTerminal} />
              )}
            </AnimatePresence>
          </GameWrapper>
        )}
      </AnimatePresence>
    </main>
  );
}