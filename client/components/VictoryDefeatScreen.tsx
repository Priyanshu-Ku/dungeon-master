import React, { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Trophy, Sparkles, Zap, Coins, Star, Skull, AlertCircle, Heart } from "lucide-react";
import { Panel, Button, Divider } from "./SystemUI";

export type GameResult = "victory" | "defeat";

interface VictoryDefeatScreenProps {
  result: GameResult;
  onContinue: () => void;
  onRetry?: () => void;
  onLeaderboard?: () => void;
  onRetreat?: () => void;
}

export function VictoryDefeatScreen({ result, onContinue, onRetry, onLeaderboard, onRetreat }: VictoryDefeatScreenProps) {
  const isVictory = result === "victory";

  // State to handle the progress bar animation
  const [showProgress, setShowProgress] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowProgress(true);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="absolute inset-0 z-[100] w-full h-full bg-[#020408] overflow-y-auto flex items-center justify-center p-6">
      
      {/* ── BACKGROUNDS ── */}
      {isVictory ? (
        <>
          {/* Radial Gold Gradient */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(240,165,0,0.08)_0%,transparent_60%)] pointer-events-none" />
          
          {/* Upward Particle Stream (CSS Implementation) */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {Array.from({ length: 20 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-[#F0A500] rounded-full shadow-[0_0_8px_#F0A500]"
                initial={{ 
                  x: `${Math.random() * 100}vw`, 
                  y: "100vh", 
                  opacity: 0,
                  scale: Math.random() * 0.5 + 0.5
                }}
                animate={{ 
                  y: "-10vh",
                  opacity: [0, 0.8, 0],
                }}
                transition={{ 
                  duration: Math.random() * 3 + 2, 
                  repeat: Infinity, 
                  delay: Math.random() * 2,
                  ease: "linear" 
                }}
              />
            ))}
          </div>
        </>
      ) : (
        <>
          {/* Red Vignette at Edges */}
          <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_150px_rgba(185,28,28,0.2)]" />
          <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-[#B91C1C]/10 to-transparent pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-[#B91C1C]/10 to-transparent pointer-events-none" />
          <div className="absolute top-0 left-0 w-32 h-full bg-gradient-to-r from-[#B91C1C]/10 to-transparent pointer-events-none" />
          <div className="absolute top-0 right-0 w-32 h-full bg-gradient-to-l from-[#B91C1C]/10 to-transparent pointer-events-none" />
          
          {/* Diagonal Cracks */}
          <div className="absolute inset-0 pointer-events-none opacity-5 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiPjxkZWZzPjxwYXR0ZXJuIGlkPSJjcmFja3MiIHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNMCAwbDEwMCAxMDBNMjAwIDBMMTAwIDEwME01MCAxNTBMMTUwIDUwIiBzdHJva2U9IiNGRkYiIHN0cm9rZS13aWR0aD0iMSIgZmlsbD0ibm9uZSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNjcmFja3MpIi8+PC9zdmc+')] mix-blend-overlay" />
        </>
      )}

      {/* ── MAIN CONTENT CONTAINER ── */}
      <motion.div 
        className="w-full max-w-[1000px] flex flex-col items-center relative z-10"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        
        {/* CENTER ICON & TITLES */}
        <div className="flex flex-col items-center text-center mb-8 relative">
          {isVictory ? (
            <div className="relative mb-6">
              {/* Gold Border Circle */}
              <div className="absolute inset-0 rounded-full border-[3px] border-[#F0A500] opacity-40 scale-[1.3] shadow-[0_0_30px_rgba(240,165,0,0.3)]" />
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", bounce: 0.5, duration: 0.8 }}
                className="w-24 h-24 rounded-full flex items-center justify-center relative z-10"
              >
                <Trophy size={28} className="text-[#F0A500] scale-[2.5]" />
              </motion.div>
              
              {/* Particle Burst Marks */}
              <div className="absolute inset-0 z-0">
                {Array.from({ length: 12 }).map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute top-1/2 left-1/2"
                    initial={{ x: 0, y: 0, opacity: 1, scale: 0 }}
                    animate={{ 
                      x: Math.cos(i * 30 * (Math.PI/180)) * 80, 
                      y: Math.sin(i * 30 * (Math.PI/180)) * 80,
                      opacity: 0,
                      scale: 1
                    }}
                    transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
                  >
                    <Sparkles size={16} className="text-[#F0A500] drop-shadow-[0_0_5px_#F0A500]" />
                  </motion.div>
                ))}
              </div>
            </div>
          ) : (
             <div className="relative mb-6">
               <motion.div
                initial={{ rotate: -15, scale: 0.8 }}
                animate={{ rotate: 0, scale: 1 }}
                transition={{ type: "spring", bounce: 0.6, duration: 0.6 }}
               >
                  {/* Broken Sword Mock (Using a slashed layout or skull) */}
                  <div className="relative w-[80px] h-[80px] flex items-center justify-center">
                    <Skull size={28} className="text-[#B91C1C] scale-[2.5]" />
                    {/* Mock crack through the skull */}
                    <div className="absolute top-0 right-1/4 w-[2px] h-full bg-[#020408] rotate-12" />
                    <div className="absolute top-1/4 right-1/4 w-4 h-[2px] bg-[#020408] rotate-[30deg]" />
                  </div>
               </motion.div>
             </div>
          )}

          <motion.h1 
            className={`font-['Cinzel_Decorative'] text-[40px] md:text-[56px] tracking-[0.3em] uppercase leading-tight mt-4 ${
              isVictory ? "text-[#F0A500] glow-orange" : "text-[#EF4444]"
            }`}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            {isVictory ? "Guardian Defeated!" : "You Have Fallen..."}
          </motion.h1>

          <motion.p 
            className="font-['Lato'] text-[16px] text-[#9D93C0] mt-2 max-w-md"
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            {isVictory 
              ? "The Array Sentinel has been vanquished. Its power is now yours." 
              : "Your solution was incorrect. The guardian endures, its logic unbroken."}
          </motion.p>
        </div>

        {/* ── CONTEXTUAL CARDS ── */}
        <motion.div 
          className="w-full max-w-[400px] mb-10"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          {isVictory ? (
            <Panel variant="rune" className="w-full">
              <div className="flex flex-col">
                <div className="font-['Cinzel'] text-[12px] text-[#7C3AED] tracking-[0.2em] uppercase text-center mb-1">
                  Rewards Claimed
                </div>
                <div className="w-full h-px bg-gradient-to-r from-transparent via-[#F0A500]/50 to-transparent mb-4" />

                <div className="flex flex-col gap-3 mb-6">
                  <div className="flex justify-between items-center bg-[#07060F]/50 p-2 rounded-sm border border-[#2D2850]/50">
                    <div className="flex items-center gap-2 font-['Lato'] text-[13px] text-[#E2D9F3]">
                      <Zap size={16} className="text-[#F0A500]" /> Experience Points
                    </div>
                    <span className="font-['Cinzel'] font-bold text-[#F0A500]">+75 XP</span>
                  </div>
                  <div className="flex justify-between items-center bg-[#07060F]/50 p-2 rounded-sm border border-[#2D2850]/50">
                    <div className="flex items-center gap-2 font-['Lato'] text-[13px] text-[#E2D9F3]">
                      <Coins size={16} className="text-[#F0A500]" /> Gold Earned
                    </div>
                    <span className="font-['Cinzel'] font-bold text-[#F0A500]">+40 Gold</span>
                  </div>
                  <div className="flex justify-between items-center bg-[#13111C] p-2 rounded-sm border border-[#7C3AED]/40 shadow-[0_0_15px_rgba(124,58,237,0.1)] relative overflow-hidden">
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20 mix-blend-overlay" />
                    <div className="flex items-center gap-2 font-['Lato'] text-[13px] text-[#E2D9F3] relative z-10">
                      <Star size={16} className="text-[#A78BFA] fill-[#A78BFA]/20" /> Ability Unlocked
                    </div>
                    <span className="font-['Cinzel'] font-bold text-[#A78BFA] drop-shadow-[0_0_8px_rgba(167,139,250,0.6)] relative z-10">
                      Array Mastery
                    </span>
                  </div>
                </div>

                {/* XP Bar */}
                <div className="w-full flex flex-col gap-1">
                  <div className="flex justify-between items-end">
                     <span className="font-['Lato'] text-[10px] text-[#9D93C0] uppercase tracking-wider">Level Progress</span>
                     <span className="font-['Fira_Code'] text-[10px] text-[#F0A500]">Level 12 &rarr; 13</span>
                  </div>
                  <div className="w-full h-2 bg-[#0A0812] border border-[#2D2850] rounded-sm relative overflow-hidden flex">
                    {/* Previous Fill */}
                    <div className="h-full bg-[#322D46] w-[60%]" />
                    {/* New Fill Extension */}
                    <motion.div 
                      className="h-full bg-gradient-to-r from-[#7C3AED] to-[#A78BFA] relative shadow-[0_0_10px_rgba(167,139,250,0.8)]"
                      initial={{ width: "0%" }}
                      animate={{ width: showProgress ? "15%" : "0%" }}
                      transition={{ duration: 1.5, ease: "circOut" }}
                    >
                       <div className="absolute inset-0 bg-white/20 animate-pulse-glow mix-blend-overlay" />
                    </motion.div>
                  </div>
                </div>
              </div>
            </Panel>
          ) : (
            <div className="flex flex-col gap-6">
              {/* Failed Tests Card */}
              <Panel variant="default" className="w-full !border-l-2 !border-l-[#EF4444] shadow-[0_0_20px_rgba(239,68,68,0.1)]">
                <div className="font-['Cinzel'] text-[11px] text-[#EF4444] tracking-[0.1em] uppercase mb-3 flex items-center gap-2">
                  <AlertCircle size={16} /> Failed Test Cases
                </div>
                
                <div className="flex flex-col gap-2 font-['Fira_Code'] text-[12px]">
                  <div className="bg-[#3A0F0F] border border-[#5A1515] p-3 rounded-sm flex flex-col gap-1 relative overflow-hidden">
                    <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-[#EF4444]" />
                    <span className="text-[#FCA5A5]">Input: [1, 2, 3, 2, 1]</span>
                    <span className="text-[#9D93C0]">Expected: true</span>
                    <span className="text-[#EF4444] font-bold">Output: false</span>
                  </div>
                  <div className="bg-[#3A0F0F] border border-[#5A1515] p-3 rounded-sm flex flex-col gap-1 relative overflow-hidden">
                    <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-[#EF4444]" />
                    <span className="text-[#FCA5A5]">Input: [100, 200]</span>
                    <span className="text-[#9D93C0]">Expected: false</span>
                    <span className="text-[#EF4444] font-bold">Output: true</span>
                  </div>
                </div>
              </Panel>

               {/* HP Damage Indicator */}
               <div className="flex flex-col gap-2 items-center w-full px-4">
                  <div className="font-['Cinzel'] text-[14px] text-[#EF4444] font-bold flex items-center gap-2 drop-shadow-[0_0_8px_rgba(239,68,68,0.6)]">
                    <Heart size={16} className="fill-[#EF4444]" /> −12 HP
                  </div>
                  <div className="w-full max-w-[250px] h-2.5 bg-[#0A0B1A] border border-[#2D2850] rounded-sm relative overflow-hidden flex justify-end">
                    {/* Remaining HP */}
                    <div className="h-full bg-[#1E3A8A] w-[40%]" />
                    {/* Depleting HP */}
                    <motion.div 
                      className="h-full bg-gradient-to-r from-[#DC2626] to-[#EF4444] w-[20%]"
                      initial={{ opacity: 1 }}
                      animate={{ opacity: showProgress ? [1, 0] : 1, width: showProgress ? "0%" : "20%" }}
                      transition={{ duration: 1.2, ease: "easeIn", opacity: { duration: 0.2, delay: 1 } }}
                    />
                    {/* Empty HP Space */}
                    <div className="h-full w-[40%]" />
                  </div>
               </div>
            </div>
          )}
        </motion.div>

        {/* ── BUTTON ROW ── */}
        <motion.div 
          className="flex gap-4"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          {isVictory ? (
             <>
               <Button variant="primary" onClick={onContinue}>
                 Continue Dungeon
               </Button>
               {onLeaderboard && (
                 <Button variant="ghost" onClick={onLeaderboard}>
                   View Leaderboard
                 </Button>
               )}
             </>
          ) : (
             <>
               {onRetry && (
                 <Button variant="danger" onClick={onRetry}>
                   Try Again
                 </Button>
               )}
               {onRetreat && (
                 <Button variant="ghost" onClick={onRetreat}>
                   Retreat to Ruins
                 </Button>
               )}
             </>
          )}
        </motion.div>

      </motion.div>
    </div>
  );
}
