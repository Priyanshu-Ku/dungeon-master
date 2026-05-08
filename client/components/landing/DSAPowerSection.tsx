"use client";

import { useRef } from "react";
import { motion, useInView } from "motion/react";

const powers = [
  {
    algorithm: "Graph Traversal",
    ability: "Teleportation",
    description: "BFS/DFS mastery lets you phase through dungeon walls, teleporting across the map instantly.",
    icon: "⬡",
    abilityIcon: "⚡",
    color: "#00d4ff",
    glow: "rgba(0,212,255,0.25)",
    border: "rgba(0,212,255,0.3)",
    codeSample: "bfs(graph, start)",
    tier: "RARE",
  },
  {
    algorithm: "Dynamic Programming",
    ability: "Time Freeze",
    description: "DP's optimal substructure lets you rewind 5 seconds of battle, re-making any decision.",
    icon: "∞",
    abilityIcon: "⏳",
    color: "#8b5cf6",
    glow: "rgba(139,92,246,0.25)",
    border: "rgba(139,92,246,0.3)",
    codeSample: "dp[i][j] = min(dp[i-1]...)",
    tier: "LEGENDARY",
  },
  {
    algorithm: "Trees & Recursion",
    ability: "Nature Magic",
    description: "Tree traversal mastery summons ancient forest spirits that heal and protect your character.",
    icon: "✦",
    abilityIcon: "🌿",
    color: "#06ffd4",
    glow: "rgba(6,255,212,0.25)",
    border: "rgba(6,255,212,0.3)",
    codeSample: "inorder(root.left)",
    tier: "UNCOMMON",
  },
  {
    algorithm: "Stack & Queue",
    ability: "Energy Shield",
    description: "Stack-based defence generates an impenetrable energy barrier absorbing 3 enemy attacks.",
    icon: "◧",
    abilityIcon: "🛡",
    color: "#ff6b35",
    glow: "rgba(255,107,53,0.25)",
    border: "rgba(255,107,53,0.3)",
    codeSample: "stack.push(element)",
    tier: "COMMON",
  },
  {
    algorithm: "Arrays & Sorting",
    ability: "Fireball Attack",
    description: "Sorting algorithm mastery channels data into a blazing fireball dealing massive area damage.",
    icon: "▣",
    abilityIcon: "🔥",
    color: "#ff0080",
    glow: "rgba(255,0,128,0.25)",
    border: "rgba(255,0,128,0.3)",
    codeSample: "arr.sort((a,b) => a-b)",
    tier: "EPIC",
  },
];

const tierColors: Record<string, string> = {
  COMMON: "#94a3b8",
  UNCOMMON: "#06ffd4",
  RARE: "#00d4ff",
  EPIC: "#ff0080",
  LEGENDARY: "#ffd700",
};

function PowerCard({ power, index }: { power: typeof powers[0]; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: index % 2 === 0 ? -60 : 60, y: 30 }}
      animate={inView ? { opacity: 1, x: 0, y: 0 } : {}}
      transition={{ duration: 0.8, delay: index * 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
      whileHover={{ scale: 1.02, y: -6 }}
      className="relative group cursor-default"
    >
      <div
        className="relative rounded-2xl p-6 overflow-hidden transition-all duration-500"
        style={{
          background: `linear-gradient(135deg, rgba(8,16,32,0.9), rgba(4,8,20,0.95))`,
          border: `1px solid ${power.border}`,
          boxShadow: `0 0 30px ${power.glow}, inset 0 0 30px rgba(0,0,0,0.5)`,
        }}
      >
        {/* Hover glow overlay */}
        <motion.div
          className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
          style={{ background: `radial-gradient(ellipse at center, ${power.glow}, transparent 70%)` }}
        />

        {/* Tier badge */}
        <div
          className="absolute top-4 right-4 font-mono-tech text-[9px] font-bold tracking-[0.2em] px-2 py-0.5 rounded"
          style={{
            color: tierColors[power.tier],
            backgroundColor: `${tierColors[power.tier]}18`,
            border: `1px solid ${tierColors[power.tier]}44`,
          }}
        >
          ◈ {power.tier}
        </div>

        {/* Algorithm → Ability header */}
        <div className="flex items-center gap-3 mb-4">
          <motion.div
            className="w-12 h-12 rounded-xl flex items-center justify-center text-xl font-bold flex-shrink-0"
            style={{ backgroundColor: power.glow, color: power.color, textShadow: `0 0 20px ${power.color}` }}
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 4, repeat: Infinity, delay: index * 0.5 }}
          >
            {power.icon}
          </motion.div>

          <div className="flex items-center gap-2 flex-1 min-w-0">
            <div className="font-orbitron text-sm font-bold" style={{ color: power.color }}>
              {power.algorithm}
            </div>
            <motion.div
              className="text-slate-500"
              animate={{ x: [0, 4, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              →
            </motion.div>
            <div className="font-orbitron text-sm font-bold text-white flex items-center gap-1.5">
              <span>{power.abilityIcon}</span>
              {power.ability}
            </div>
          </div>
        </div>

        <p className="font-rajdhani text-slate-400 text-sm leading-relaxed mb-4 group-hover:text-slate-300 transition-colors">
          {power.description}
        </p>

        {/* Code snippet */}
        <div
          className="flex items-center gap-2 px-3 py-2 rounded-lg font-mono-tech text-xs"
          style={{
            backgroundColor: `${power.glow}`,
            border: `1px solid ${power.border}`,
            color: power.color,
          }}
        >
          <span className="text-slate-600">&gt;_</span>
          <span>{power.codeSample}</span>
          <motion.span
            className="ml-auto"
            animate={{ opacity: [1, 0, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
            style={{ color: power.color }}
          >
            ▌
          </motion.span>
        </div>

        {/* Bottom energy bar */}
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-0.5 rounded-b-2xl"
          style={{ background: `linear-gradient(90deg, transparent, ${power.color}, transparent)` }}
          initial={{ scaleX: 0 }}
          animate={inView ? { scaleX: 1 } : {}}
          transition={{ delay: index * 0.1 + 0.6, duration: 1 }}
        />
      </div>
    </motion.div>
  );
}

export default function DSAPowerSection() {
  const headerRef = useRef<HTMLDivElement>(null);
  const inView = useInView(headerRef, { once: true, margin: "-60px" });

  return (
    <section id="powers" className="relative py-32 px-4 overflow-hidden">
      {/* BG */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_30%_50%,rgba(139,92,246,0.05),transparent)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_70%_50%,rgba(0,212,255,0.04),transparent)]" />
      <div className="section-divider absolute top-0 left-0 right-0" />
      <div className="section-divider absolute bottom-0 left-0 right-0" />

      <div className="max-w-7xl mx-auto">
        <div ref={headerRef} className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[rgba(139,92,246,0.3)] bg-[rgba(139,92,246,0.05)] mb-6"
          >
            <span className="font-mono-tech text-xs text-[#8b5cf6] tracking-widest">⚡ POWER SYSTEM</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.15, duration: 0.8 }}
            className="font-orbitron text-4xl sm:text-5xl font-black text-white mb-5"
          >
            DSA{" "}
            <span className="gradient-text-fire">ABILITIES</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ delay: 0.3 }}
            className="font-rajdhani text-lg text-slate-400 max-w-2xl mx-auto"
          >
            Every algorithm you master unlocks a unique magical power. The better your code, the stronger your spell.
          </motion.p>
        </div>

        {/* Powers grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {powers.map((power, i) => (
            <PowerCard key={power.algorithm} power={power} index={i} />
          ))}
        </div>

        {/* Central connector visual */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ delay: 0.8, duration: 1 }}
          className="mt-16 text-center"
        >
          <div className="inline-flex items-center gap-4 px-8 py-4 glass-card-purple rounded-2xl">
            <span className="font-mono-tech text-xs text-[#8b5cf6] tracking-widest">MASTER ALL 5 PILLARS</span>
            <div className="flex gap-1">
              {["#00d4ff","#8b5cf6","#06ffd4","#ff6b35","#ff0080"].map((c, i) => (
                <motion.div
                  key={i}
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: c, boxShadow: `0 0 8px ${c}` }}
                  animate={{ scale: [1, 1.4, 1] }}
                  transition={{ duration: 1, delay: i * 0.2, repeat: Infinity }}
                />
              ))}
            </div>
            <span className="font-orbitron text-sm font-bold gradient-text-gold">UNLOCK OMEGA FORM</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
