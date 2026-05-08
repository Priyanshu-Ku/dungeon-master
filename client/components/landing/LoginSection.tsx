"use client";

import { useRef } from "react";
import { motion, useInView } from "motion/react";
import { LogIn, Shield, Zap, Star, Map, Package } from "lucide-react";

const inventoryItems = [
  { name: "Recursion Blade", rarity: "LEGENDARY", icon: "⚔", color: "#ffd700" },
  { name: "DP Shield", rarity: "EPIC", icon: "🛡", color: "#ff0080" },
  { name: "Array Staff", rarity: "RARE", icon: "🔮", color: "#00d4ff" },
  { name: "Sort Potion", rarity: "UNCOMMON", icon: "⚗", color: "#06ffd4" },
  { name: "Stack Ring", rarity: "COMMON", icon: "💍", color: "#94a3b8" },
  { name: "Hash Charm", rarity: "RARE", icon: "🔑", color: "#00d4ff" },
];

const rarityColors: Record<string, string> = {
  LEGENDARY: "#ffd700",
  EPIC: "#ff0080",
  RARE: "#00d4ff",
  UNCOMMON: "#06ffd4",
  COMMON: "#94a3b8",
};

const progressData = [
  { label: "Algorithm Mastery", value: 67, color: "#00d4ff" },
  { label: "Boss Defeats", value: 45, color: "#ff6b35" },
  { label: "Dungeon Progress", value: 33, color: "#8b5cf6" },
  { label: "Rank Progress", value: 78, color: "#ffd700" },
];

export default function LoginSection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section id="profile" ref={ref} className="relative py-32 px-4 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_50%,rgba(139,92,246,0.05),transparent)]" />
      <div className="section-divider absolute top-0 left-0 right-0" />

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[rgba(139,92,246,0.3)] bg-[rgba(139,92,246,0.05)] mb-6">
            <span className="font-mono-tech text-xs text-[#8b5cf6] tracking-widest">⬡ ADVENTURER PROFILE</span>
          </div>
          <h2 className="font-orbitron text-4xl sm:text-5xl font-black text-white mb-5">
            YOUR{" "}
            <span className="gradient-text-blue">DUNGEON PROFILE</span>
          </h2>
          <p className="font-rajdhani text-lg text-slate-400 max-w-2xl mx-auto">
            Sign in to track your progress, save your run, and claim your place in the hall of algorithmic legends.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Login Card */}
          <motion.div
            initial={{ opacity: 0, x: -60 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div
              className="rounded-2xl p-8 relative overflow-hidden"
              style={{
                background: "linear-gradient(135deg, rgba(8,16,32,0.95), rgba(16,8,40,0.9))",
                border: "1px solid rgba(139,92,246,0.25)",
                boxShadow: "0 0 50px rgba(139,92,246,0.08)",
              }}
            >
              {/* Corner decorations */}
              <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-[#8b5cf6] rounded-tl-2xl" />
              <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-[#00d4ff] rounded-tr-2xl" />
              <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-[#00d4ff] rounded-bl-2xl" />
              <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-[#8b5cf6] rounded-br-2xl" />

              {/* Icon */}
              <motion.div
                className="w-20 h-20 rounded-2xl mx-auto mb-8 flex items-center justify-center relative"
                style={{ background: "linear-gradient(135deg, rgba(139,92,246,0.2), rgba(0,212,255,0.1))", border: "1px solid rgba(139,92,246,0.3)" }}
                animate={{ boxShadow: ["0 0 20px rgba(139,92,246,0.3)", "0 0 40px rgba(139,92,246,0.5)", "0 0 20px rgba(139,92,246,0.3)"] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Shield className="w-10 h-10 text-[#8b5cf6]" />
                <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-[#06ffd4] flex items-center justify-center">
                  <Zap className="w-3 h-3 text-black" />
                </div>
              </motion.div>

              <h3 className="font-orbitron text-2xl font-black text-white text-center mb-2">
                Enter the Dungeon
              </h3>
              <p className="font-rajdhani text-slate-400 text-center mb-8">
                Your algorithmic journey awaits. Sign in to save progress & compete.
              </p>

              {/* Google Sign-in Button */}
              <motion.button
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.97 }}
                className="w-full flex items-center justify-center gap-3 px-6 py-4 rounded-xl font-rajdhani text-base font-600 tracking-wide transition-all duration-300 cursor-pointer mb-4"
                style={{
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.15)",
                  color: "white",
                }}
              >
                <svg viewBox="0 0 24 24" className="w-5 h-5 flex-shrink-0">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Continue with Google
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.97 }}
                className="w-full btn-primary px-6 py-4 rounded-xl text-base cursor-pointer flex items-center justify-center gap-3"
              >
                <LogIn className="w-5 h-5" />
                Enter as Guest
              </motion.button>

              {/* Features list */}
              <div className="mt-8 space-y-3">
                {[
                  { icon: Star, text: "Earn XP and unlock rare algorithm powers", color: "#ffd700" },
                  { icon: Map, text: "Track your dungeon progress across sessions", color: "#00d4ff" },
                  { icon: Shield, text: "Compete globally and claim legendary titles", color: "#8b5cf6" },
                ].map((item) => (
                  <div key={item.text} className="flex items-center gap-3">
                    <item.icon className="w-4 h-4 flex-shrink-0" style={{ color: item.color }} />
                    <span className="font-rajdhani text-sm text-slate-400">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Profile Dashboard Preview */}
          <motion.div
            initial={{ opacity: 0, x: 60 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="space-y-5"
          >
            {/* Profile Header Card */}
            <div
              className="rounded-2xl p-5"
              style={{ background: "rgba(8,16,32,0.8)", border: "1px solid rgba(0,212,255,0.15)" }}
            >
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div
                    className="w-16 h-16 rounded-xl flex items-center justify-center font-orbitron text-2xl font-black"
                    style={{ background: "linear-gradient(135deg, #00d4ff22, #8b5cf622)", border: "2px solid #00d4ff44", color: "#00d4ff" }}
                  >
                    Y
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-[#06ffd4] border-2 border-[#020408] flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-[#020408]" />
                  </div>
                </div>
                <div className="flex-1">
                  <div className="font-orbitron text-lg font-bold text-white">YourUsername</div>
                  <div className="font-mono-tech text-xs text-[#00d4ff] mb-2">Floor 7 · Rare Mage</div>
                  <div className="h-2 bg-[rgba(255,255,255,0.06)] rounded-full overflow-hidden">
                    <motion.div
                      className="h-full xp-bar-fill rounded-full"
                      initial={{ width: "0%" }}
                      animate={inView ? { width: "62%" } : {}}
                      transition={{ delay: 0.8, duration: 1.2 }}
                    />
                  </div>
                  <div className="flex justify-between mt-1">
                    <span className="font-mono-tech text-[10px] text-slate-600">XP</span>
                    <span className="font-mono-tech text-[10px] text-slate-500">62,400 / 100,000</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Progress Bars */}
            <div
              className="rounded-2xl p-5"
              style={{ background: "rgba(8,16,32,0.8)", border: "1px solid rgba(0,212,255,0.1)" }}
            >
              <div className="font-mono-tech text-xs text-slate-500 tracking-widest mb-4">◈ SKILL PROGRESSION</div>
              <div className="space-y-4">
                {progressData.map((item, i) => (
                  <div key={item.label}>
                    <div className="flex justify-between mb-1.5">
                      <span className="font-rajdhani text-sm text-slate-300">{item.label}</span>
                      <span className="font-mono-tech text-xs" style={{ color: item.color }}>{item.value}%</span>
                    </div>
                    <div className="h-2 bg-[rgba(255,255,255,0.06)] rounded-full overflow-hidden">
                      <motion.div
                        className="h-full rounded-full"
                        style={{ background: `linear-gradient(90deg, ${item.color}88, ${item.color})` }}
                        initial={{ width: "0%" }}
                        animate={inView ? { width: `${item.value}%` } : {}}
                        transition={{ delay: 0.6 + i * 0.15, duration: 1.2, ease: "easeOut" }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Inventory Preview */}
            <div
              className="rounded-2xl p-5"
              style={{ background: "rgba(8,16,32,0.8)", border: "1px solid rgba(0,212,255,0.1)" }}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="font-mono-tech text-xs text-slate-500 tracking-widest flex items-center gap-2">
                  <Package className="w-3.5 h-3.5" />
                  INVENTORY
                </div>
                <span className="font-mono-tech text-[10px] text-slate-600">6/24 SLOTS</span>
              </div>
              <div className="grid grid-cols-6 gap-2">
                {inventoryItems.map((item, i) => (
                  <motion.div
                    key={item.name}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={inView ? { opacity: 1, scale: 1 } : {}}
                    transition={{ delay: 0.8 + i * 0.08 }}
                    whileHover={{ scale: 1.15, y: -2 }}
                    className="aspect-square rounded-lg flex items-center justify-center text-xl cursor-pointer relative group"
                    style={{
                      background: `${rarityColors[item.rarity]}18`,
                      border: `1px solid ${rarityColors[item.rarity]}44`,
                    }}
                    title={`${item.name} (${item.rarity})`}
                  >
                    {item.icon}
                    <div
                      className="absolute -bottom-0.5 left-0 right-0 h-0.5 rounded"
                      style={{ backgroundColor: rarityColors[item.rarity] }}
                    />
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
