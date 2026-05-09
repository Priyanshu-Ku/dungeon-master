"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Settings, Coins, Sword, Skull, Shield, Zap, 
  ChevronRight, Terminal, Hexagon, History
} from "lucide-react";
import { Panel, StatBar, Divider, Button } from "./SystemUI";
import { DungeonMap } from "./DungeonMap";
import { useGameStore } from "@/stores/useGameStore";

interface DungeonHUDProps {
  onOpenInventory?: () => void;
  onOpenCoding?: () => void;
  onBackToMenu?: () => void;
  onOpenSettings?: () => void;
}

export function DungeonHUD({ onOpenInventory, onOpenCoding, onBackToMenu, onOpenSettings }: DungeonHUDProps) {
  const phase = useGameStore((state) => state.phase);
  const stats = useGameStore((state) => state.playerStats);
  const syncLeetCode = useGameStore((state) => state.syncLeetCode);

  const [showRetreatConfirm, setShowRetreatConfirm] = useState(false);
  const [logs, setLogs] = useState([
    { id: "1", text: "Entered Sentinel Hall. The air grows cold.", type: "system" },
    { id: "2", text: "Spectral Knight manifests from the shadows!", type: "combat" },
    { id: "3", text: "You equipped: Obsidian Blade.", type: "item" },
    { id: "4", text: "A heavy silence falls over the ruins.", type: "flavor" },
  ]);

  const hasResonanceUnlock = stats.badges.length > 0; 
  const [lastUnlockState, setLastUnlockState] = useState(hasResonanceUnlock);

  React.useEffect(() => {
    if (hasResonanceUnlock && !lastUnlockState) {
      const resonanceLog = {
        id: Date.now().toString(),
        text: "Resonance detected: Achievement recognized. A hidden path opens in the depths.",
        type: "system"
      };
      setLogs(prev => [resonanceLog, ...prev]);
      setLastUnlockState(true);
    }
  }, [hasResonanceUnlock, lastUnlockState]);

  return (
    <div className={`absolute inset-0 z-40 flex flex-col font-['Lato'] overflow-hidden select-none transition-all duration-700 ${phase === 'CODING' ? 'opacity-30 pointer-events-none blur-sm' : 'opacity-100 bg-transparent'}`}>
      {/* BACKGROUND ATMOSPHERE */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#7C3AED]/5 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#F0A500]/5 blur-[120px] rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      {/* HEADER BAR */}
      <header className="h-[52px] w-full bg-[#0C0A18]/80 backdrop-blur-md border-b border-[#F0A500]/30 flex items-center justify-between px-6 z-50">
          <motion.div 
            animate={stats.syncStatus === 'success' ? {
              boxShadow: ["0 0 10px #7C3AED", "0 0 30px #7C3AED", "0 0 10px #7C3AED"],
              borderColor: ["#F0A500", "#7C3AED", "#F0A500"]
            } : {}}
            transition={{ repeat: Infinity, duration: 2 }}
            className="w-9 h-9 rounded-full border border-[#F0A500] bg-[#13102A] overflow-hidden shadow-[0_0_10px_rgba(240,165,0,0.2)] cursor-pointer"
            onClick={() => syncLeetCode("priyanshu-ku")}
          >
            <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=CodeWielder" alt="Avatar" className="w-full h-full object-cover" />
          </motion.div>
          <div className="flex flex-col">
            <span className="text-[#F0A500] font-['Cinzel'] text-[14px] tracking-widest font-semibold uppercase drop-shadow-[0_0_8px_rgba(240,165,0,0.4)]">
              CodeWielder
            </span>
            {stats.syncStatus === 'syncing' && <span className="text-[8px] text-[#7C3AED] animate-pulse">Syncing...</span>}
          </div>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-1.5 mr-4">
            <div className="w-7 h-7 rounded-full border border-[#F0A500] flex items-center justify-center text-[10px] font-bold text-[#F0A500] font-['Cinzel'] bg-[#13102A] shadow-inner">
              {stats.level}
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="w-[130px]">
              <StatBar type="hp" value={stats.hp} max={stats.maxHp} label="HP" />
            </div>
            <div className="w-[110px]">
              <StatBar type="mp" value={stats.mp} max={stats.maxMp} label="MP" />
            </div>
            <div className="w-[150px]">
              <StatBar type="xp" value={stats.xp} max={stats.maxXp} label="XP" />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 group cursor-pointer">
            <Coins size={16} className="text-[#F0A500] group-hover:scale-110 transition-transform" />
            <span className="text-[#F0A500] font-['Cinzel'] text-[14px] font-bold tracking-tight">1,240</span>
          </div>
          <Button 
            variant="danger"
            onClick={() => setShowRetreatConfirm(true)}
            className="!py-1.5 !px-3 !text-[10px]"
          >
            <History size={16} className="text-[#F87171] group-hover:rotate-[-45deg] transition-transform" />
            <span>Retreat</span>
          </Button>
          <button 
            onClick={onOpenSettings}
            className="text-[#4B456A] hover:text-[#F0A500] transition-colors p-1.5 rounded-full hover:bg-[#F0A500]/10"
          >
            <Settings size={20} />
          </button>
        </div>
      </header>

      {/* Confirmation Overlay */}
      <AnimatePresence>
        {showRetreatConfirm && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/80 backdrop-blur-sm pointer-events-auto"
          >
            <Panel className="max-w-md w-full text-center space-y-8" topBorder="gold">
              <div className="space-y-4">
                <h2 className="text-[#F0A500] text-2xl tracking-[0.2em] font-['Cinzel Decorative']">RETREAT TO SANCTUM?</h2>
                <p className="text-[#9D93C0] font-['Lato'] text-sm leading-relaxed">
                  The darkness of the dungeon will reclaim your current progress. 
                  Are you certain you wish to return to the safety of the ancient gates?
                </p>
              </div>
              <div className="flex gap-4">
                <Button 
                  variant="ghost"
                  onClick={() => setShowRetreatConfirm(false)}
                  className="flex-1"
                >
                  STAY AND FIGHT
                </Button>
                <Button 
                  variant="danger"
                  onClick={() => {
                    setShowRetreatConfirm(false);
                    onBackToMenu?.();
                  }}
                  className="flex-1"
                >
                  RETREAT
                </Button>
              </div>
            </Panel>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MAIN LAYOUT */}
      <div className="flex-1 flex gap-5 p-5 overflow-hidden relative">
        {/* CENTER-LEFT PANEL (60%) */}
        <div className="w-[62%] flex flex-col gap-5">
          <Panel variant="stone" padding="standard" className="flex-1 flex flex-col relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#7C3AED]/30 to-transparent" />
            
            <div className="flex items-center justify-between mb-4 px-2">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#7C3AED] animate-ping" />
                <span className="text-[#7C3AED] font-['Cinzel'] text-[10px] tracking-[0.25em] uppercase font-bold">
                  🗺️ System Map — Sector 01
                </span>
              </div>
              <span className="text-[#4B456A] text-[9px] font-mono tracking-widest uppercase">Depth: 124m</span>
            </div>
            
            <div className="flex-1 min-h-0 bg-black/20 rounded-sm border border-white/5 overflow-hidden">
              <DungeonMap />
            </div>
          </Panel>

          {/* ADVENTURE LOG */}
          <Panel variant="default" padding="compact" className="h-[150px] flex flex-col border-[#7C3AED]/20">
            <div className="flex items-center justify-between mb-3 px-2 border-b border-[#7C3AED]/10 pb-2">
              <span className="text-[#7C3AED] font-['Cinzel'] text-[10px] tracking-[0.2em] uppercase font-bold flex items-center gap-2">
                <History size={16} />
                Event Log
              </span>
              <button className="text-[9px] text-[#4B456A] hover:text-[#7C3AED] uppercase tracking-widest">Clear</button>
            </div>
            <div className="flex-1 overflow-y-auto space-y-2 pr-3 custom-scrollbar scroll-smooth">
              {logs.map((log, i) => (
                <motion.div 
                  initial={{ x: -10, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: i * 0.1 }}
                  key={log.id} 
                  className={`text-[12px] pl-4 relative ${i === 0 ? 'text-[#E2D9F3]' : 'text-[#4B456A]'}`}
                >
                  <div className={`absolute left-0 top-1.5 w-1.5 h-1.5 rounded-full ${i === 0 ? 'bg-[#7C3AED] shadow-[0_0_8px_#7C3AED]' : 'bg-[#2D2850]'}`} />
                  <span className="font-mono text-[10px] mr-2 opacity-50">[{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}]</span>
                  {log.text}
                </motion.div>
              ))}
            </div>
          </Panel>
        </div>

        {/* RIGHT SIDEBAR (38%) */}
        <div className="w-[38%] flex flex-col gap-5">
          {/* CARD 1: CURRENT ROOM */}
          <Panel variant="rune" padding="standard" className="border-[#F87171]/20 hover:border-[#F87171]/40 transition-colors">
            <div className="flex items-center gap-5 mb-5">
              <div className="w-14 h-14 bg-[#0C0A18] border border-[#F87171]/40 flex items-center justify-center rounded-[2px] text-[#F87171] relative group overflow-hidden">
                <div className="absolute inset-0 bg-[#F87171]/5 group-hover:bg-[#F87171]/10 transition-colors" />
                <Skull size={28} className="relative z-10 drop-shadow-[0_0_10px_rgba(248,113,113,0.5)]" />
              </div>
              <div className="flex flex-col">
                <h3 className="text-[#F0A500] font-['Cinzel'] text-[18px] font-bold tracking-widest">
                  Sentinel Hall
                </h3>
                <div className="flex items-center gap-2 mt-1">
                  <span className="bg-[#450A0A] text-[#F87171] border border-[#F87171]/30 text-[9px] px-2.5 py-0.5 rounded-sm uppercase tracking-widest font-bold">
                    Combat Phase
                  </span>
                  <span className="text-[#4B456A] text-[9px] font-mono">ID: RM-102</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <StatBar type="hp" value={80} max={80} label="Spectral Knight" />
            </div>
          </Panel>

          {/* CARD 2: ABILITIES */}
          <Panel variant="stone" padding="standard" className="border-white/5">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[#F0A500] font-['Cinzel'] text-[10px] tracking-[0.25em] uppercase font-bold">
                ⚔️ Martial Arts
              </span>
              <span className="text-[#4B456A] text-[9px] font-mono">1/4 Active</span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <AbilityCard name="Code Strike" icon={<Sword size={20} />} active />
              <AbilityCard name="Array Shield" icon={<Shield size={20} />} locked />
              <AbilityCard name="Stack Over" icon={<Zap size={20} />} locked />
              <AbilityCard name="Binary View" icon={<Settings size={20} />} locked />
            </div>
          </Panel>

          {/* CARD 3: DUNGEON PROGRESS */}
          <Panel variant="default" padding="standard" className="flex-1 flex flex-col border-[#7C3AED]/10 overflow-hidden">
            <div className="flex items-center justify-between mb-5">
              <span className="text-[#7C3AED] font-['Cinzel'] text-[10px] tracking-[0.25em] uppercase font-bold">
                🎯 Objectives
              </span>
              <div className="flex gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-[#4ADE80]" />
                <div className="w-1.5 h-1.5 rounded-full bg-[#2D2850]" />
                <div className="w-1.5 h-1.5 rounded-full bg-[#2D2850]" />
              </div>
            </div>
            <div className="space-y-5 flex-1 overflow-y-auto pr-3 custom-scrollbar">
              <ProgressRow name="Defeat Ruins Spider" status="cleared" />
              <ProgressRow name="Breach Sentinel Hall" status="active" />
              <ProgressRow name="Locate Void Key" status="active" />
              <ProgressRow name="Vanquish Shadow Scribe" status="active" />
            </div>
          </Panel>
        </div>
      </div>

      {/* FOOTER ACTION BAR */}
      <footer className="h-[60px] bg-gradient-to-t from-[#0C0A18] to-transparent flex items-center justify-center gap-6 px-10 pb-2">
        <Button 
          variant="ghost"
          onClick={onOpenCoding}
        >
          <Terminal size={20} className="text-[#7C3AED]" />
          <span>Terminal [T]</span>
        </Button>
        <Button 
          variant="ghost"
          onClick={onOpenInventory}
        >
          <Hexagon size={20} className="text-[#F0A500]" />
          <span className="text-[#F0A500]">Inventory [I]</span>
        </Button>
      </footer>
    </div>
  );
}

function AbilityCard({ name, icon, active, locked }: { name: string, icon: React.ReactNode, active?: boolean, locked?: boolean }) {
  return (
    <div className={`
      h-16 border rounded-sm p-2 flex flex-col items-center justify-center gap-1 transition-all
      ${locked ? 'bg-black/40 border-[#2D2850] opacity-40 grayscale' : 'bg-[#0C0A18] border-[#7C3AED]/30 hover:border-[#7C3AED] hover:shadow-[0_0_15px_#7C3AED20] cursor-pointer'}
    `}>
      <div className={`${active ? 'text-[#7C3AED]' : 'text-[#4B456A]'}`}>
        {icon}
      </div>
      <span className="text-[9px] font-['Cinzel'] tracking-tighter text-[#9D93C0] text-center line-clamp-1">{name}</span>
    </div>
  );
}

function ProgressRow({ name, status }: { name: string, status: "cleared" | "active" }) {
  const isCleared = status === "cleared";
  return (
    <div className="space-y-1.5">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Skull size={16} className={isCleared ? 'text-[#4B456A]' : 'text-[#F87171]'} />
          <span className={`text-[12px] font-['Lato'] ${isCleared ? 'text-[#4B456A] line-through' : 'text-[#E2D9F3]'}`}>{name}</span>
        </div>
        <span className={`text-[9px] font-bold uppercase tracking-tighter ${isCleared ? 'text-[#4ADE80]' : 'text-[#FACC15]'}`}>
          {isCleared ? 'Defeated ✅' : '⚠️ Active'}
        </span>
      </div>
      <div className="h-1 w-full bg-black/40 rounded-full overflow-hidden">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: isCleared ? '100%' : '0%' }}
          className={`h-full ${isCleared ? 'bg-[#4ADE80]' : 'bg-[#FACC15]'}`} 
        />
      </div>
    </div>
  );
}
