"use client";

import { useRef } from "react";
import { motion, useInView } from "motion/react";

const players = [
  {
    rank: 1,
    name: "NullPointer_Slayer",
    level: 99,
    xp: 982450,
    maxXp: 1000000,
    xpProgress: 98,
    floor: 33,
    badge: "👑",
    badgeLabel: "Dungeon God",
    color: "#ffd700",
    kills: 4821,
    avatar: "N",
  },
  {
    rank: 2,
    name: "BinaryWitch",
    level: 87,
    xp: 741200,
    maxXp: 800000,
    xpProgress: 92,
    floor: 28,
    badge: "⚔",
    badgeLabel: "Blade Master",
    color: "#c0c0c0",
    kills: 3204,
    avatar: "B",
  },
  {
    rank: 3,
    name: "GraphGod_v2",
    level: 81,
    xp: 612800,
    maxXp: 700000,
    xpProgress: 87,
    floor: 25,
    badge: "🔮",
    badgeLabel: "Arc Mage",
    color: "#cd7f32",
    kills: 2987,
    avatar: "G",
  },
  {
    rank: 4,
    name: "DP_Destroyer",
    level: 74,
    xp: 498300,
    maxXp: 600000,
    xpProgress: 83,
    floor: 22,
    badge: "⚡",
    badgeLabel: "Time Mage",
    color: "#8b5cf6",
    kills: 2341,
    avatar: "D",
  },
  {
    rank: 5,
    name: "RecursionKing",
    level: 68,
    xp: 401100,
    maxXp: 500000,
    xpProgress: 80,
    floor: 19,
    badge: "🌿",
    badgeLabel: "Forest Sage",
    color: "#06ffd4",
    kills: 1892,
    avatar: "R",
  },
  {
    rank: 6,
    name: "O_of_LogN",
    level: 61,
    xp: 318900,
    maxXp: 400000,
    xpProgress: 79,
    floor: 16,
    badge: "🛡",
    badgeLabel: "Warden",
    color: "#00d4ff",
    kills: 1564,
    avatar: "O",
  },
];

const rankColors = [
  "rgba(255,215,0,0.15)",
  "rgba(192,192,192,0.1)",
  "rgba(205,127,50,0.1)",
];

function LeaderboardRow({ player, index }: { player: typeof players[0]; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-30px" });

  const isTop3 = index < 3;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -40 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.08 }}
      whileHover={{ x: 4, scale: 1.01 }}
      className="relative group cursor-default rounded-xl p-4 transition-all duration-300"
      style={{
        background: isTop3 ? rankColors[index] : "rgba(8,16,32,0.5)",
        border: `1px solid ${isTop3 ? player.color + "33" : "rgba(0,212,255,0.08)"}`,
        boxShadow: isTop3 ? `0 0 20px ${player.color}15` : "none",
      }}
    >
      {/* Hover glow */}
      <div
        className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{ background: `linear-gradient(135deg, ${player.color}08, transparent)` }}
      />

      <div className="flex items-center gap-4">
        {/* Rank */}
        <div className="w-8 flex-shrink-0 text-center">
          {isTop3 ? (
            <motion.div
              className="font-orbitron text-lg font-black"
              style={{ color: player.color, textShadow: `0 0 15px ${player.color}` }}
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, delay: index * 0.3, repeat: Infinity }}
            >
              {player.rank}
            </motion.div>
          ) : (
            <div className="font-orbitron text-sm text-slate-500">#{player.rank}</div>
          )}
        </div>

        {/* Avatar */}
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center font-orbitron text-sm font-black flex-shrink-0 relative"
          style={{
            backgroundColor: `${player.color}22`,
            border: `1px solid ${player.color}44`,
            color: player.color,
          }}
        >
          {player.avatar}
          {isTop3 && (
            <div
              className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full flex items-center justify-center text-xs"
              style={{ backgroundColor: player.color + "33", border: `1px solid ${player.color}` }}
            >
              {player.badge}
            </div>
          )}
        </div>

        {/* Name & details */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-orbitron text-sm font-bold text-white truncate">
              {player.name}
            </span>
            <span
              className="font-mono-tech text-[9px] px-1.5 py-0.5 rounded flex-shrink-0"
              style={{ color: player.color, backgroundColor: player.color + "18", border: `1px solid ${player.color}33` }}
            >
              {player.badgeLabel}
            </span>
          </div>
          {/* XP Bar */}
          <div className="h-1.5 bg-[rgba(255,255,255,0.06)] rounded-full overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{ background: `linear-gradient(90deg, ${player.color}aa, ${player.color})` }}
              initial={{ width: "0%" }}
              animate={inView ? { width: `${player.xpProgress}%` } : {}}
              transition={{ delay: index * 0.08 + 0.4, duration: 1, ease: "easeOut" }}
            />
          </div>
        </div>

        {/* Stats */}
        <div className="hidden sm:flex flex-col items-end gap-1 flex-shrink-0">
          <div className="font-orbitron text-xs font-bold" style={{ color: player.color }}>
            LVL {player.level}
          </div>
          <div className="font-mono-tech text-[10px] text-slate-500">
            Floor {player.floor}
          </div>
        </div>

        {/* Kills */}
        <div className="hidden md:flex flex-col items-end flex-shrink-0 w-16">
          <div className="font-orbitron text-xs text-white">{player.kills.toLocaleString()}</div>
          <div className="font-mono-tech text-[10px] text-slate-600">KILLS</div>
        </div>
      </div>
    </motion.div>
  );
}

export default function LeaderboardSection() {
  const headerRef = useRef<HTMLDivElement>(null);
  const inView = useInView(headerRef, { once: true, margin: "-60px" });

  return (
    <section id="leaderboard" className="relative py-32 px-4 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_50%,rgba(255,215,0,0.03),transparent)]" />
      <div className="section-divider absolute top-0 left-0 right-0" />

      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div ref={headerRef} className="text-center mb-14">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[rgba(255,215,0,0.3)] bg-[rgba(255,215,0,0.04)] mb-6"
          >
            <span className="font-mono-tech text-xs text-[#ffd700] tracking-widest">🏆 RANKED SEASON 1</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.15 }}
            className="font-orbitron text-4xl sm:text-5xl font-black text-white mb-5"
          >
            GLOBAL{" "}
            <span className="gradient-text-gold">LEADERBOARD</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ delay: 0.3 }}
            className="font-rajdhani text-lg text-slate-400 max-w-xl mx-auto"
          >
            The greatest algorithmic warriors in the dungeon. Can you claim your place?
          </motion.p>
        </div>

        {/* Column headers */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.4 }}
          className="flex items-center gap-4 px-4 mb-3"
        >
          <div className="w-8 font-mono-tech text-[10px] text-slate-600 tracking-widest">RNK</div>
          <div className="w-10" />
          <div className="flex-1 font-mono-tech text-[10px] text-slate-600 tracking-widest">PLAYER → XP</div>
          <div className="hidden sm:block w-16 font-mono-tech text-[10px] text-slate-600 tracking-widest text-right">LEVEL</div>
          <div className="hidden md:block w-16 font-mono-tech text-[10px] text-slate-600 tracking-widest text-right">KILLS</div>
        </motion.div>

        {/* Rows */}
        <div className="space-y-2">
          {players.map((player, i) => (
            <LeaderboardRow key={player.rank} player={player} index={i} />
          ))}
        </div>

        {/* View All */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.8 }}
          className="text-center mt-8"
        >
          <button className="font-rajdhani text-sm text-slate-500 hover:text-[#00d4ff] transition-colors tracking-wider uppercase border border-[rgba(0,212,255,0.1)] px-6 py-3 rounded-xl hover:border-[rgba(0,212,255,0.3)] cursor-pointer">
            View Full Leaderboard →
          </button>
        </motion.div>
      </div>
    </section>
  );
}
