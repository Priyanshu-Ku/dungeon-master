"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import dynamic from "next/dynamic";
import { ChevronDown, Zap, LogIn } from "lucide-react";

const ParticleField = dynamic(() => import("./ParticleField"), { ssr: false });
const PortalCanvas = dynamic(() => import("./PortalCanvas"), { ssr: false });

const FLOATING_SYMBOLS = [
  { sym: "O(n²)", x: "8%", y: "20%", color: "#00d4ff", size: 18, delay: 0 },
  { sym: "∑", x: "90%", y: "15%", color: "#8b5cf6", size: 28, delay: 0.5 },
  { sym: "∞", x: "5%", y: "65%", color: "#06ffd4", size: 24, delay: 1 },
  { sym: "BFS", x: "88%", y: "60%", color: "#ff6b35", size: 16, delay: 0.7 },
  { sym: "→", x: "15%", y: "80%", color: "#00d4ff", size: 22, delay: 1.5 },
  { sym: "∆", x: "82%", y: "80%", color: "#8b5cf6", size: 20, delay: 0.3 },
  { sym: "[]", x: "20%", y: "40%", color: "#06ffd4", size: 20, delay: 0.9 },
  { sym: "O(1)", x: "75%", y: "35%", color: "#ff0080", size: 14, delay: 1.2 },
  { sym: "DP", x: "10%", y: "50%", color: "#ff6b35", size: 16, delay: 0.4 },
  { sym: "Ω", x: "78%", y: "50%", color: "#00d4ff", size: 22, delay: 1.8 },
];

export default function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef });
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "40%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      setMousePos({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20,
      });
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden grid-pattern"
      id="hero"
    >
      {/* Deep bg layers */}
      <div className="absolute inset-0 bg-gradient-radial from-[rgba(20,0,50,0.6)] via-[rgba(2,4,8,0.8)] to-[#020408]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(0,212,255,0.08),transparent)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_110%,rgba(139,92,246,0.08),transparent)]" />

      {/* Particle field — full coverage */}
      <div className="absolute inset-0 pointer-events-none">
        <ParticleField count={130} />
      </div>

      {/* Fog / volumetric light */}
      <div className="absolute bottom-0 left-0 right-0 h-64 bg-gradient-to-t from-[rgba(139,92,246,0.06)] to-transparent pointer-events-none" />

      {/* Floating algorithm symbols (parallax) */}
      {FLOATING_SYMBOLS.map((s, i) => (
        <motion.div
          key={i}
          className="absolute font-mono-tech font-bold pointer-events-none select-none"
          style={{
            left: s.x,
            top: s.y,
            fontSize: s.size,
            color: s.color,
            textShadow: `0 0 20px ${s.color}, 0 0 40px ${s.color}`,
            x: mousePos.x * (i % 3 === 0 ? 0.8 : i % 3 === 1 ? 0.4 : 1.2),
            y: mousePos.y * (i % 3 === 0 ? 0.6 : i % 3 === 1 ? 1.0 : 0.3),
          }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: [0, 0.7, 0.5, 0.8], scale: 1 }}
          transition={{ delay: s.delay + 0.5, duration: 1.5, ease: "easeOut" }}
        >
          <motion.span
            animate={{ y: [0, -15, 0] }}
            transition={{ duration: 4 + i * 0.4, repeat: Infinity, ease: "easeInOut" }}
          >
            {s.sym}
          </motion.span>
        </motion.div>
      ))}

      {/* Main hero content */}
      <motion.div
        style={{ y: heroY, opacity: heroOpacity }}
        className="relative z-10 flex flex-col items-center text-center px-4"
      >
        {/* Status badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="mb-8 inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[rgba(0,212,255,0.3)] bg-[rgba(0,212,255,0.05)] backdrop-blur"
        >
          <span className="w-2 h-2 rounded-full bg-[#06ffd4] animate-pulse" />
          <span className="font-mono-tech text-xs text-[#06ffd4] tracking-widest uppercase">
            Season 1 — The Awakening
          </span>
        </motion.div>

        {/* Title */}
        <div className="relative mb-6">
          <motion.h1
            initial={{ opacity: 0, y: 40, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.4, duration: 1, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="font-orbitron text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black leading-none tracking-tight"
          >
            <span className="block text-white drop-shadow-2xl">DUNGEON</span>
            <span className="block gradient-text-blue animate-pulse-glow">OF</span>
            <span className="block text-white drop-shadow-2xl">ALGORITHMS</span>
          </motion.h1>
          {/* Cinematic underline */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 1, duration: 1 }}
            className="mt-3 h-0.5 bg-gradient-to-r from-transparent via-[#00d4ff] to-transparent"
          />
        </div>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="font-rajdhani text-lg sm:text-xl md:text-2xl text-slate-300 max-w-2xl leading-relaxed mb-12 tracking-wide"
        >
          <span className="text-[#00d4ff]">Defeat enemies.</span>{" "}
          <span className="text-[#8b5cf6]">Solve algorithms.</span>{" "}
          <span className="text-[#06ffd4]">Master the dungeon.</span>
        </motion.p>

        {/* Portal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6, duration: 1.2, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="relative mb-12"
          style={{
            x: mousePos.x * 0.3,
            y: mousePos.y * 0.2,
          }}
        >
          {/* Energy rings around portal */}
          {[280, 300, 320].map((size, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full border border-[rgba(0,212,255,0.1)] pointer-events-none"
              style={{
                width: size,
                height: size,
                top: "50%",
                left: "50%",
                marginTop: -size / 2,
                marginLeft: -size / 2,
              }}
              animate={{ rotate: 360, scale: [1, 1.02, 1] }}
              transition={{ duration: 8 + i * 4, repeat: Infinity, ease: "linear" }}
            />
          ))}
          {/* Outer glow */}
          <div className="absolute inset-[-40px] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(139,92,246,0.15),transparent_70%)] pointer-events-none" />
          <div className="w-[340px] h-[340px] sm:w-[420px] sm:h-[420px] relative">
            <PortalCanvas />
          </div>
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0, duration: 0.8 }}
          className="flex flex-col sm:flex-row gap-4 items-center"
        >
          <motion.button
            whileHover={{ scale: 1.05, y: -3 }}
            whileTap={{ scale: 0.97 }}
            className="relative group btn-primary px-10 py-4 rounded-xl text-base font-bold cursor-pointer flex items-center gap-3 overflow-hidden"
          >
            {/* Animated shine */}
            <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12 pointer-events-none" />
            <Zap className="w-5 h-5" />
            Enter Dungeon
            <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-[0_0_40px_rgba(0,212,255,0.5)] pointer-events-none" />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05, y: -3 }}
            whileTap={{ scale: 0.97 }}
            className="relative group flex items-center gap-3 px-10 py-4 rounded-xl border border-[rgba(255,255,255,0.15)] bg-[rgba(255,255,255,0.04)] backdrop-blur text-slate-300 hover:text-white hover:border-white/30 transition-all duration-300 font-rajdhani text-base font-600 tracking-wide cursor-pointer"
          >
            <div className="w-5 h-5 flex items-center justify-center">
              <svg viewBox="0 0 24 24" className="w-4 h-4">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
            </div>
            <LogIn className="w-4 h-4" />
            Sign in with Google
          </motion.button>
        </motion.div>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4, duration: 0.8 }}
          className="mt-16 flex items-center gap-8 sm:gap-16"
        >
          {[
            { label: "Players", value: "42,891", color: "#00d4ff" },
            { label: "Algorithms", value: "200+", color: "#8b5cf6" },
            { label: "Bosses Slain", value: "1.2M", color: "#ff6b35" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div
                className="font-orbitron text-2xl sm:text-3xl font-black"
                style={{ color: stat.color, textShadow: `0 0 20px ${stat.color}` }}
              >
                {stat.value}
              </div>
              <div className="font-rajdhani text-xs text-slate-500 tracking-widest uppercase mt-1">
                {stat.label}
              </div>
            </div>
          ))}
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <span className="font-mono-tech text-[10px] text-slate-600 tracking-widest uppercase">Scroll</span>
        <ChevronDown className="w-5 h-5 text-[rgba(0,212,255,0.5)]" />
      </motion.div>
    </section>
  );
}
