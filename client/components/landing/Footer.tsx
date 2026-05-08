"use client";

import { motion } from "motion/react";
import { Link, X, Globe, Video } from "lucide-react";

const RUNE_SYMBOLS = ["∆", "Ω", "Σ", "∇", "∞", "⬡", "⊕", "⊗", "◈", "▣", "◧", "✦"];

const footerLinks = {
  Game: ["Enter Dungeon", "Boss Arena", "Leaderboard", "Algorithm Powers", "Patch Notes"],
  Learn: ["DSA Challenges", "Algorithm Guide", "Video Tutorials", "Community Wiki", "Discord Server"],
  Company: ["About Us", "Press Kit", "Careers", "Contact", "Privacy Policy"],
};

const socialLinks = [
  { icon: Link, label: "GitHub", color: "#e2e8f0" },
  { icon: X, label: "Twitter/X", color: "#1da1f2" },
  { icon: Globe, label: "Twitch", color: "#9146ff" },
  { icon: Video, label: "YouTube", color: "#ff0000" },
];

export default function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-[rgba(0,212,255,0.08)]">
      {/* BG */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#010204] to-[#020408]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_40%_at_50%_100%,rgba(139,92,246,0.04),transparent)]" />
      <div className="absolute inset-0 grid-pattern opacity-20" />

      {/* Animated runes row */}
      <div className="relative border-b border-[rgba(0,212,255,0.06)] py-4 overflow-hidden">
        <motion.div
          className="flex gap-10 items-center whitespace-nowrap"
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        >
          {[...RUNE_SYMBOLS, ...RUNE_SYMBOLS].map((sym, i) => (
            <span
              key={i}
              className="font-mono-tech text-lg select-none"
              style={{
                color: ["#00d4ff", "#8b5cf6", "#06ffd4", "#ff6b35"][i % 4],
                textShadow: `0 0 12px ${["#00d4ff", "#8b5cf6", "#06ffd4", "#ff6b35"][i % 4]}`,
                opacity: 0.3,
              }}
            >
              {sym}
            </span>
          ))}
        </motion.div>
      </div>

      <div className="relative max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#00d4ff] to-[#8b5cf6] p-0.5">
                <div className="w-full h-full rounded-[7px] bg-[#020408] flex items-center justify-center font-orbitron text-sm font-black text-[#00d4ff]">
                  DA
                </div>
              </div>
              <div>
                <div className="font-orbitron text-sm font-bold text-white tracking-widest">
                  DUNGEON OF<span className="text-[#00d4ff]">.</span>
                </div>
                <div className="font-mono-tech text-[10px] text-[#00d4ff] tracking-[0.3em] opacity-70">ALGORITHMS</div>
              </div>
            </div>
            <p className="font-rajdhani text-slate-500 text-base leading-relaxed mb-6 max-w-xs">
              The world&apos;s first cinematic dungeon RPG where programming skills are your weapons. Master DSA. Conquer the dungeon.
            </p>

            {/* Social Links */}
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <motion.a
                  key={social.label}
                  href="#"
                  aria-label={social.label}
                  whileHover={{ scale: 1.15, y: -2 }}
                  whileTap={{ scale: 0.9 }}
                  className="w-9 h-9 rounded-lg bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] flex items-center justify-center transition-all duration-300 hover:border-[rgba(0,212,255,0.3)]"
                >
                  <social.icon className="w-4 h-4 text-slate-500 hover:text-white transition-colors" />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <div className="font-orbitron text-xs font-bold text-white tracking-widest mb-5 flex items-center gap-2">
                <span className="w-4 h-px bg-[#00d4ff]" />
                {category}
              </div>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="font-rajdhani text-sm text-slate-500 hover:text-[#00d4ff] transition-colors duration-200 flex items-center gap-1.5 group"
                    >
                      <span className="w-0 group-hover:w-3 h-px bg-[#00d4ff] transition-all duration-200" />
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Newsletter */}
        <div
          className="rounded-2xl p-6 mb-12 flex flex-col sm:flex-row items-center gap-4"
          style={{
            background: "linear-gradient(135deg, rgba(0,212,255,0.05), rgba(139,92,246,0.05))",
            border: "1px solid rgba(0,212,255,0.12)",
          }}
        >
          <div className="flex-1">
            <div className="font-orbitron text-sm font-bold text-white mb-1">⚡ JOIN THE REALM</div>
            <div className="font-rajdhani text-sm text-slate-500">Get notified about new bosses, algorithm powers, and seasonal events.</div>
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <input
              type="email"
              placeholder="your@email.com"
              className="flex-1 sm:w-56 px-4 py-2.5 rounded-xl bg-[rgba(8,16,32,0.8)] border border-[rgba(0,212,255,0.15)] text-slate-300 font-rajdhani text-sm placeholder-slate-600 focus:outline-none focus:border-[rgba(0,212,255,0.4)] transition-colors"
            />
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              className="btn-primary px-5 py-2.5 rounded-xl text-sm cursor-pointer whitespace-nowrap"
            >
              Subscribe
            </motion.button>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-[rgba(255,255,255,0.04)]">
          <div className="font-mono-tech text-xs text-slate-700">
            © 2025 Dungeon of Algorithms · All rights reserved
          </div>

          {/* Live indicator */}
          <motion.div
            className="flex items-center gap-2 px-3 py-1.5 rounded-full"
            style={{ background: "rgba(6,255,212,0.05)", border: "1px solid rgba(6,255,212,0.15)" }}
          >
            <motion.div
              className="w-1.5 h-1.5 rounded-full bg-[#06ffd4]"
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
            <span className="font-mono-tech text-[10px] text-[#06ffd4] tracking-widest">42,891 WARRIORS ONLINE</span>
          </motion.div>

          <div className="font-mono-tech text-xs text-slate-700">v1.0.0 — Season 1</div>
        </div>
      </div>
    </footer>
  );
}
