import React from "react";
import { Star, Target, Swords, Flame, Coins, Lock, Zap, Shield, Eye, Activity, Box, CheckCircle2, XCircle } from "lucide-react";
import { Panel, Badge } from "./SystemUI";

interface PlayerProfileProps {
  onClose: () => void;
}

const mockRecentBattles = [
  { id: 1, name: "The Recursion Labyrinth", category: "DFS", result: "solved", xp: "+75 XP", time: "2h ago" },
  { id: 2, name: "Array Shift Mechanism", category: "Arrays", result: "solved", xp: "+20 XP", time: "5h ago" },
  { id: 3, name: "Dynamic Programming Vault", category: "DP", result: "failed", xp: "+0 XP", time: "1d ago" },
  { id: 4, name: "Graph Traversal Spire", category: "Graphs", result: "solved", xp: "+150 XP", time: "2d ago" },
  { id: 5, name: "Two Pointer Bridge", category: "Pointers", result: "solved", xp: "+40 XP", time: "3d ago" },
  { id: 6, name: "Hash Map Cache", category: "Hashing", result: "failed", xp: "+0 XP", time: "4d ago" },
  { id: 7, name: "Binary Tree Nodes", category: "Trees", result: "solved", xp: "+60 XP", time: "4d ago" },
];

const mockAbilities = [
  { id: 1, name: "Quick Sort Strike", icon: Zap, unlocked: true },
  { id: 2, name: "DFS Vision", icon: Eye, unlocked: true },
  { id: 3, name: "Memoization Shield", icon: Shield, unlocked: true },
  { id: 4, name: "Graph Walk", icon: Activity, unlocked: true },
  { id: 5, name: "Heap Smash", icon: Box, unlocked: false },
  { id: 6, name: "DP Mastery", icon: Star, unlocked: false },
  { id: 7, name: "Trie Sense", icon: Target, unlocked: false },
  { id: 8, name: "Segment Tree", icon: Swords, unlocked: false },
  { id: 9, name: "Bitwise Aura", icon: Flame, unlocked: false },
];

export function PlayerProfile({ onClose }: PlayerProfileProps) {
  // Generate mock contribution data (364 days = 52 weeks * 7 days)
  const generateHistory = () => {
    const history = [];
    for (let w = 0; w < 52; w++) {
      const week = [];
      for (let d = 0; d < 7; d++) {
        const rand = Math.random();
        let state = "empty";
        if (rand > 0.95) state = "multiple";
        else if (rand > 0.8) state = "solved";
        else if (rand > 0.7) state = "attempted";
        week.push(state);
      }
      history.push(week);
    }
    return history;
  };
  const historyData = generateHistory();
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  return (
    <div className="absolute inset-0 z-50 w-full h-full bg-[#020408] overflow-y-auto flex justify-center pb-20">
      {/* Close Button */}
      <button 
        onClick={onClose}
        className="absolute top-8 right-8 text-[#9D93C0] hover:text-[#F0A500] transition-colors p-2 z-[60]"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
      </button>

      <div className="w-full max-w-[1200px] flex flex-col relative z-10 pt-8 px-6">
        
        {/* PROFILE BANNER */}
        <div className="w-full h-[240px] relative rounded-t-lg mt-8 mb-16 border border-[#2D2850] overflow-visible bg-[#13111C]">
          {/* Background Textures */}
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')] opacity-20 mix-blend-overlay rounded-t-lg" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#020408] to-transparent rounded-t-lg" />
          
          {/* Faint Rune Watermark */}
          <div className="absolute inset-0 flex items-center justify-center opacity-5 overflow-hidden pointer-events-none">
            <span className="font-['Cinzel_Decorative'] text-[200px] text-[#7C3AED]">ᛉ ᚨ ᚦ</span>
          </div>

          <div className="absolute bottom-0 w-full px-12 pb-6 flex justify-between items-end">
            <div className="flex items-end gap-6 relative translate-y-8">
              {/* Avatar overlaps bottom */}
              <div className="w-[80px] h-[80px] rounded-full relative z-20 bg-[#0C0A18] flex items-center justify-center">
                <div className="absolute inset-0 rounded-full border-[3px] border-[#F0A500] shadow-[0_0_15px_rgba(240,165,0,0.5)] z-10" />
                <div className="absolute inset-[3px] rounded-full border-2 border-[#7C3AED] z-10" />
                <span className="font-['Cinzel'] text-3xl text-[#E2D9F3] z-20">CW</span>
              </div>
              
              <div className="mb-8">
                <h1 className="font-['Cinzel_Decorative'] text-3xl md:text-[36px] text-[#F0A500] m-0 leading-none mb-2 glow-orange">
                  CodeWielder
                </h1>
                <div className="flex items-center gap-4">
                  <span className="px-3 py-1 bg-[#1A0F35] border border-[#7C3AED] rounded-full font-['Cinzel'] text-[10px] text-[#A78BFA] tracking-widest uppercase shadow-[0_0_10px_rgba(124,58,237,0.2)]">
                    Arcane Warrior
                  </span>
                  <span className="font-['Lato'] text-[12px] text-[#9D93C0]">
                    Joined March 2025
                  </span>
                </div>
              </div>
            </div>

            {/* Total XP Right Side */}
            <div className="text-right mb-6">
              <div className="font-['Cinzel'] text-[36px] text-[#F0A500] font-bold glow-orange leading-none mb-1">
                12,480 XP
              </div>
              <div className="font-['Cinzel'] text-[10px] text-[#9D93C0] tracking-[0.3em] uppercase">
                Total Experience
              </div>
            </div>
          </div>
        </div>

        {/* STAT CARD ROW */}
        <div className="grid grid-cols-5 gap-4 mb-12">
          {[
            { label: "TOTAL XP", value: "12,480", icon: Star },
            { label: "PROBLEMS SOLVED", value: "342", icon: Target },
            { label: "DUNGEONS CLEARED", value: "12", icon: Swords },
            { label: "STREAK", value: "14", icon: Flame },
            { label: "GOLD EARNED", value: "8,950", icon: Coins },
          ].map((stat, i) => (
            <Panel key={i} variant="stone" padding="compact" className="flex flex-col items-center justify-center text-center py-6 h-full">
              <div className="text-[#F0A500] mb-3 shadow-[0_0_8px_rgba(240,165,0,0.5)] rounded-full">
                <stat.icon size={28} />
              </div>
              <div className="font-['Cinzel'] text-[22px] font-bold text-[#F0A500] leading-tight mb-1">
                {stat.value}
              </div>
              <div className="font-['Cinzel'] text-[10px] text-[#9D93C0] tracking-widest uppercase">
                {stat.label}
              </div>
            </Panel>
          ))}
        </div>

        {/* MIDDLE SECTION: ABILITIES & RECENT BATTLES */}
        <div className="grid grid-cols-[60%_calc(40%-24px)] gap-6 mb-12">
          
          {/* ABILITIES UNLOCKED */}
          <div className="flex flex-col gap-4">
            <h2 className="font-['Cinzel'] text-[14px] text-[#E2D9F3] tracking-[0.2em] uppercase border-b border-[#2D2850] pb-2 px-2 flex items-center">
              Abilities Unlocked
            </h2>
            <Panel variant="default" padding="standard" className="h-full">
              <div className="grid grid-cols-3 gap-4">
                {mockAbilities.map((ability) => (
                  <div key={ability.id} className="flex flex-col items-center gap-2">
                    <div className={`relative w-[64px] h-[64px] rounded-md border flex items-center justify-center transition-all ${
                      ability.unlocked 
                        ? "bg-[#13111C] border-[#F0A500] shadow-[0_0_15px_rgba(240,165,0,0.2)]" 
                        : "bg-[#0A0812] border-[#2D2850] opacity-50 grayscale"
                    }`}>
                      {ability.unlocked && <div className="absolute inset-0 rounded-md border-[2px] border-[#F0A500] mix-blend-overlay" />}
                      <ability.icon size={28} className={ability.unlocked ? "text-[#F0A500] z-10" : "text-[#4B456A] z-10"} />
                      {!ability.unlocked && (
                        <div className="absolute inset-0 bg-[#020408]/60 flex items-center justify-center z-20">
                          <Lock size={20} className="text-[#9D93C0]" />
                        </div>
                      )}
                    </div>
                    <span className={`font-['Cinzel'] text-[10px] text-center uppercase tracking-wider ${ability.unlocked ? 'text-[#E2D9F3]' : 'text-[#4B456A]'}`}>
                      {ability.name}
                    </span>
                  </div>
                ))}
              </div>
            </Panel>
          </div>

          {/* RECENT BATTLES */}
          <div className="flex flex-col gap-4 h-[350px]">
             <h2 className="font-['Cinzel'] text-[14px] text-[#E2D9F3] tracking-[0.2em] uppercase border-b border-[#2D2850] pb-2 px-2">
              Recent Battles
            </h2>
            <Panel variant="default" padding="compact" className="flex-1 overflow-hidden flex flex-col">
              <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                <div className="flex flex-col">
                  {mockRecentBattles.slice(0, 6).map((battle) => (
                    <div key={battle.id} className="group flex items-center justify-between p-3 border-b border-[#2D2850]/50 hover:bg-[#1A1830]/50 hover:border-l-2 hover:border-l-[#7C3AED] transition-all cursor-pointer">
                      <div className="flex flex-col gap-1">
                        <div className="font-['Cinzel'] text-[13px] text-[#E2D9F3] group-hover:text-[#F0A500] transition-colors line-clamp-1">
                          {battle.name}
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="category">{battle.category}</Badge>
                          <span className="font-['Lato'] text-[11px] text-[#9D93C0]">{battle.time}</span>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-1 min-w-[70px]">
                        <div className="flex items-center gap-1 font-['Lato'] text-[11px] font-bold">
                          {battle.result === "solved" ? (
                            <><CheckCircle2 size={16} className="text-[#4ADE80]" /> <span className="text-[#4ADE80]">Solved</span></>
                          ) : (
                            <><XCircle size={16} className="text-[#F87171]" /> <span className="text-[#F87171]">Failed</span></>
                          )}
                        </div>
                        <span className="font-['Cinzel'] text-[12px] font-bold text-[#F0A500]">
                          {battle.xp}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Panel>
          </div>
        </div>

        {/* CHALLENGE HISTORY */}
        <div className="flex flex-col gap-4 mb-12">
          <h2 className="font-['Cinzel'] text-[12px] text-[#7C3AED] tracking-[0.2em] uppercase px-2 drop-shadow-[0_0_8px_rgba(124,58,237,0.4)]">
            Challenge History
          </h2>
          <Panel variant="stone" padding="standard" className="w-full overflow-x-auto custom-scrollbar">
            <div className="min-w-[850px]">
              {/* Months */}
              <div className="flex ml-[30px] mb-2">
                {months.map((m, i) => (
                  <div key={i} className="flex-1 font-['Lato'] text-[10px] text-[#9D93C0]">{m}</div>
                ))}
              </div>
              
              <div className="flex">
                {/* Day Labels */}
                <div className="flex flex-col justify-between text-[#9D93C0] font-['Lato'] text-[10px] w-[30px] py-[6px]">
                  <span className="invisible">Sun</span>
                  <span>Mon</span>
                  <span className="invisible">Tue</span>
                  <span>Wed</span>
                  <span className="invisible">Thu</span>
                  <span>Fri</span>
                  <span className="invisible">Sat</span>
                </div>
                
                {/* Grid */}
                <div className="flex gap-[3px]">
                  {historyData.map((week, w) => (
                    <div key={w} className="flex flex-col gap-[3px]">
                      {week.map((dayState, d) => {
                        let tileClass = "w-[12px] h-[12px] rounded-[2px] ";
                        if (dayState === "empty") {
                          tileClass += "bg-[#13102A]";
                        } else if (dayState === "attempted") {
                          tileClass += "bg-[#3A0F0F]";
                        } else if (dayState === "solved") {
                          tileClass += "bg-[#0F1A0F] border border-[#F0A500]/50 shadow-[inset_0_0_4px_rgba(240,165,0,0.3)]";
                        } else if (dayState === "multiple") {
                          tileClass += "bg-[#1A2E1A] border border-[#F0A500] shadow-[inset_0_0_8px_rgba(240,165,0,0.6),0_0_4px_rgba(240,165,0,0.4)]";
                        }
                        return <div key={d} className={tileClass} />;
                      })}
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="flex items-center justify-end gap-2 mt-4 font-['Lato'] text-[10px] text-[#9D93C0]">
                <span>Less</span>
                <div className="w-[12px] h-[12px] rounded-[2px] bg-[#13102A]" />
                <div className="w-[12px] h-[12px] rounded-[2px] bg-[#3A0F0F]" />
                <div className="w-[12px] h-[12px] rounded-[2px] bg-[#0F1A0F] border border-[#F0A500]/50 shadow-[inset_0_0_4px_rgba(240,165,0,0.3)]" />
                <div className="w-[12px] h-[12px] rounded-[2px] bg-[#1A2E1A] border border-[#F0A500] shadow-[inset_0_0_8px_rgba(240,165,0,0.6)]" />
                <span>More</span>
              </div>
            </div>
          </Panel>
        </div>

      </div>

      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #0C0A18;
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #2D2850;
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #7C3AED;
        }
      `}} />
    </div>
  );
}
