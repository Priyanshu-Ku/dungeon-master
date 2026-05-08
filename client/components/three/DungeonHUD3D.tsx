"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useRouter } from "next/navigation";
import { History, Settings, Coins, Code, Backpack } from "lucide-react";

interface DungeonHUD3DProps {
  activeChallengeLabel?: string | null;
  onClearChallenge?: () => void;
}

function StatBar({
  type,
  value,
  max,
  label,
}: {
  type: "hp" | "mp" | "xp";
  value: number;
  max: number;
  label: string;
}) {
  const pct = Math.min(100, (value / max) * 100);
  const cfg = {
    hp: { track: "#1a0505", fill: "from-[#7F1D1D] to-[#DC2626]", text: "#F87171" },
    mp: { track: "#050a1a", fill: "from-[#1e3a8a] to-[#3B82F6]", text: "#60A5FA" },
    xp: { track: "#0a0515", fill: "from-[#4C1D95] to-[#8B5CF6]", text: "#A78BFA" },
  }[type];

  return (
    <div className="flex flex-col gap-0.5 w-28">
      <div className="flex justify-between">
        <span className="text-[9px] font-['Cinzel'] tracking-widest" style={{ color: cfg.text }}>{label}</span>
        <span className="text-[9px] font-mono text-white/30">{value}/{max}</span>
      </div>
      <div className="h-2 rounded-[2px] relative overflow-hidden" style={{ background: cfg.track }}>
        <div
          className={`h-full bg-gradient-to-r ${cfg.fill} transition-all duration-700`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

export function DungeonHUD3D({ activeChallengeLabel, onClearChallenge }: DungeonHUD3DProps) {
  const router = useRouter();
  const [showRetreat, setShowRetreat] = useState(false);

  return (
    <>
      {/* ── TOP BAR ── */}
      <div className="absolute top-0 left-0 right-0 z-50 pointer-events-none">
        <div className="flex items-center justify-between px-6 py-3 bg-gradient-to-b from-black/70 to-transparent">
          {/* Left — Player info */}
          <div className="flex items-center gap-4 pointer-events-auto">
            <div className="w-9 h-9 rounded-full border border-[#00FFD4]/60 bg-[#13102A] overflow-hidden shadow-[0_0_12px_rgba(0,255,212,0.3)]">
              <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=CodeWielder" alt="Avatar" className="w-full h-full object-cover" />
            </div>
            <div className="flex flex-col gap-1.5">
              <span className="text-[#00FFD4] text-[11px] tracking-[0.3em] font-['Cinzel'] uppercase drop-shadow-[0_0_6px_rgba(0,255,212,0.5)]">
                CodeWielder
              </span>
              <div className="flex gap-3">
                <StatBar type="hp" value={850} max={1000} label="HP" />
                <StatBar type="mp" value={320} max={500} label="MP" />
              </div>
            </div>
          </div>

          {/* Center — Level badge */}
          <div className="flex flex-col items-center gap-1 pointer-events-none">
            <div className="w-10 h-10 rounded-full border-2 border-[#00FFD4] flex items-center justify-center bg-[#0c0a18] shadow-[0_0_16px_rgba(0,255,212,0.4)]">
              <span className="text-[#00FFD4] text-sm font-bold font-['Cinzel']">3</span>
            </div>
            <span className="text-[8px] text-[#00FFD4]/50 tracking-widest font-['Cinzel']">LEVEL</span>
          </div>

          {/* Right — Currency + Actions */}
          <div className="flex items-center gap-5 pointer-events-auto">
            <div className="flex items-center gap-2">
              <Coins size={14} className="text-[#F0A500]" />
              <span className="text-[#F0A500] font-['Cinzel'] text-sm font-bold">1,240</span>
            </div>

            <button
              onClick={() => setShowRetreat(true)}
              className="flex items-center gap-2 px-3 py-1.5 border border-[#F87171]/30 hover:border-[#F87171] hover:bg-[#F87171]/10 transition-all group"
            >
              <History size={13} className="text-[#F87171] group-hover:rotate-[-45deg] transition-transform" />
              <span className="text-[#F87171] font-['Cinzel'] text-[10px] tracking-widest uppercase">Retreat</span>
            </button>
          </div>
        </div>
      </div>

      {/* ── XP BAR — thin strip under top bar ── */}
      <div className="absolute top-[72px] left-0 right-0 z-50 px-6 pointer-events-none">
        <div className="h-0.5 bg-[#0a0515] relative overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "72%" }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="h-full bg-gradient-to-r from-[#4C1D95] via-[#7C3AED] to-[#A78BFA] shadow-[0_0_8px_rgba(124,58,237,0.8)]"
          />
        </div>
      </div>

      {/* ── BOTTOM BAR — minimal corner HUD ── */}
      <div className="absolute bottom-0 left-0 right-0 z-50 pointer-events-none">
        <div className="flex items-end justify-between px-6 py-4 bg-gradient-to-t from-black/60 to-transparent">
          {/* Bottom-left: item slots */}
          <div className="flex gap-2 pointer-events-auto">
            {[
              { icon: "⚔️", label: "Blade" },
              { icon: "🧪", label: "Potion" },
              { icon: "🛡️", label: "Shield" },
            ].map((item, i) => (
              <div
                key={i}
                className="w-12 h-12 border border-[#00FFD4]/20 bg-black/40 flex flex-col items-center justify-center gap-0.5 hover:border-[#00FFD4]/60 transition-colors cursor-pointer"
              >
                <span className="text-lg">{item.icon}</span>
                <span className="text-[7px] text-[#00FFD4]/40 font-['Cinzel'] tracking-wider">{item.label}</span>
              </div>
            ))}
          </div>

          {/* Bottom-center: abilities */}
          <div className="flex gap-3 pointer-events-auto">
            {[
              { icon: "🔥", key: "Q", label: "Fireball" },
              { icon: "⚡", key: "E", label: "Surge" },
              { icon: "🌀", key: "R", label: "Vortex" },
              { icon: "💎", key: "F", label: "Shield" },
            ].map((ability, i) => (
              <div key={i} className="relative flex flex-col items-center gap-1">
                <div className="w-11 h-11 border border-[#7C3AED]/40 bg-[#0c0a18]/80 flex items-center justify-center text-xl hover:border-[#7C3AED] hover:shadow-[0_0_12px_rgba(124,58,237,0.5)] transition-all cursor-pointer">
                  {ability.icon}
                </div>
                <span className="text-[8px] text-[#7C3AED]/60 font-['Cinzel'] tracking-widest">{ability.key}</span>
              </div>
            ))}
          </div>

          {/* Bottom-right: code terminal button */}
          <div className="flex gap-2 pointer-events-auto">
            <button className="flex items-center gap-2 px-3 py-2 border border-[#00FFD4]/30 bg-[#0c0a18]/80 hover:border-[#00FFD4] hover:shadow-[0_0_12px_rgba(0,255,212,0.3)] transition-all">
              <Code size={14} className="text-[#00FFD4]" />
              <span className="text-[#00FFD4] font-['Cinzel'] text-[10px] tracking-widest">TERMINAL</span>
            </button>
          </div>
        </div>
      </div>

      {/* ── Controls hint ── */}
      <div className="absolute bottom-24 left-1/2 -translate-x-1/2 z-50 pointer-events-none">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5, duration: 0.5 }}
          className="flex gap-6 text-[9px] text-white/25 font-['Cinzel'] tracking-widest uppercase"
        >
          <span>WASD — Move</span>
          <span>Click Node — Challenge</span>
          <span>E — Interact</span>
        </motion.div>
      </div>

      {/* ── Active Challenge Badge ── */}
      <AnimatePresence>
        {activeChallengeLabel && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[200] pointer-events-auto"
          >
            <div className="bg-[#0c0a18]/95 border border-[#00FFD4] px-8 py-6 text-center shadow-[0_0_30px_rgba(0,255,212,0.3)]">
              <p className="text-[#00FFD4]/60 text-[9px] tracking-[0.4em] font-['Cinzel'] uppercase mb-2">
                Challenge Detected
              </p>
              <h3 className="text-[#00FFD4] text-2xl font-['Cinzel'] tracking-wider mb-4">
                {activeChallengeLabel}
              </h3>
              <button
                onClick={onClearChallenge}
                className="px-6 py-2 bg-[#00FFD4]/10 border border-[#00FFD4] text-[#00FFD4] text-[10px] font-['Cinzel'] tracking-widest hover:bg-[#00FFD4]/20 transition-all"
              >
                ENGAGE CHALLENGE
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Retreat confirmation ── */}
      <AnimatePresence>
        {showRetreat && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/80 backdrop-blur-sm pointer-events-auto"
          >
            <motion.div
              initial={{ scale: 0.9, y: 10 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 10 }}
              className="bg-[#0c0a18] border border-[#F0A500]/40 p-10 max-w-md w-full text-center shadow-[0_0_40px_rgba(240,165,0,0.2)]"
            >
              <div className="w-px h-8 bg-gradient-to-b from-transparent to-[#F0A500]/60 mx-auto mb-6" />
              <h2 className="text-[#F0A500] text-2xl tracking-[0.2em] font-['Cinzel'] mb-3">
                RETREAT TO SANCTUM?
              </h2>
              <p className="text-white/40 text-sm font-['Lato'] mb-8 leading-relaxed">
                The dungeon will remember your position. Your progress is saved at the last bonfire.
              </p>
              <div className="flex gap-4">
                <button
                  onClick={() => setShowRetreat(false)}
                  className="flex-1 py-3 border border-white/10 text-white/50 font-['Cinzel'] text-xs tracking-widest hover:border-white/30 transition-all"
                >
                  STAY AND FIGHT
                </button>
                <button
                  onClick={() => router.push("/")}
                  className="flex-1 py-3 border border-[#F87171] bg-[#F87171]/10 text-[#F87171] font-['Cinzel'] text-xs tracking-widest hover:bg-[#F87171]/20 transition-all"
                >
                  RETREAT
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
