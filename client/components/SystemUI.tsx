import React from "react";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import { Lock } from "lucide-react";
import { motion } from "motion/react";

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   PANEL SYSTEM
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

interface PanelProps {
  children: React.ReactNode;
  variant?: "default" | "rune";
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
  
  const paddingMap = {
    compact: "p-4", // 16px
    standard: "p-6", // 24px
    modal: "p-8", // 32px
  };

  return (
    <div
      className={`relative bg-[#0C0A18] border border-[#2D2850] rounded-md shadow-[inset_0_1px_1px_rgba(255,255,255,0.03),inset_0_-2px_6px_rgba(0,0,0,0.6)] ${
        isRune ? "border-[#7C3AED]/40 shadow-[0_0_20px_rgba(124,58,237,0.15),inset_0_1px_1px_rgba(255,255,255,0.03)]" : ""
      } ${paddingMap[padding]} ${className}`}
    >
      {/* Optional Top Borders */}
      {topBorder === "gold" && (
        <div className="absolute top-0 left-0 right-0 h-1 rounded-t-md bg-gradient-to-r from-transparent via-[#F0A500] to-transparent opacity-80" />
      )}
      {topBorder === "arcane" && (
        <div className="absolute top-0 left-0 right-0 h-1 rounded-t-md bg-gradient-to-r from-transparent via-[#7C3AED] to-transparent opacity-80" />
      )}

      {/* Rune Corner Decorations */}
      {isRune && (
        <>
          <div className="absolute top-1.5 left-1.5 w-2.5 h-2.5 border-t border-l border-[#A78BFA] opacity-60" />
          <div className="absolute top-1.5 right-1.5 w-2.5 h-2.5 border-t border-r border-[#A78BFA] opacity-60" />
          <div className="absolute bottom-1.5 left-1.5 w-2.5 h-2.5 border-b border-l border-[#A78BFA] opacity-60" />
          <div className="absolute bottom-1.5 right-1.5 w-2.5 h-2.5 border-b border-r border-[#A78BFA] opacity-60" />
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
      track: "bg-[#1E1A35]",
      fill: "bg-gradient-to-r from-[#7f2424] to-[#EF4444]",
      glow: "shadow-[0_0_12px_rgba(239,68,68,0.5)]",
      textColor: "text-[#EF4444]",
    },
    mp: {
      track: "bg-[#1E1A35]",
      fill: "bg-gradient-to-r from-[#1e40af] to-[#3B82F6]",
      glow: "shadow-[0_0_12px_rgba(59,130,246,0.5)]",
      textColor: "text-[#3B82F6]",
    },
    xp: {
      track: "bg-[#1E1A35]",
      fill: "bg-gradient-to-r from-[#442182] to-[#7C3AED]",
      glow: "shadow-[0_0_12px_rgba(124,58,237,0.5)]",
      textColor: "text-[#7C3AED]",
    },
  }[type];

  const percent = Math.min(100, Math.max(0, (value / max) * 100));

  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && (
        <div className="flex justify-between items-end text-xs tracking-widest uppercase font-['Cinzel']">
          <span className="text-[#9D93C0]">{label}</span>
          <span className={`${config.textColor} font-bold`}>
            {value} <span className="text-[#9D93C0]/50 font-normal">/ {max}</span>
          </span>
        </div>
      )}
      <div className={`h-2 w-full ${config.track} rounded-full overflow-hidden border border-[#2D2850] shadow-[inset_0_2px_4px_rgba(0,0,0,0.5)]`}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percent}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className={`h-full ${config.fill} ${config.glow}`}
        />
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
    "px-6 py-2.5 rounded font-['Cinzel'] font-bold tracking-wider transition-all duration-200 flex items-center justify-center gap-2 text-sm uppercase relative overflow-hidden group";

  const variants = {
    primary:
      "bg-gradient-to-b from-[#7C3AED] to-[#442182] text-white border border-[#A78BFA]/40 shadow-[0_0_15px_rgba(124,58,237,0.3)] hover:shadow-[0_0_25px_rgba(124,58,237,0.6)] hover:-translate-y-0.5",
    ghost:
      "bg-transparent border border-[#7C3AED]/60 text-[#A78BFA] hover:bg-[#7C3AED]/10 hover:border-[#7C3AED] hover:-translate-y-0.5",
    danger:
      "bg-gradient-to-b from-[#EF4444] to-[#7f2424] text-white border border-[#EF4444]/50 shadow-[0_0_15px_rgba(239,68,68,0.3)] hover:shadow-[0_0_25px_rgba(239,68,68,0.6)] hover:-translate-y-0.5",
  };

  return (
    <button className={`${baseStyle} ${variants[variant]} ${className}`} {...props}>
      {/* Hover Light Overlay */}
      <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity pointer-events-none" />
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
        <label className="text-[#F0A500] font-['Cinzel'] text-xs tracking-widest uppercase">
          {label}
        </label>
      )}
      <input
        className={`bg-[#1E1A35] border border-[#7C3AED]/40 rounded px-4 py-2.5 text-[#E2D9F3] font-['Inter'] text-sm outline-none transition-all placeholder:text-[#9D93C0]/40 focus:border-[#7C3AED] focus:shadow-[0_0_15px_rgba(124,58,237,0.3)] ${className}`}
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
    apprentice: "border-[#7C3AED]/60 text-[#A78BFA] bg-[#7C3AED]/10 shadow-[0_0_10px_rgba(124,58,237,0.2)]",
    knight: "border-[#4ADE80]/60 text-[#4ADE80] bg-[#4ADE80]/10 shadow-[0_0_10px_rgba(74,222,128,0.2)]",
    boss: "border-[#EF4444]/60 text-[#EF4444] bg-[#EF4444]/10 shadow-[0_0_10px_rgba(239,68,68,0.2)]",
    category: "border-[#2D2850] text-[#A78BFA] bg-[#0C0A18]",
  }[variant];

  return (
    <span
      className={`px-2.5 py-0.5 rounded-sm border text-[10px] tracking-[0.15em] uppercase font-['Cinzel'] ${styles} whitespace-nowrap inline-flex items-center justify-center`}
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
      <div className="bg-[#0C0A18] border border-[#1E1A35] rounded-md p-4 flex flex-col items-center text-center opacity-50 grayscale relative overflow-hidden">
        <div className="absolute inset-0 bg-[#07060F]/70 z-10 flex items-center justify-center backdrop-blur-[1px]">
          <Lock size={24} className="text-[#9D93C0]" />
        </div>
        <div className="w-12 h-12 rounded-full bg-[#1E1A35] flex items-center justify-center mb-3 text-[#9D93C0] border border-[#2D2850]">
          {Icon && <Icon size={20} />}
        </div>
        <h4 className="font-['Cinzel'] text-[#9D93C0] text-sm mb-1.5">{title}</h4>
        <p className="font-['Inter'] text-[11px] text-[#9D93C0]/70 leading-relaxed">
          {description}
        </p>
      </div>
    );
  }

  return (
    <div className="bg-[#13102A] border border-[#F0A500]/50 rounded-md p-4 flex flex-col items-center text-center shadow-[inset_0_0_20px_rgba(240,165,0,0.05),0_4px_15px_rgba(0,0,0,0.5)] relative overflow-hidden group hover:-translate-y-1 transition-transform cursor-pointer">
      {/* Top Gold Accent Line */}
      <div className="absolute top-0 w-full h-1 bg-gradient-to-r from-transparent via-[#F0A500] to-transparent opacity-60" />
      
      {/* Icon Wrapper */}
      <div className="w-12 h-12 rounded-full border border-[#F0A500]/40 bg-[#1E1A35] flex items-center justify-center mb-3 text-[#F0A500] shadow-[0_0_15px_rgba(240,165,0,0.3)] group-hover:scale-110 group-hover:shadow-[0_0_25px_rgba(240,165,0,0.5)] transition-all duration-300">
        {Icon && <Icon size={20} />}
      </div>
      
      <h4 className="font-['Cinzel'] text-[#E2D9F3] text-sm mb-1.5 group-hover:text-[#F0A500] transition-colors">
        {title}
      </h4>
      <p className="font-['Inter'] text-[11px] text-[#9D93C0] leading-relaxed">
        {description}
      </p>
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
            className="z-50 bg-[#0C0A18] border border-[#7C3AED]/50 rounded-sm px-3 py-2 shadow-[0_0_15px_rgba(124,58,237,0.25)] relative data-[state=delayed-open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=delayed-open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=delayed-open]:zoom-in-95 duration-200"
          >
            {/* Rune corners for tooltip */}
            <div className="absolute top-0.5 left-0.5 w-1.5 h-1.5 border-t border-l border-[#A78BFA] opacity-50" />
            <div className="absolute top-0.5 right-0.5 w-1.5 h-1.5 border-t border-r border-[#A78BFA] opacity-50" />
            <div className="absolute bottom-0.5 left-0.5 w-1.5 h-1.5 border-b border-l border-[#A78BFA] opacity-50" />
            <div className="absolute bottom-0.5 right-0.5 w-1.5 h-1.5 border-b border-r border-[#A78BFA] opacity-50" />
            
            <span className="font-['Inter'] text-[12px] text-[#A78BFA]">{content}</span>
            <TooltipPrimitive.Arrow className="fill-[#0C0A18] [&>polygon]:stroke-[#7C3AED]/50 stroke-1" width={12} height={6} />
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
      <div className="flex-grow border-t border-[#7C3AED]/30" />
      {(label || Icon) && (
        <div className="mx-4 flex items-center justify-center gap-2">
          {Icon && <Icon size={16} className="text-[#A78BFA]" />}
          {label && (
            <span className="font-['Cinzel'] text-xs tracking-[0.2em] uppercase text-[#F0A500] px-2">
              {label}
            </span>
          )}
        </div>
      )}
      <div className="flex-grow border-t border-[#7C3AED]/30" />
    </div>
  );
}
