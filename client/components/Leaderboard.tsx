import React, { useState } from "react";
import { Trophy, Crown, ChevronDown, Flame, Hourglass } from "lucide-react";
import { Panel, Button } from "./SystemUI";

interface LeaderboardPlayer {
  rank: number;
  id: string;
  username: string;
  avatarInitials: string;
  xp: number;
  solved: number;
  fastest: string;
  streak: number;
  isCurrentUser?: boolean;
}

const mockTop3: LeaderboardPlayer[] = [
  { rank: 1, id: "u1", username: "ArchMage_Zero", avatarInitials: "AZ", xp: 12480, solved: 32, fastest: "1m 12s", streak: 14 },
  { rank: 2, id: "u2", username: "ByteKnight", avatarInitials: "BK", xp: 11200, solved: 28, fastest: "1m 45s", streak: 8 },
  { rank: 3, id: "u3", username: "NullPointer", avatarInitials: "NP", xp: 10550, solved: 25, fastest: "2m 05s", streak: 5 },
];

const mockTableData: LeaderboardPlayer[] = [
  { rank: 4, id: "u4", username: "CodeWeaver", avatarInitials: "CW", xp: 9800, solved: 24, fastest: "2m 10s", streak: 3 },
  { rank: 5, id: "u5", username: "SyntaxSorcerer", avatarInitials: "SS", xp: 9500, solved: 22, fastest: "2m 30s", streak: 12 },
  { rank: 6, id: "u6", username: "LogicLord", avatarInitials: "LL", xp: 8900, solved: 20, fastest: "3m 15s", streak: 2 },
  { rank: 42, id: "u42", username: "WanderingCoder", avatarInitials: "WC", xp: 4200, solved: 12, fastest: "5m 20s", streak: 7, isCurrentUser: true },
  { rank: 7, id: "u7", username: "HeapHero", avatarInitials: "HH", xp: 8500, solved: 19, fastest: "3m 40s", streak: 4 },
];

export function Leaderboard({ onClose, isEmpty = false }: { onClose: () => void, isEmpty?: boolean }) {
  const [timeFilter, setTimeFilter] = useState<"All Time" | "This Week" | "Today">("All Time");

  const renderPodiumCard = (player: LeaderboardPlayer, variant: "gold" | "silver" | "bronze") => {
    const isGold = variant === "gold";
    const isSilver = variant === "silver";
    const isBronze = variant === "bronze";

    const heightClass = isGold ? "h-[260px]" : isSilver ? "h-[234px]" : "h-[208px]"; // 100%, 90%, 80%
    const borderClass = isGold ? "border-[#F0A500]" : isSilver ? "border-[#C0C0C0]" : "border-[#CD7F32]";
    const textClass = isGold ? "text-[#F0A500]" : isSilver ? "text-[#C0C0C0]" : "text-[#CD7F32]";
    const glowClass = isGold ? "shadow-[0_0_20px_rgba(240,165,0,0.3)]" : isSilver ? "shadow-[0_0_15px_rgba(192,192,192,0.2)]" : "shadow-[0_0_15px_rgba(205,127,50,0.2)]";

    return (
      <div className={`relative w-[200px] flex flex-col justify-end ${heightClass}`}>
        {isGold && (
          <div className="absolute -top-10 left-1/2 -translate-x-1/2 text-[#F0A500]">
            <Crown size={28} />
          </div>
        )}
        <div className={`absolute -top-6 left-1/2 -translate-x-1/2 w-14 h-14 rounded-full border-2 ${borderClass} bg-[#0C0A18] flex items-center justify-center z-10 overflow-hidden`}>
           <span className={`font-['Cinzel'] text-[20px] ${textClass}`}>{player.avatarInitials}</span>
        </div>
        
        <Panel variant="stone" className={`h-[calc(100%-20px)] pt-10 flex flex-col items-center ${glowClass} ${isGold ? 'border-t-2 ' + borderClass : ''}`}>
          <div className={`font-['Cinzel'] text-2xl font-bold mb-2 ${textClass}`}>#{player.rank}</div>
          <div className="font-['Cinzel'] text-[14px] text-[#E2D9F3] mb-3">{player.username}</div>
          <div className={`font-['Cinzel'] text-[16px] font-bold mb-auto ${isGold ? 'text-[#F0A500]' : 'text-[#E2D9F3]'}`}>{player.xp.toLocaleString()} XP</div>
          
          <div className="flex gap-3 text-center mb-4">
            <div className="flex flex-col">
              <span className="font-['Lato'] text-[11px] text-[#9D93C0]">{player.solved} Solved</span>
            </div>
            <div className="w-[1px] h-full bg-[#2D2850]"></div>
            <div className="flex flex-col">
              <span className="font-['Lato'] text-[11px] text-[#9D93C0] flex items-center gap-1">
                <Flame size={16} className="text-[#F0A500]"/> {player.streak} Streak
              </span>
            </div>
          </div>
        </Panel>
      </div>
    );
  };

  return (
    <div className="absolute inset-0 z-50 w-full h-full bg-[#020408] overflow-y-auto flex justify-center py-12 px-6">
      {/* Close Button */}
      <button 
        onClick={onClose}
        className="absolute top-8 right-8 text-[#9D93C0] hover:text-[#F0A500] transition-colors p-2 z-[60]"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
      </button>
      
      <div className="w-full max-w-[1200px] flex flex-col items-center relative z-10 min-h-max pb-20">
        
        {/* PAGE HEADER */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-12 h-12 mb-4 flex items-center justify-center text-[#F0A500] shadow-[0_0_15px_rgba(240,165,0,0.5)] rounded-full">
            <Trophy size={28} />
          </div>
          <h1 className="font-['Cinzel_Decorative'] text-4xl md:text-5xl text-[#F0A500] tracking-[0.3em] uppercase mb-2 glow-orange">
            Hall of Legends
          </h1>
          <p className="font-['Lato'] text-[14px] text-[#9D93C0] uppercase tracking-widest">
            Top Algorithm Warriors This Season
          </p>
        </div>

        {/* FILTER ROW */}
        <div className="w-full flex justify-between items-center mt-8 mb-12">
          <div className="flex gap-2 p-1 bg-[#0C0A18] border border-[#2D2850] rounded-full">
            {["All Time", "This Week", "Today"].map((filter) => (
              <button
                key={filter}
                onClick={() => setTimeFilter(filter as any)}
                className={`px-6 py-2 rounded-full text-xs font-['Cinzel'] tracking-widest uppercase transition-all duration-300 ${
                  timeFilter === filter
                    ? "bg-[#7C3AED] text-white shadow-[0_0_15px_rgba(124,58,237,0.4)] border border-[#A78BFA]/50"
                    : "bg-transparent text-[#9D93C0] hover:text-white"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
          
          <button className="flex items-center gap-2 px-4 py-2 text-[#9D93C0] hover:text-white transition-colors border border-transparent hover:border-[#2D2850] rounded-md font-['Cinzel'] text-[13px] tracking-wider">
            All Challenges <ChevronDown size={16} />
          </button>
        </div>

        {/* TOP 3 PODIUM */}
        <div className="flex items-end justify-center gap-6 mt-8 mb-16 h-[300px]">
          {renderPodiumCard(mockTop3[1], "silver")}
          {renderPodiumCard(mockTop3[0], "gold")}
          {renderPodiumCard(mockTop3[2], "bronze")}
        </div>

        {/* LEADERBOARD TABLE */}
        <div className="w-full mt-8">
          {isEmpty ? (
            <div className="w-full bg-[#0C0A18]/80 border border-[#2D2850] rounded-lg overflow-hidden backdrop-blur-sm p-16 flex flex-col items-center justify-center text-center shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
              <div className="mb-6 opacity-60 w-12 h-12 flex items-center justify-center text-[#9D93C0]">
                <Hourglass size={28} />
              </div>
              <h3 className="text-[#9D93C0] text-[18px] font-['Cinzel'] tracking-widest mb-2">
                No warriors have risen yet.
              </h3>
              <p className="text-[#4B456A] text-[13px] font-['Lato'] mb-8">
                Complete your first challenge to claim a rank.
              </p>
              <Button variant="primary" onClick={onClose}>
                Begin First Challenge
              </Button>
            </div>
          ) : (
            <div className="w-full bg-[#0C0A18]/80 border border-[#2D2850] rounded-t-lg overflow-hidden backdrop-blur-sm">
              {/* Table Header */}
              <div className="flex w-full border-b border-[#2D2850] bg-[#13111C]/80 px-6 py-4">
                <div className="w-[60px] font-['Cinzel'] text-[10px] text-[#9D93C0] uppercase tracking-widest">Rank</div>
                <div className="flex-1 font-['Cinzel'] text-[10px] text-[#9D93C0] uppercase tracking-widest pl-4">Player</div>
                <div className="w-[120px] font-['Cinzel'] text-[10px] text-[#9D93C0] uppercase tracking-widest text-right">XP</div>
                <div className="w-[100px] font-['Cinzel'] text-[10px] text-[#9D93C0] uppercase tracking-widest text-right">Solved</div>
                <div className="w-[120px] font-['Cinzel'] text-[10px] text-[#9D93C0] uppercase tracking-widest text-right">Fastest</div>
                <div className="w-[100px] font-['Cinzel'] text-[10px] text-[#9D93C0] uppercase tracking-widest text-right">Streak</div>
              </div>

              {/* Table Body */}
              <div className="flex flex-col">
                {mockTableData.map((player, idx) => (
                  <div 
                    key={player.id}
                    className={`flex w-full px-6 py-3 items-center border-b border-[#2D2850]/50 transition-colors ${
                      player.isCurrentUser 
                        ? "bg-[#7C3AED]/10 border-l-[3px] border-l-[#7C3AED]" 
                        : idx % 2 === 0 ? "bg-[#0C0A18]" : "bg-[#0E0C1B]"
                    } hover:bg-[#1A1830]`}
                  >
                    {/* Rank */}
                    <div className={`w-[60px] font-['Cinzel'] text-[14px] font-bold ${player.rank <= 5 ? 'text-[#F0A500]' : 'text-[#9D93C0]'}`}>
                      #{player.rank}
                    </div>
                    
                    {/* Player */}
                    <div className="flex-1 flex items-center gap-3 pl-4">
                      <div className="w-8 h-8 rounded-full bg-[#13111C] border border-[#2D2850] flex items-center justify-center overflow-hidden">
                         <span className="font-['Cinzel'] text-[12px] text-[#E2D9F3]">{player.avatarInitials}</span>
                      </div>
                      <span className={`font-['Cinzel'] text-[14px] ${player.isCurrentUser ? 'text-[#F0A500]' : 'text-[#E2D9F3]'}`}>
                        {player.username}
                      </span>
                    </div>
                    
                    {/* XP */}
                    <div className={`w-[120px] font-['Lato'] text-[14px] font-bold text-right ${player.rank <= 5 ? 'text-[#F0A500]' : 'text-[#E2D9F3]'}`}>
                      {player.xp.toLocaleString()}
                    </div>
                    
                    {/* Solved */}
                    <div className="w-[100px] flex items-center justify-end gap-2 text-right">
                      <span className="font-['Lato'] text-[14px] text-[#E2D9F3]">{player.solved}</span>
                      <div className="w-8 h-1 bg-[#2D2850] rounded-full overflow-hidden">
                        <div className="h-full bg-[#00d4ff]" style={{ width: `${Math.min(100, (player.solved / 50) * 100)}%` }}></div>
                      </div>
                    </div>
                    
                    {/* Fastest */}
                    <div className="w-[120px] font-['Fira_Code'] text-[13px] text-[#9D93C0] text-right">
                      {player.fastest}
                    </div>
                    
                    {/* Streak */}
                    <div className="w-[100px] flex justify-end">
                      <div className={`px-2 py-1 rounded-[4px] text-[11px] font-bold flex items-center gap-1 ${
                        player.streak >= 7 ? 'bg-[#ff6b35]/20 text-[#ff6b35] border border-[#ff6b35]/30' : 'bg-[#2D2850]/50 text-[#9D93C0]'
                      }`}>
                        <Flame size={16} className={player.streak >= 7 ? 'text-[#ff6b35]' : 'text-[#9D93C0]'}/>
                        {player.streak} days
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* PAGINATION */}
        <div className="flex gap-2 mt-8">
          <button className="w-8 h-8 flex items-center justify-center rounded-md border border-[#2D2850] text-[#9D93C0] hover:text-white hover:border-[#7C3AED] transition-colors">
            &larr;
          </button>
          <button className="w-8 h-8 flex items-center justify-center rounded-md bg-[#7C3AED] text-white border border-[#A78BFA]/50 shadow-[0_0_10px_rgba(124,58,237,0.4)]">
            1
          </button>
          <button className="w-8 h-8 flex items-center justify-center rounded-md border border-[#2D2850] text-[#9D93C0] hover:text-white hover:border-[#7C3AED] transition-colors">
            2
          </button>
          <button className="w-8 h-8 flex items-center justify-center rounded-md border border-[#2D2850] text-[#9D93C0] hover:text-white hover:border-[#7C3AED] transition-colors">
            3
          </button>
          <button className="w-8 h-8 flex items-center justify-center rounded-md border border-[#2D2850] text-[#9D93C0] hover:text-white hover:border-[#7C3AED] transition-colors">
            &rarr;
          </button>
        </div>

      </div>
    </div>
  );
}
