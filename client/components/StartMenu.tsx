import { motion, AnimatePresence } from "motion/react";
import { useState, useEffect, useMemo } from "react";
import { Play, BarChart3, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";

interface StartMenuProps {
  onStart: (action: string) => void;
  onOpenAuth: () => void;
}

type MenuState = "splash" | "main";

export function StartMenu({ onStart, onOpenAuth }: StartMenuProps) {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <motion.div 
      className="absolute inset-0 flex flex-col items-center justify-center z-50 bg-[#05040A] overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ 
        opacity: 0,
        scale: 1.05,
        filter: "brightness(1.5) blur(10px)",
        transition: { duration: 1 }
      }}
    >
      {/* NOISE OVERLAY */}
      <div className="absolute inset-0 noise-overlay opacity-30 pointer-events-none z-[100]" />
      
      {/* BACKGROUND EFFECTS */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(124,58,237,0.03),transparent_70%)]" />
      <DustMotes isMounted={isMounted} />

      {/* MAIN MENU VIEW (image_1.png) */}
      <motion.div 
        key="main"
        initial={{ opacity: 0, scale: 1.1 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0 }}
        className="flex flex-col items-center justify-center gap-16 relative z-10"
      >
        <div className="text-center">
          <motion.span 
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            className="text-[#F0A500] text-xs tracking-[0.6em] uppercase mb-4 block"
            style={{ fontFamily: "var(--font-cinzel)" }}
          >
            A Tale of Algorithms
          </motion.span>
          <h1 className="text-7xl md:text-8xl text-white tracking-[0.3em] drop-shadow-[0_0_30px_rgba(255,255,255,0.1)]" style={{ fontFamily: "var(--font-cinzel-deco)" }}>
            CAPSULE
          </h1>
          <div className="h-px w-64 bg-gradient-to-r from-transparent via-white/20 to-transparent mx-auto mt-6" />
        </div>

        <div className="flex flex-col gap-6 items-center">
          <MenuItem label="Identify Scribe" onClick={onOpenAuth} />
          <MenuItem label="Continue Journey" onClick={() => router.push("/dungeon")} />
          <MenuItem label="New Expedition" onClick={() => router.push("/dungeon")} active />
          <MenuItem label="UI Compendium" onClick={() => onStart("design")} />
          <MenuItem label="System Settings" onClick={() => onStart("settings")} />
          <MenuItem label="Exit to Desktop" onClick={() => onStart("exit")} />
        </div>
      </motion.div>
    </motion.div>
  );
}

function MenuButton({ icon, label, primary, onClick }: { icon: React.ReactNode, label: string, primary?: boolean, onClick: () => void }) {
  return (
    <motion.button
      whileHover={{ scale: 1.05, y: -2 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`
        relative px-12 py-5 flex items-center justify-center gap-4 transition-all duration-300
        ${primary ? 'bg-[#F0A500] text-[#05040A]' : 'bg-transparent border border-[#F0A500]/30 text-[#F0A500] hover:border-[#F0A500]'}
        rounded-sm shadow-[0_20px_50px_rgba(0,0,0,0.5)] pointer-events-auto
      `}
    >
      <span className="relative z-10 flex items-center gap-3 font-sans font-black tracking-[0.2em] text-[11px] uppercase">
        {icon}
        {label}
      </span>
      {primary && (
        <motion.div 
          animate={{ opacity: [0, 0.1, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute inset-0 bg-white"
        />
      )}
    </motion.button>
  );
}

function MenuItem({ label, onClick, active }: { label: string, onClick: () => void, active?: boolean }) {
  return (
    <motion.button
      whileHover={{ scale: 1.1, x: 10 }}
      onClick={onClick}
      className={`text-lg md:text-xl tracking-[0.4em] uppercase transition-all flex items-center gap-4
        ${active ? 'text-[#F0A500]' : 'text-white/40 hover:text-white'}`}
      style={{ fontFamily: "var(--font-cinzel)" }}
    >
      {active && <ChevronRight size={16} className="text-[#F0A500]" />}
      {label}
    </motion.button>
  );
}

function DustMotes({ isMounted }: { isMounted: boolean }) {
  const motes = useMemo(() => {
    return [...Array(40)].map((_, i) => ({
      left: Math.random() * 100 + "%",
      top: Math.random() * 100 + "%",
      size: Math.random() * 2 + 1,
      duration: Math.random() * 20 + 20,
      delay: Math.random() * -20,
      opacity: Math.random() * 0.2 + 0.05
    }));
  }, []);

  if (!isMounted) return null;

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-30">
      {motes.map((m, i) => (
        <motion.div
          key={i}
          className="absolute bg-[#F0A500]/20 rounded-full blur-[1px]"
          style={{ 
            left: m.left, 
            top: m.top, 
            width: m.size, 
            height: m.size,
            opacity: m.opacity
          }}
          animate={{ 
            y: [0, -200, 0],
            x: [0, Math.random() * 60 - 30, 0]
          }}
          transition={{ 
            duration: m.duration, 
            repeat: Infinity, 
            delay: m.delay,
            ease: "linear" 
          }}
        />
      ))}
    </div>
  );
}
