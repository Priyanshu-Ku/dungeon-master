"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Settings, Coins, Sword, Skull, Shield, Zap, 
  ChevronRight, Terminal, Hexagon, History
} from "lucide-react";
import { Panel, StatBar, Divider } from "./SystemUI";
import { DungeonMap } from "./DungeonMap";

interface DungeonHUDProps {
  onOpenInventory?: () => void;
  onOpenCoding?: () => void;
  onBackToMenu?: () => void;
  onOpenSettings?: () => void;
}

export function DungeonHUD({ onOpenInventory, onOpenCoding, onBackToMenu, onOpenSettings }: DungeonHUDProps) {
  const [showRetreatConfirm, setShowRetreatConfirm] = useState(false);
  const [logs] = useState([
    { id: "1", text: "Entered Sentinel Hall. The air grows cold.", type: "system" },
    { id: "2", text: "Spectral Knight manifests from the shadows!", type: "combat" },
    { id: "3", text: "You equipped: Obsidian Blade.", type: "item" },
    { id: "4", text: "A heavy silence falls over the ruins.", type: "flavor" },
  ]);

  return (
    <div className="absolute inset-0 z-40 bg-[#05040A] flex flex-col font-['Lato'] overflow-hidden select-none">
      {/* BACKGROUND ATMOSPHERE */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#7C3AED]/5 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#F0A500]/5 blur-[120px] rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      {/* HEADER BAR */}
      <header className="h-[52px] w-full bg-[#0C0A18]/80 backdrop-blur-md border-b border-[#F0A500]/30 flex items-center justify-between px-6 z-50">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full border border-[#F0A500] bg-[#13102A] overflow-hidden shadow-[0_0_10px_rgba(240,165,0,0.2)]">
            <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=CodeWielder" alt="Avatar" className="w-full h-full object-cover" />
          </div>
          <span className="text-[#F0A500] font-['Cinzel'] text-[14px] tracking-widest font-semibold uppercase drop-shadow-[0_0_8px_rgba(240,165,0,0.4)]">
            CodeWielder
          </span>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-1.5 mr-4">
            <div className="w-7 h-7 rounded-full border border-[#F0A500] flex items-center justify-center text-[10px] font-bold text-[#F0A500] font-['Cinzel'] bg-[#13102A] shadow-inner">
              3
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="w-[130px]">
              <StatBar type="hp" value={850} max={1000} label="HP" />
            </div>
            <div className="w-[110px]">
              <StatBar type="mp" value={220} max={300} label="MP" />
            </div>
            <div className="w-[150px]">
              <StatBar type="xp" value={450} max={600} label="XP" />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 group cursor-pointer">
            <Coins size={16} className="text-[#F0A500] group-hover:scale-110 transition-transform" />
            <span className="text-[#F0A500] font-['Cinzel'] text-[14px] font-bold tracking-tight">1,240</span>
          </div>
          <button 
            onClick={() => setShowRetreatConfirm(true)}
            className="flex items-center gap-2 px-3 py-1.5 border border-[#F87171]/30 hover:border-[#F87171] hover:bg-[#F87171]/10 rounded-sm transition-all group"
          >
            <History size={14} className="text-[#F87171] group-hover:rotate-[-45deg] transition-transform" />
            <span className="text-[#F87171] font-['Cinzel'] text-[10px] tracking-widest font-bold uppercase">Retreat</span>
          </button>
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
                <button 
                  onClick={() => setShowRetreatConfirm(false)}
                  className="flex-1 px-6 py-3 border border-[#4A3060] text-[#A78BFA] font-['Cinzel'] text-xs tracking-widest hover:bg-[#7C3AED10] transition-all"
                >
                  STAY AND FIGHT
                </button>
                <button 
                  onClick={() => {
                    setShowRetreatConfirm(false);
                    onBackToMenu?.();
                  }}
                  className="flex-1 px-6 py-3 bg-[#DC2626]/20 border border-[#DC2626] text-[#DC2626] font-['Cinzel'] text-xs tracking-widest hover:bg-[#DC2626]/30 transition-all"
                >
                  RETREAT
                </button>
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
          <Panel variant="default" padding="compact" className="h-[150px] bg-[#0C0A18]/60 backdrop-blur-sm flex flex-col border-[#7C3AED]/20">
            <div className="flex items-center justify-between mb-3 px-2 border-b border-[#7C3AED]/10 pb-2">
              <span className="text-[#7C3AED] font-['Cinzel'] text-[10px] tracking-[0.2em] uppercase font-bold flex items-center gap-2">
                <History size={12} />
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
          <Panel variant="rune" padding="standard" className="bg-[#13102A] border-[#F87171]/20 hover:border-[#F87171]/40 transition-colors">
            <div className="flex items-center gap-5 mb-5">
              <div className="w-14 h-14 bg-[#0C0A18] border border-[#F87171]/40 flex items-center justify-center rounded-[2px] text-[#F87171] relative group overflow-hidden">
                <div className="absolute inset-0 bg-[#F87171]/5 group-hover:bg-[#F87171]/10 transition-colors" />
                <Skull size={32} className="relative z-10 drop-shadow-[0_0_10px_rgba(248,113,113,0.5)]" />
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
              <div className="flex justify-between items-end px-1">
                <div className="flex flex-col">
                  <span className="text-[#F87171] text-[11px] font-bold uppercase tracking-[0.2em]">Spectral Knight</span>
                  <span className="text-[#4B456A] text-[9px] uppercase mt-0.5">Void Entity</span>
                </div>
                <span className="text-[#F87171] text-[12px] font-mono font-bold">80 / 80</span>
              </div>
              <div className="h-2.5 w-full bg-[#1A0A0A] rounded-full border border-[#7F1D1D]/50 p-0.5 overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: '100%' }}
                  className="h-full bg-gradient-to-r from-[#7F1D1D] via-[#DC2626] to-[#F87171] rounded-full" 
                />
              </div>
            </div>
          </Panel>

          {/* CARD 2: ABILITIES */}
          <Panel variant="stone" padding="standard" className="bg-[#0C0A18]/40 border-white/5">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[#F0A500] font-['Cinzel'] text-[10px] tracking-[0.25em] uppercase font-bold">
                ⚔️ Martial Arts
              </span>
              <span className="text-[#4B456A] text-[9px] font-mono">1/4 Active</span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <AbilityCard name="Code Strike" icon={<Sword size={18} />} active />
              <AbilityCard name="Array Shield" icon={<Shield size={18} />} locked />
              <AbilityCard name="Stack Over" icon={<Zap size={18} />} locked />
              <AbilityCard name="Binary View" icon={<Settings size={18} />} locked />
            </div>
          </Panel>

          {/* CARD 3: DUNGEON PROGRESS */}
          <Panel variant="default" padding="standard" className="bg-[#13102A] flex-1 flex flex-col border-[#7C3AED]/10 overflow-hidden">
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
        <button 
          onClick={onOpenCoding}
          className="flex items-center gap-3 px-6 h-10 bg-[#0C0A18] border border-[#7C3AED]/40 rounded-[2px] group hover:border-[#7C3AED] transition-all"
        >
          <Terminal size={18} className="text-[#7C3AED]" />
          <span className="text-[#E2D9F3] text-[11px] font-['Cinzel'] tracking-widest uppercase group-hover:text-white">Terminal [T]</span>
        </button>
        <button 
          onClick={onOpenInventory}
          className="flex items-center gap-3 px-6 h-10 bg-[#0C0A18] border border-[#F0A500]/40 rounded-[2px] group hover:border-[#F0A500] transition-all"
        >
          <Hexagon size={18} className="text-[#F0A500]" />
          <span className="text-[#E2D9F3] text-[11px] font-['Cinzel'] tracking-widest uppercase group-hover:text-white">Inventory [I]</span>
        </button>
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
          <Skull size={12} className={isCleared ? 'text-[#4B456A]' : 'text-[#F87171]'} />
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
