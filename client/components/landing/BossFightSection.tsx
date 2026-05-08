"use client";

import { useRef } from "react";
import { motion, useInView } from "motion/react";

const CODE_LINES = [
  { text: "// BOSS: Corrupted Binary Tree", color: "#4a5568" },
  { text: "function destroyBoss(root) {", color: "#e2e8f0" },
  { text: "  if (!root) return 0;", color: "#8b5cf6" },
  { text: "  const left = destroyBoss(root.left);", color: "#00d4ff" },
  { text: "  const right = destroyBoss(root.right);", color: "#00d4ff" },
  { text: "  // CRITICAL HIT!", color: "#ff6b35" },
  { text: "  return 1 + left + right;", color: "#06ffd4" },
  { text: "}", color: "#e2e8f0" },
];

const BOSS_ABILITIES = [
  { name: "Corrupted Recursion", damage: "∞", color: "#ff0080" },
  { name: "Stack Overflow", damage: "500", color: "#ff6b35" },
  { name: "Memory Leak", damage: "∞", color: "#8b5cf6" },
];

export default function BossFightSection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section id="boss" ref={ref} className="relative py-32 px-4 overflow-hidden">
      {/* Dark arena bg */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_100%_80%_at_50%_50%,rgba(255,0,128,0.04),transparent)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_100%,rgba(255,107,53,0.06),transparent)]" />
      <div className="section-divider absolute top-0 left-0 right-0" />

      {/* Scan line */}
      <motion.div
        className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-[rgba(255,0,128,0.3)] to-transparent pointer-events-none"
        animate={{ top: ["-5%", "105%"] }}
        transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
      />

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[rgba(255,107,53,0.3)] bg-[rgba(255,107,53,0.05)] mb-6">
            <span className="font-mono-tech text-xs text-[#ff6b35] tracking-widest">⚔ BOSS ARENA</span>
          </div>
          <h2 className="font-orbitron text-4xl sm:text-5xl font-black text-white mb-5">
            FACE THE{" "}
            <span className="gradient-text-fire">DUNGEON LORDS</span>
          </h2>
          <p className="font-rajdhani text-lg text-slate-400 max-w-2xl mx-auto">
            Ancient algorithmic horrors await. Only those who truly understand data structures can defeat them.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Boss Visual */}
          <motion.div
            initial={{ opacity: 0, x: -60 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.9, delay: 0.2 }}
            className="relative"
          >
            <div
              className="relative rounded-2xl overflow-hidden p-8 min-h-[460px] flex flex-col justify-between"
              style={{
                background: "linear-gradient(135deg, rgba(20,0,8,0.95), rgba(8,0,20,0.9))",
                border: "1px solid rgba(255,0,128,0.25)",
                boxShadow: "0 0 60px rgba(255,0,128,0.1), inset 0 0 40px rgba(0,0,0,0.6)",
              }}
            >
              {/* Boss entity */}
              <div className="relative flex flex-col items-center">
                {/* Boss glow aura */}
                <motion.div
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none"
                  style={{ width: 280, height: 280, background: "radial-gradient(circle, rgba(255,0,128,0.12), transparent 70%)" }}
                  animate={{ scale: [1, 1.15, 1] }}
                  transition={{ duration: 3, repeat: Infinity }}
                />

                {/* Boss silhouette — ASCII-art style */}
                <motion.div
                  className="font-mono-tech text-center leading-tight select-none mb-6"
                  style={{ color: "#ff0080", textShadow: "0 0 30px #ff0080, 0 0 60px rgba(255,0,128,0.5)" }}
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  <div className="text-5xl sm:text-6xl font-black" style={{ fontFamily: "serif" }}>
                    👾
                  </div>
                  <div className="text-xs mt-2 tracking-widest opacity-70">CORRUPTED BINARY OVERLORD</div>
                </motion.div>

                {/* Boss Name */}
                <motion.h3
                  className="font-orbitron text-2xl font-black text-white mb-2"
                  animate={{ textShadow: ["0 0 20px #ff0080", "0 0 40px #ff0080, 0 0 80px rgba(255,0,128,0.5)", "0 0 20px #ff0080"] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  Zor&apos;thax the Undefined
                </motion.h3>
                <div className="font-mono-tech text-xs text-[#ff6b35] tracking-widest mb-4">FLOOR 7 BOSS — TREE DOMAIN</div>

                {/* HP Bar */}
                <div className="w-full mb-4">
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="font-mono-tech text-xs text-[#ff0080]">BOSS HP</span>
                    <span className="font-mono-tech text-xs text-slate-400">∞ / ∞</span>
                  </div>
                  <div className="h-3 bg-[rgba(255,255,255,0.06)] rounded-full overflow-hidden">
                    <motion.div
                      className="h-full rounded-full"
                      style={{ background: "linear-gradient(90deg, #ff0080, #ff6b35)" }}
                      animate={{ width: ["100%", "78%", "85%", "63%"] }}
                      transition={{ duration: 6, repeat: Infinity, times: [0, 0.3, 0.6, 1] }}
                    />
                  </div>
                </div>

                {/* Boss Abilities */}
                <div className="w-full space-y-2">
                  {BOSS_ABILITIES.map((ab, i) => (
                    <div
                      key={ab.name}
                      className="flex items-center justify-between px-3 py-2 rounded-lg"
                      style={{ backgroundColor: "rgba(255,0,0,0.06)", border: `1px solid ${ab.color}22` }}
                    >
                      <span className="font-rajdhani text-sm text-slate-300">{ab.name}</span>
                      <span
                        className="font-orbitron text-xs font-bold"
                        style={{ color: ab.color, textShadow: `0 0 10px ${ab.color}` }}
                      >
                        {ab.damage} DMG
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Code Editor Side */}
          <motion.div
            initial={{ opacity: 0, x: 60 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.9, delay: 0.4 }}
            className="space-y-4"
          >
            {/* Code editor card */}
            <div
              className="rounded-2xl overflow-hidden"
              style={{
                border: "1px solid rgba(0,212,255,0.2)",
                boxShadow: "0 0 40px rgba(0,212,255,0.08)",
              }}
            >
              {/* Editor header */}
              <div className="flex items-center gap-2 px-4 py-3 bg-[rgba(8,16,32,0.95)] border-b border-[rgba(0,212,255,0.1)]">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
                  <div className="w-3 h-3 rounded-full bg-[#febc2e]" />
                  <div className="w-3 h-3 rounded-full bg-[#28c840]" />
                </div>
                <span className="font-mono-tech text-xs text-slate-500 ml-2">boss_solution.js</span>
                <div className="ml-auto flex items-center gap-2">
                  <motion.div
                    className="w-2 h-2 rounded-full bg-[#06ffd4]"
                    animate={{ opacity: [1, 0.3, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  />
                  <span className="font-mono-tech text-[10px] text-[#06ffd4]">LIVE</span>
                </div>
              </div>

              {/* Code */}
              <div className="bg-[rgba(4,8,20,0.98)] p-5 font-mono-tech text-sm">
                {CODE_LINES.map((line, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={inView ? { opacity: 1, x: 0 } : {}}
                    transition={{ delay: 0.6 + i * 0.1, duration: 0.4 }}
                    className="flex items-center gap-3 leading-7"
                  >
                    <span className="text-slate-700 text-xs w-4 text-right flex-shrink-0">{i + 1}</span>
                    <span style={{ color: line.color }}>{line.text}</span>
                  </motion.div>
                ))}
                <motion.div
                  className="flex items-center gap-3 mt-1"
                  animate={{ opacity: [1, 0] }}
                  transition={{ duration: 0.7, repeat: Infinity }}
                >
                  <span className="text-slate-700 text-xs w-4 text-right">9</span>
                  <span className="text-[#00d4ff]">▌</span>
                </motion.div>
              </div>
            </div>

            {/* Combat log */}
            <div
              className="rounded-xl p-4 space-y-2"
              style={{ background: "rgba(8,16,32,0.7)", border: "1px solid rgba(255,107,53,0.15)" }}
            >
              <div className="font-mono-tech text-xs text-[#ff6b35] mb-3 tracking-widest">⚔ COMBAT LOG</div>
              {[
                { msg: "Your recursion dealt 840 damage!", color: "#06ffd4" },
                { msg: "BOSS casts Stack Overflow! -500 HP", color: "#ff0080" },
                { msg: "Tree traversal: CRITICAL HIT! 2x DMG", color: "#ffd700" },
                { msg: "Algorithm efficiency bonus: +350 DMG", color: "#8b5cf6" },
              ].map((log, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 10 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 1.2 + i * 0.15 }}
                  className="font-mono-tech text-xs flex items-center gap-2"
                  style={{ color: log.color }}
                >
                  <span className="text-slate-600 flex-shrink-0">[{String(i + 1).padStart(2, "0")}]</span>
                  {log.msg}
                </motion.div>
              ))}
            </div>

            {/* CTA */}
            <motion.button
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.97 }}
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ delay: 1.5 }}
              className="w-full btn-danger px-8 py-4 rounded-xl text-base cursor-pointer"
            >
              ⚔ Challenge This Boss
            </motion.button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
