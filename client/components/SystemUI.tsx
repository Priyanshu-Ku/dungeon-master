import React from "react";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import { Lock } from "lucide-react";
import { motion } from "motion/react";

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   PANEL SYSTEM
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

interface PanelProps {
  children: React.ReactNode;
  variant?: "default" | "rune" | "stone";
  topBorder?: "gold" | "arcane" | "none";
  padding?: "compact" | "standard" | "modal";
  className?: string;
}

export function Panel({
  children,
  variant = "default",
  topBorder = "none",
  padding = "standard",
  className = "",
}: PanelProps) {
  const isRune = variant === "rune";
  const isStone = variant === "stone";
  
  const paddingMap = {
    compact: "p-4", 
    standard: "p-6", 
    modal: "p-8", 
  };

  const radiusMap = {
    compact: "rounded-[2px]",
    standard: "rounded-[4px]",
    modal: "rounded-[8px]",
  };

  return (
    <div
      className={`relative border transition-all duration-500 ${radiusMap[padding]} ${
        isStone 
          ? "bg-[#13111C] border-[#322D46] shadow-[0_10px_40px_rgba(0,0,0,0.8),inset_0_0_20px_rgba(0,0,0,0.5)]" 
          : "bg-[#0C0A18] border-[#2D2850] shadow-[0_4px_20px_rgba(0,0,0,0.5)]"
      } ${
        isRune ? "shadow-[0_0_25px_#7C3AED30]" : ""
      } ${paddingMap[padding]} ${className}`}
    >
      {/* Texture Overlays */}
      {isStone && (
        <div className="absolute inset-0 opacity-[0.15] pointer-events-none mix-blend-overlay bg-[url('https://www.transparenttextures.com/patterns/granite.png')] z-0" />
      )}
      
      {/* Inner Bevel Line */}
      <div className={`absolute inset-[1px] border-[0.5px] border-white/5 pointer-events-none ${radiusMap[padding]} z-10`} />

      {/* Optional Top Borders */}
      {topBorder === "gold" && (
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#F0A500] to-transparent z-20" />
      )}
      {topBorder === "arcane" && (
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#7C3AED] to-transparent z-20" />
      )}

      {/* Decorations */}
      {(isRune || isStone) && (
        <>
          {/* Corner Carvings */}
          <div className="absolute top-0 left-0 w-4 h-4 pointer-events-none z-20 opacity-40">
            <div className="absolute top-[4px] left-[6px] w-[1px] h-[6px] bg-current" />
            <div className="absolute top-[6px] left-[4px] w-[6px] h-[1px] bg-current" />
          </div>
          <div className="absolute bottom-0 right-0 w-4 h-4 pointer-events-none z-20 opacity-40">
            <div className="absolute bottom-[4px] right-[6px] w-[1px] h-[6px] bg-current" />
            <div className="absolute bottom-[6px] right-[4px] w-[6px] h-[1px] bg-current" />
          </div>
        </>
      )}

      {/* Content */}
      <div className="relative z-10">{children}</div>
    </div>
  );
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   STAT BARS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

interface StatBarProps {
  type: "hp" | "mp" | "xp";
  value: number;
  max: number;
  label?: string;
}

export function StatBar({ type, value, max, label }: StatBarProps) {
  const config = {
    hp: {
      track: "bg-[#1A0A0A]",
      fill: "bg-gradient-to-r from-[#7F1D1D] to-[#DC2626]",
      glow: "shadow-[0_0_15px_rgba(220,38,38,0.4)]",
      textColor: "text-[#F87171]",
      borderColor: "border-[#7F1D1D]/50",
    },
    mp: {
      track: "bg-[#0A0B1A]",
      fill: "bg-gradient-to-r from-[#1E3A8A] to-[#3B82F6]",
      glow: "shadow-[0_0_15px_rgba(59,130,246,0.4)]",
      textColor: "text-[#60A5FA]",
      borderColor: "border-[#1E3A8A]/50",
    },
    xp: {
      track: "bg-[#0F0A1A]",
      fill: "bg-gradient-to-r from-[#4C1D95] to-[#8B5CF6]",
      glow: "shadow-[0_0_15px_rgba(139,92,246,0.4)]",
      textColor: "text-[#A78BFA]",
      borderColor: "border-[#4C1D95]/50",
    },
  }[type];

  const percent = Math.min(100, Math.max(0, (value / max) * 100));

  return (
    <div className="flex flex-col gap-1.5 w-full group">
      <div className="flex justify-between items-end px-0.5">
        {label && (
          <span className={`${config.textColor} text-[10px] font-['Cinzel'] tracking-[0.2em] font-bold uppercase drop-shadow-md`}>
            {label}
          </span>
        )}
        <span className="text-[#9D93C0] text-[9px] font-mono opacity-60 group-hover:opacity-100 transition-opacity">
          {value} / {max}
        </span>
      </div>
      <div className={`h-3 w-full ${config.track} rounded-[2px] border ${config.borderColor} relative overflow-hidden shadow-2xl`}>
        {/* Background Subtle Pattern */}
        <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
        
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percent}%` }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className={`h-full ${config.fill} ${config.glow} relative`}
        >
          {/* Surface highlights */}
          <div className="absolute top-0 left-0 right-0 h-[40%] bg-white/10" />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-12" />
          
          {/* Animated Sheen */}
          <motion.div 
            animate={{ x: ["-100%", "200%"] }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            className="absolute inset-y-0 w-20 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12"
          />
        </motion.div>
      </div>
    </div>
  );
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   BUTTON SYSTEM
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "ghost" | "danger";
  children: React.ReactNode;
}

export function Button({ variant = "primary", children, className = "", ...props }: ButtonProps) {
  const baseStyle =
    "px-6 py-[10px] rounded-[6px] font-['Cinzel'] font-semibold tracking-[0.15em] transition-all duration-200 flex items-center justify-center gap-2 text-[13px] uppercase relative overflow-hidden group active:scale-[0.97]";

  const variants = {
    primary:
      "bg-gradient-to-br from-[#7C3AED] to-[#5B21B6] text-white border border-[#A78BFA]/40 shadow-[0_0_16px_#7C3AED80] hover:brightness-115 hover:-translate-y-[1px]",
    ghost:
      "bg-transparent border border-[#4A3060] text-[#A78BFA] hover:bg-[#7C3AED10] hover:border-[#7C3AED]",
    danger:
      "bg-gradient-to-br from-[#DC2626] to-[#991B1B] text-white border border-[#EF4444]/40 shadow-[0_0_16px_#EF444480] hover:brightness-115 hover:-translate-y-[1px]",
  };

  return (
    <button className={`${baseStyle} ${variants[variant]} ${className}`} {...props}>
      <span className="relative z-10 flex items-center gap-2">{children}</span>
    </button>
  );
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   INPUT SYSTEM
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export function Input({ label, className = "", ...props }: InputProps) {
  return (
    <div className="flex flex-col gap-2 w-full">
      {label && (
        <label className="text-[#7A5A10] font-['Cinzel'] text-[10px] tracking-[0.1em] uppercase">
          {label}
        </label>
      )}
      <input
        className={`bg-[#0E0B1E] border border-[#2D2850] rounded-[4px] px-3 h-[44px] text-[#C4B5FD] font-['Lato'] text-[14px] outline-none transition-all placeholder:text-[#4B456A] focus:border-[#7C3AED] focus:shadow-[0_0_0_2px_#7C3AED40] ${className}`}
        {...props}
      />
    </div>
  );
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   BADGE SYSTEM
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

interface BadgeProps {
  variant: "apprentice" | "knight" | "boss" | "category";
  children: React.ReactNode;
}

export function Badge({ variant, children }: BadgeProps) {
  const styles = {
    apprentice: "bg-[#1A0F35] text-[#A78BFA] border-[#4A3060]",
    knight: "bg-[#0F1A10] text-[#4ADE80] border-[#1A3A1A]",
    boss: "bg-[#1A0505] text-[#F87171] border-[#5A1515]",
    category: "bg-[#0F0A20] text-[#7C3AED] border-[#2D2447]",
  }[variant];

  return (
    <span
      className={`px-2.5 h-[22px] rounded-[6px] border text-[10px] tracking-[0.1em] uppercase font-['Cinzel'] ${styles} whitespace-nowrap inline-flex items-center justify-center`}
    >
      {children}
    </span>
  );
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   CARD SYSTEM
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

interface ItemCardProps {
  locked?: boolean;
  title: string;
  description: string;
  icon?: React.ElementType;
}

export function ItemCard({ locked, title, description, icon: Icon }: ItemCardProps) {
  if (locked) {
    return (
      <div className="w-[100px] h-[120px] bg-[#0C0A18] border border-[#1A1830] rounded-sm flex flex-col items-center justify-center text-center opacity-60 grayscale p-2 relative">
        <Lock size={20} className="text-[#9D93C0] mb-1" />
        <h4 className="font-['Cinzel'] text-[#9D93C0] text-[10px] mb-1 line-clamp-1">{title}</h4>
      </div>
    );
  }

  return (
    <div className="w-[100px] h-[120px] bg-[#1E1A35] border border-[#F0A500] rounded-sm flex flex-col items-center text-center relative group cursor-pointer transition-all hover:shadow-[0_0_20px_#F0A50040]">
      {/* Top Gold Rule */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-[#F0A500]" />
      
      {/* Icon Area */}
      <div className="flex-1 flex items-center justify-center pt-2">
        <div className="relative">
          {/* Inner Glow matching icon */}
          <div className="absolute inset-0 blur-lg opacity-40 bg-[#F0A500]" />
          <div className="relative z-10 text-[#F0A500]">
            {Icon && <Icon size={24} />}
          </div>
        </div>
      </div>
      
      {/* Info Area */}
      <div className="p-2 pt-0 w-full bg-[#0C0A18]/40">
        <h4 className="font-['Cinzel'] text-[#E2D9F3] text-[11px] mb-0.5 line-clamp-1">{title}</h4>
        <p className="font-['Lato'] text-[9px] text-[#9D93C0] leading-tight line-clamp-2">
          {description}
        </p>
      </div>
    </div>
  );
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   TOOLTIPS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

interface TooltipProps {
  children: React.ReactNode;
  content: string;
}

export function Tooltip({ children, content }: TooltipProps) {
  return (
    <TooltipPrimitive.Provider delayDuration={150}>
      <TooltipPrimitive.Root>
        <TooltipPrimitive.Trigger asChild>
          {children}
        </TooltipPrimitive.Trigger>
        <TooltipPrimitive.Portal>
          <TooltipPrimitive.Content
            sideOffset={8}
            className="z-[200] max-w-[220px] bg-[#1E1A35] border border-[#2D2850] rounded-sm px-3 py-2 shadow-[0_4px_20px_rgba(0,0,0,0.5),0_0_15px_#7C3AED30] relative data-[state=delayed-open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=delayed-open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=delayed-open]:zoom-in-95 duration-200"
          >
            {/* Inner Bevel for Tooltip */}
            <div className="absolute inset-[1px] border-[0.5px] border-[#2D2850]/50 pointer-events-none rounded-sm" />
            
            {/* Gold Rune Marks (Simplified for Tooltip) */}
            <div className="absolute top-0.5 left-0.5 w-1.5 h-1.5 border-t border-l border-[#F0A500]/40" />
            <div className="absolute bottom-0.5 right-0.5 w-1.5 h-1.5 border-b border-r border-[#F0A500]/40" />
            
            <span className="font-['Lato'] text-[12px] text-[#C4B5FD] relative z-10">{content}</span>
            <TooltipPrimitive.Arrow className="fill-[#1E1A35] [&>polygon]:stroke-[#2D2850] stroke-1" width={12} height={6} />
          </TooltipPrimitive.Content>
        </TooltipPrimitive.Portal>
      </TooltipPrimitive.Root>
    </TooltipPrimitive.Provider>
  );
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   DIVIDERS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

interface DividerProps {
  label?: string;
  icon?: React.ElementType;
}

export function Divider({ label, icon: Icon }: DividerProps) {
  return (
    <div className="relative flex items-center py-6 w-full">
      <div className="flex-grow border-t border-[#2D2850]" />
      <div className="absolute left-1/2 -translate-x-1/2 flex items-center justify-center">
        {!label && !Icon && <div className="w-1 h-1 bg-[#4A3060] rotate-45" />}
        {Icon && <Icon size={16} className="text-[#4A3060]" />}
      </div>
      {label && (
        <div className="mx-auto bg-[#07060F] px-4 relative z-10">
          <span className="font-['Cinzel'] text-xs tracking-[0.2em] uppercase text-[#F0A500]">
            {label}
          </span>
        </div>
      )}
      <div className="flex-grow border-t border-[#2D2850]" />
    </div>
  );
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   BOSS STATUS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

interface BossBarProps {
  name: string;
  title?: string;
  health: number;
  maxHealth: number;
}

export function BossBar({ name, title, health, maxHealth }: BossBarProps) {
  const percent = Math.min(100, Math.max(0, (health / maxHealth) * 100));

  return (
    <div className="w-full max-w-3xl flex flex-col items-center gap-3 relative">
      {/* Name and Title with specific Elden Ring style */}
      <div className="flex flex-col items-center mb-1">
        <h2 
          className="text-[#F0A500] text-3xl tracking-[0.25em] uppercase font-['Cinzel_Decorative'] drop-shadow-[0_2px_10px_rgba(240,165,0,0.5)]"
          style={{ fontFamily: "'Cinzel Decorative', serif" }}
        >
          {name}
        </h2>
        {title && (
          <span className="text-[#7A5A10] text-[11px] tracking-[0.4em] uppercase font-['Cinzel'] mt-1 opacity-80">
            {title}
          </span>
        )}
      </div>
      
      {/* Health Bar Container */}
      <div className="w-full h-2.5 bg-[#07060F] border border-[#2D2850] relative overflow-hidden shadow-[0_0_25px_rgba(239,68,68,0.15)] group">
        {/* Background Damage Bar (Catch-up effect) */}
        <div className="absolute inset-0 bg-[#3F0F0F]" />
        
        {/* Main Health Bar */}
        <motion.div 
          className="absolute top-0 bottom-0 left-0 bg-gradient-to-r from-[#7f2424] via-[#EF4444] to-[#ff5f5f] z-10"
          initial={{ width: "100%" }}
          animate={{ width: `${percent}%` }}
          transition={{ duration: 1.5, ease: "circOut" }}
        >
          {/* Surface Gloss */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent pointer-events-none" />
        </motion.div>

        {/* Vertical Ticks */}
        <div className="absolute inset-0 flex justify-between px-0.5 pointer-events-none z-20 opacity-20">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="h-full w-px bg-white/50" />
          ))}
        </div>
      </div>

      {/* Rune Decorations (Elden Ring style) */}
      <div className="absolute -left-12 top-1/2 -translate-y-1/2 flex flex-col items-center gap-1 opacity-40">
        <div className="w-1 h-8 bg-gradient-to-b from-transparent via-[#F0A500] to-transparent" />
        <div className="w-2 h-2 border border-[#F0A500] rotate-45" />
      </div>
      <div className="absolute -right-12 top-1/2 -translate-y-1/2 flex flex-col items-center gap-1 opacity-40">
        <div className="w-1 h-8 bg-gradient-to-b from-transparent via-[#F0A500] to-transparent" />
        <div className="w-2 h-2 border border-[#F0A500] rotate-45" />
      </div>
    </div>
  );
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   PORTRAIT SYSTEM
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

interface PortraitFrameProps {
  image: string;
  name: string;
  side?: "left" | "right";
  active?: boolean;
}

export function PortraitFrame({ image, name, side = "left", active = true }: PortraitFrameProps) {
  return (
    <div className={`relative ${side === 'right' ? 'scale-x-1' : ''}`}>
      {/* Outer Border with Glow */}
      <div className={`relative w-32 h-40 border-2 transition-all duration-500 rounded-sm overflow-hidden ${
        active ? 'border-[#7C3AED] shadow-[0_0_25px_rgba(124,58,237,0.4)]' : 'border-[#2D2850] opacity-40 grayscale'
      }`}>
        {/* Image with Rim Light */}
        <div className="absolute inset-0 overflow-hidden bg-[#0C0A18]">
          <img 
            src={image} 
            alt={name} 
            className={`w-full h-full object-cover transition-all duration-700 ${
              active ? 'scale-110' : 'scale-100'
            }`} 
          />
          {/* Dark Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#07060F] via-transparent to-transparent opacity-80" />
          
          {/* Animated Magic Rim Light */}
          {active && (
            <motion.div 
              className="absolute inset-0 border border-white/20 mix-blend-overlay"
              animate={{ opacity: [0.3, 0.6, 0.3] }}
              transition={{ repeat: Infinity, duration: 3 }}
            />
          )}
        </div>

        {/* Decorative Corners (Gold Filigree Style) */}
        <div className="absolute -top-[1px] -left-[1px] w-4 h-4 border-t-2 border-l-2 border-[#F0A500] z-20" />
        <div className="absolute -bottom-[1px] -right-[1px] w-4 h-4 border-b-2 border-r-2 border-[#F0A500] z-20" />
      </div>

      {/* Name Label */}
      <div className={`absolute -bottom-3 left-1/2 -translate-x-1/2 bg-[#0C0A18] border border-[#2D2850] px-4 py-1 shadow-lg z-30`}>
        <span className="text-[#F0A500] text-[11px] font-['Cinzel'] tracking-[0.2em] uppercase font-bold">
          {name}
        </span>
      </div>
    </div>
  );
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   MISC
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

export function EnergyRing({ progress, size = 64, color = "#7C3AED" }: { progress: number, size?: number, color?: string }) {
  const radius = (size - 8) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <svg width={size} height={size} className="absolute inset-0 -rotate-90 pointer-events-none drop-shadow-[0_0_8px_rgba(124,58,237,0.5)]">
      {/* Background Track */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="#1E1A35"
        strokeWidth="3"
        className="opacity-50"
      />
      {/* Animated Progress */}
      <motion.circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke={color}
        strokeWidth="3"
        strokeLinecap="round"
        strokeDasharray={circumference}
        initial={{ strokeDashoffset: circumference }}
        animate={{ strokeDashoffset: offset }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
      />
      {/* Highlight Tip */}
      <motion.circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="white"
        strokeWidth="1"
        className="opacity-40"
        strokeDasharray={circumference}
        animate={{ strokeDashoffset: offset }}
      />
    </svg>
  );
}
