"use client";

import { useRef } from "react";
import { motion, useInView } from "motion/react";
import { Brain, Sword, Unlock, Bot, Trophy } from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "Solve DSA Challenges",
    description: "Face real algorithm puzzles in live combat. Each challenge is a weapon against your enemy.",
    color: "#00d4ff",
    glowColor: "rgba(0,212,255,0.2)",
    borderColor: "rgba(0,212,255,0.3)",
    tag: "CORE MECHANIC",
  },
  {
    icon: Sword,
    title: "Defeat Dungeon Bosses",
    description: "Massive AI-powered bosses guard each floor. Solve harder problems to deal more damage.",
    color: "#ff6b35",
    glowColor: "rgba(255,107,53,0.2)",
    borderColor: "rgba(255,107,53,0.3)",
    tag: "BOSS SYSTEM",
  },
  {
    icon: Unlock,
    title: "Unlock Algorithm Powers",
    description: "Master sorting, trees, graphs, and DP to unlock devastating magical abilities.",
    color: "#8b5cf6",
    glowColor: "rgba(139,92,246,0.2)",
    borderColor: "rgba(139,92,246,0.3)",
    tag: "PROGRESSION",
  },
  {
    icon: Bot,
    title: "Adaptive AI Difficulty",
    description: "Our AI enemy learns from your playstyle and adapts. No two runs are the same.",
    color: "#06ffd4",
    glowColor: "rgba(6,255,212,0.2)",
    borderColor: "rgba(6,255,212,0.3)",
    tag: "AI SYSTEM",
  },
  {
    icon: Trophy,
    title: "Competitive Leaderboards",
    description: "Compete globally. Earn XP, rare loot, and legendary status among algorithmic warriors.",
    color: "#ffd700",
    glowColor: "rgba(255,215,0,0.2)",
    borderColor: "rgba(255,215,0,0.3)",
    tag: "RANKED PLAY",
  },
];

function FeatureCard({ feature, index }: { feature: typeof features[0]; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const Icon = feature.icon;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 60, scale: 0.9 }}
      animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ duration: 0.7, delay: index * 0.12, ease: [0.25, 0.46, 0.45, 0.94] }}
      whileHover={{ y: -8, scale: 1.02 }}
      className="relative group cursor-default rounded-2xl p-px overflow-hidden"
      style={{ boxShadow: `0 0 40px ${feature.glowColor}` }}
    >
      {/* Animated gradient border */}
      <div
        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: `linear-gradient(135deg, ${feature.color}33, transparent, ${feature.color}22)`,
        }}
      />
      <div
        className="absolute inset-0 rounded-2xl"
        style={{ border: `1px solid ${feature.borderColor}` }}
      />

      <div className="relative bg-[rgba(8,16,32,0.8)] backdrop-blur-xl rounded-2xl p-7 h-full">
        {/* Tag */}
        <div
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-mono-tech tracking-widest mb-5"
          style={{
            color: feature.color,
            backgroundColor: `${feature.glowColor}`,
            border: `1px solid ${feature.borderColor}`,
          }}
        >
          <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: feature.color }} />
          {feature.tag}
        </div>

        {/* Icon */}
        <motion.div
          className="w-14 h-14 rounded-xl flex items-center justify-center mb-5 relative"
          style={{ backgroundColor: `${feature.glowColor}` }}
          whileHover={{ rotate: [0, -8, 8, 0] }}
          transition={{ duration: 0.4 }}
        >
          <Icon className="w-7 h-7" style={{ color: feature.color }} />
          <div
            className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            style={{ boxShadow: `inset 0 0 20px ${feature.glowColor}` }}
          />
        </motion.div>

        {/* Text */}
        <h3
          className="font-orbitron text-lg font-bold mb-3 group-hover:text-white transition-colors"
          style={{ color: feature.color }}
        >
          {feature.title}
        </h3>
        <p className="font-rajdhani text-slate-400 text-base leading-relaxed group-hover:text-slate-300 transition-colors">
          {feature.description}
        </p>

        {/* Bottom accent line */}
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-0.5 rounded-b-2xl"
          style={{ background: `linear-gradient(90deg, transparent, ${feature.color}, transparent)` }}
          initial={{ scaleX: 0 }}
          animate={inView ? { scaleX: 1 } : {}}
          transition={{ delay: index * 0.12 + 0.5, duration: 0.8 }}
        />
      </div>
    </motion.div>
  );
}

export default function FeaturesSection() {
  const headerRef = useRef<HTMLDivElement>(null);
  const headerInView = useInView(headerRef, { once: true, margin: "-60px" });

  return (
    <section id="features" className="relative py-32 px-4 overflow-hidden">
      {/* BG */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_50%,rgba(0,212,255,0.03),transparent)]" />
      <div className="absolute inset-0 grid-pattern opacity-30" />

      <div className="max-w-7xl mx-auto">
        {/* Section header */}
        <div ref={headerRef} className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={headerInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[rgba(0,212,255,0.2)] bg-[rgba(0,212,255,0.04)] mb-6"
          >
            <span className="font-mono-tech text-xs text-[#00d4ff] tracking-widest uppercase">
              ◈ Core Systems
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={headerInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.15, duration: 0.8 }}
            className="font-orbitron text-4xl sm:text-5xl font-black text-white mb-5"
          >
            GAMEPLAY{" "}
            <span className="gradient-text-blue">FEATURES</span>
          </motion.h2>

          <motion.div
            initial={{ scaleX: 0 }}
            animate={headerInView ? { scaleX: 1 } : {}}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="mx-auto h-px w-40 bg-gradient-to-r from-transparent via-[#00d4ff] to-transparent mb-6"
          />

          <motion.p
            initial={{ opacity: 0 }}
            animate={headerInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="font-rajdhani text-lg text-slate-400 max-w-2xl mx-auto"
          >
            Every mechanic is crafted to make you a better programmer while keeping you immersed in a cinematic dungeon world.
          </motion.p>
        </div>

        {/* Features grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <FeatureCard key={feature.title} feature={feature} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
