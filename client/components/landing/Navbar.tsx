"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Swords, Menu, X, Zap } from "lucide-react";

const navLinks = [
  { label: "Features", href: "#features" },
  { label: "Powers", href: "#powers" },
  { label: "Bosses", href: "#boss" },
  { label: "Leaderboard", href: "#leaderboard" },
  { label: "Profile", href: "#profile" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-[rgba(2,4,8,0.92)] backdrop-blur-xl border-b border-[rgba(0,212,255,0.15)] shadow-[0_4px_40px_rgba(0,212,255,0.08)]"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <motion.a
          href="#"
          className="flex items-center gap-3 group"
          whileHover={{ scale: 1.02 }}
        >
          <div className="relative">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#00d4ff] to-[#8b5cf6] p-0.5 group-hover:shadow-[0_0_20px_rgba(0,212,255,0.6)] transition-shadow duration-300">
              <div className="w-full h-full rounded-[7px] bg-[#020408] flex items-center justify-center">
                <Swords className="w-5 h-5 text-[#00d4ff] group-hover:text-white transition-colors" />
              </div>
            </div>
            <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-[#ff6b35] animate-pulse-glow" />
          </div>
          <div>
            <span className="font-orbitron text-sm font-bold text-white tracking-widest uppercase leading-none">
              Dungeon<span className="text-[#00d4ff]">.</span>
            </span>
            <div className="text-[10px] font-mono-tech text-[#00d4ff] tracking-[0.3em] opacity-70">OF ALGORITHMS</div>
          </div>
        </motion.a>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link, i) => (
            <motion.a
              key={link.href}
              href={link.href}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * i + 0.3 }}
              className="font-rajdhani text-sm font-600 text-slate-400 hover:text-[#00d4ff] transition-all duration-300 relative group tracking-wider uppercase"
            >
              {link.label}
              <span className="absolute -bottom-1 left-0 w-0 h-px bg-gradient-to-r from-[#00d4ff] to-[#8b5cf6] group-hover:w-full transition-all duration-300" />
            </motion.a>
          ))}
        </div>

        {/* CTA */}
        <div className="hidden md:flex items-center gap-3">
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="btn-primary px-5 py-2 rounded-lg text-xs flex items-center gap-2 cursor-pointer"
          >
            <Zap className="w-3.5 h-3.5" />
            Enter Dungeon
          </motion.button>
        </div>

        {/* Mobile Toggle */}
        <button
          className="md:hidden text-slate-400 hover:text-white transition-colors"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-[rgba(2,4,8,0.98)] backdrop-blur-xl border-b border-[rgba(0,212,255,0.15)] px-6 pb-6"
          >
            <div className="flex flex-col gap-4 pt-4">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="font-rajdhani text-base font-600 text-slate-300 hover:text-[#00d4ff] transition-colors uppercase tracking-wider py-2 border-b border-[rgba(0,212,255,0.08)]"
                >
                  {link.label}
                </a>
              ))}
              <button className="btn-primary px-5 py-3 rounded-lg text-sm mt-2 cursor-pointer">
                Enter Dungeon
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
