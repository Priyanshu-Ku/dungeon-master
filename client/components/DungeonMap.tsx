"use client";

import React from "react";
import { motion } from "motion/react";
import { Skull, Shield, Sword, Lock, Star, Crown, CheckCircle2, Navigation2 } from "lucide-react";
import { useGameStore } from "@/stores/useGameStore";

interface RoomNode {
  id: string;
  x: number;
  y: number;
  type: "start" | "monster" | "loot" | "boss" | "locked";
  label: string;
  status: "cleared" | "current" | "undiscovered" | "locked";
}

const ROOMS: RoomNode[] = [
  { id: "1", x: 100, y: 300, type: "start", label: "Entrance", status: "cleared" },
  { id: "2", x: 250, y: 200, type: "monster", label: "Sentinel Hall", status: "current" },
  { id: "3", x: 250, y: 400, type: "loot", label: "Armory", status: "cleared" },
  { id: "4", x: 400, y: 300, type: "monster", label: "Void Chamber", status: "undiscovered" },
  { id: "5", x: 550, y: 300, type: "boss", label: "Abyssal Throne", status: "locked" },
  { id: "6", x: 400, y: 100, type: "locked", label: "Hidden Vault", status: "locked" },
];

const REQUIRED_BADGE_ID = "50-days"; 
const TEST_UNLOCK = true; 

const CONNECTIONS = [
  { from: "1", to: "2" },
  { from: "1", to: "3" },
  { from: "2", to: "4" },
  { from: "3", to: "4" },
  { from: "4", to: "5" },
  { from: "2", to: "6" },
];

export function DungeonMap() {
  const stats = useGameStore((state) => state.playerStats);
  const hasResonanceUnlock = TEST_UNLOCK 
    ? stats.badges.length > 0 
    : stats.badges.some(b => b.id === REQUIRED_BADGE_ID);

  return (
    <div className="w-full h-full relative overflow-hidden bg-[#07060B]/50 rounded-lg border border-[#7C3AED]/10">
      {/* Background Grid/Runes */}
      <div className="absolute inset-0 opacity-10 pointer-events-none" 
        style={{ 
          backgroundImage: `radial-gradient(#7C3AED 0.5px, transparent 0.5px)`, 
          backgroundSize: '30px 30px' 
        }} 
      />
      
      <svg className="w-full h-full" viewBox="0 0 700 600">
        <defs>
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
          <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#7C3AED" stopOpacity="0.2" />
            <stop offset="50%" stopColor="#7C3AED" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#7C3AED" stopOpacity="0.2" />
          </linearGradient>
        </defs>

        {/* Connections */}
        {CONNECTIONS.map((conn, idx) => {
          if (conn.to === "6" && !hasResonanceUnlock) return null;

          const from = ROOMS.find(r => r.id === conn.from)!;
          const to = ROOMS.find(r => r.id === conn.to)!;
          const isKnown = from.status !== "undiscovered" && to.status !== "undiscovered";

          return (
            <motion.line
              key={`conn-${idx}`}
              x1={from.x} y1={from.y}
              x2={to.x} y2={to.y}
              stroke={conn.to === "6" ? "#00FFD4" : "url(#lineGrad)"}
              strokeWidth="2"
              strokeDasharray={conn.to === "6" ? "4 4" : "6 4"}
              initial={{ opacity: 0 }}
              animate={{ 
                opacity: isKnown ? 1 : 0.1,
                strokeDashoffset: [0, -20]
              }}
              transition={{ 
                strokeDashoffset: { duration: 2, repeat: Infinity, ease: "linear" },
                opacity: { duration: 1 }
              }}
            />
          );
        })}

        {/* Rooms */}
        {ROOMS.map((room) => {
          if (room.id === "6" && !hasResonanceUnlock) return null;
          return <RoomIcon key={room.id} room={room} />;
        })}
      </svg>
    </div>
  );
}

function RoomIcon({ room }: { room: RoomNode }) {
  const isCurrent = room.status === "current";
  const isCleared = room.status === "cleared";
  const isUndiscovered = room.status === "undiscovered";
  const isLocked = room.status === "locked";
  const isBoss = room.type === "boss";

  const getColors = () => {
    if (room.id === "6") return { border: "#00FFD4", glow: "#00FFD4", bg: "#051A18" };
    if (isCurrent) return { border: "#F0A500", glow: "#F0A500", bg: "#1A150A" };
    if (isCleared) return { border: "#7C3AED", glow: "#7C3AED", bg: "#0C0A18" };
    if (isUndiscovered) return { border: "#2D2850", glow: "transparent", bg: "#05040A" };
    if (isLocked) return { border: "#4B456A", glow: "transparent", bg: "#05040A" };
    return { border: "#7C3AED", glow: "#7C3AED", bg: "#0C0A18" };
  };

  const colors = getColors();

  return (
    <motion.g
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ scale: 1.1 }}
      className="cursor-pointer"
    >
      {/* Outer Glow */}
      {(isCurrent || isBoss) && (
        <motion.circle
          cx={room.x} cy={room.y} r={28}
          fill="none"
          stroke={isBoss ? "#F87171" : "#F0A500"}
          strokeWidth="1"
          animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      )}

      {/* Hexagon Room Shape */}
      <motion.path
        d={getHexPath(room.x, room.y, isBoss ? 32 : 22)}
        fill={colors.bg}
        stroke={colors.border}
        strokeWidth="2"
        filter={isCurrent ? "url(#glow)" : ""}
        animate={isBoss ? { stroke: ["#F87171", "#7F1D1D", "#F87171"] } : {}}
        transition={{ duration: 3, repeat: Infinity }}
      />

      {/* Icon */}
      <foreignObject x={room.x - 10} y={room.y - 10} width="20" height="20">
        <div className="flex items-center justify-center w-full h-full text-white">
          {room.type === "start" && <Shield size={14} className="text-[#7C3AED]" />}
          {room.type === "monster" && <Skull size={14} className={isCleared ? "text-[#4B456A]" : "text-[#F87171]"} />}
          {room.type === "loot" && <Star size={14} className="text-[#FACC15]" />}
          {room.type === "boss" && <Crown size={16} className="text-[#F87171]" />}
          {room.status === "locked" && <Lock size={14} className="text-[#4B456A]" />}
        </div>
      </foreignObject>

      {/* Label */}
      {!isUndiscovered && (
        <text
          x={room.x} y={room.y + 40}
          textAnchor="middle"
          className="fill-[#9D93C0] text-[9px] font-['Cinzel'] tracking-widest uppercase pointer-events-none"
        >
          {room.label}
        </text>
      )}
    </motion.g>
  );
}

function getHexPath(x: number, y: number, r: number) {
  const points = [];
  for (let i = 0; i < 6; i++) {
    const angle = (Math.PI / 3) * i - Math.PI / 6;
    points.push(`${x + r * Math.cos(angle)},${y + r * Math.sin(angle)}`);
  }
  return `M ${points.join(" L ")} Z`;
}
