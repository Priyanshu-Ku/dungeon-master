"use client";

import { useState } from "react";
import { GameWrapper } from "../components/GameWrapper";
import { HUD } from "../components/HUD";
import { Inventory } from "../components/Inventory";
import { CodingTerminal } from "../components/CodingTerminal";
import { StartMenu } from "../components/StartMenu";
import { DesignSystemViewer } from "../components/DesignSystemViewer";
import { AnimatePresence } from "motion/react";

type GameState =
  | "START"
  | "HUD"
  | "INVENTORY"
  | "CODING"
  | "DESIGN_SYSTEM";

export default function App() {
  const [gameState, setGameState] =
    useState<GameState>("START");

  const handleStartMenuAction = (action: string) => {
    if (action === "design") {
      setGameState("DESIGN_SYSTEM");
    } else {
      setGameState("HUD");
    }
  };

  return (
    <GameWrapper>
      <AnimatePresence mode="wait">
        {gameState === "START" && (
          <StartMenu
            key="start"
            onStart={handleStartMenuAction}
          />
        )}
      </AnimatePresence>

      {/* 
        The HUD is active when we are in HUD, INVENTORY, or CODING.
      */}
      {(gameState === "HUD" ||
        gameState === "INVENTORY" ||
        gameState === "CODING") && (
          <HUD
            isActive={gameState === "HUD"}
            onOpenInventory={() => setGameState("INVENTORY")}
            onOpenCoding={() => setGameState("CODING")}
          />
        )}

      <AnimatePresence>
        {gameState === "INVENTORY" && (
          <Inventory
            key="inventory"
            onClose={() => setGameState("HUD")}
          />
        )}

        {gameState === "CODING" && (
          <CodingTerminal
            key="coding"
            onClose={() => setGameState("HUD")}
          />
        )}

        {gameState === "DESIGN_SYSTEM" && (
          <DesignSystemViewer
            key="design"
            onBack={() => setGameState("START")}
          />
        )}
      </AnimatePresence>
    </GameWrapper>
  );
}