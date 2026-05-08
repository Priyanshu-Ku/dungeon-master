import { motion } from "motion/react";
import { Hexagon, Sword, Shield, Zap, Terminal } from "lucide-react";

interface HUDProps {
  isActive: boolean;
  onOpenInventory: () => void;
  onOpenCoding: () => void;
}

export function HUD({ isActive, onOpenInventory, onOpenCoding }: HUDProps) {
  return (
    <motion.div 
      className="absolute inset-0 pointer-events-none p-8 flex flex-col justify-between"
      animate={{ opacity: isActive ? 1 : 0.2 }}
      transition={{ duration: 0.5 }}
    >
      {/* TOP ROW */}
      <div className="flex justify-between items-start">
        {/* Top Left: Player Stats */}
        <div className="flex gap-4 items-center">
          {/* Level Badge */}
          <div className="w-14 h-14 bg-[#1E1A35]/80 border border-[#7A5A10] flex items-center justify-center transform rotate-45 shadow-[0_0_15px_rgba(240,165,0,0.15)]">
            <span className="transform -rotate-45 text-[#F0A500] font-bold text-xl" style={{ fontFamily: "'Cinzel', serif" }}>
              24
            </span>
          </div>
          
          <div className="flex flex-col gap-1.5">
            <h2 className="text-[#E2D9F3] text-2xl tracking-wide" style={{ fontFamily: "'Cinzel', serif" }}>
              Kaelen Voidwalker
            </h2>
            
            {/* Health Bar (Ember Red) */}
            <div className="w-64 h-2 bg-[#0C0A18] border border-[#2D2850] rounded-sm overflow-hidden flex shadow-[0_0_8px_rgba(239,68,68,0.2)]">
              <div className="w-3/4 h-full bg-gradient-to-r from-[#7f2424] to-[#EF4444]" />
            </div>
            
            {/* Mana Bar (Arcane Purple) */}
            <div className="w-48 h-1.5 bg-[#0C0A18] border border-[#2D2850] rounded-sm overflow-hidden flex shadow-[0_0_8px_rgba(124,58,237,0.2)] mt-0.5">
              <div className="w-1/2 h-full bg-gradient-to-r from-[#442182] to-[#7C3AED]" />
            </div>
          </div>
        </div>

        {/* Top Right: Objective */}
        <div className="text-right flex flex-col items-end">
          <div className="bg-[#0C0A18]/80 border border-[#2D2850] p-4 shadow-xl backdrop-blur-sm">
            <h3 className="text-[#F0A500] text-sm tracking-[0.2em] mb-2 uppercase" style={{ fontFamily: "'Cinzel', serif" }}>
              Current Objective
            </h3>
            <p className="text-[#E2D9F3] text-sm max-w-[200px]">
              Unlock the Obsidian Gate by passing the valid sequence algorithm.
            </p>
          </div>
        </div>
      </div>

      {/* BOTTOM ROW */}
      <div className="flex justify-between items-end">
        {/* Bottom Left: Event Log */}
        <div className="flex flex-col gap-2 max-w-sm text-sm">
          <p className="text-[#9D93C0]"><span className="text-[#4ADE80] font-medium">+15 XP</span> Defeated Void Lurker.</p>
          <p className="text-[#9D93C0]"><span className="text-[#22D3EE] font-medium">System:</span> Approaching encrypted terminal...</p>
          <p className="text-[#F0A500] font-medium">Found: Scroll of Quick Sort</p>
        </div>

        {/* Bottom Right: Quick Actions */}
        <div className="flex gap-4 pointer-events-auto">
          {/* Mock Action Slots */}
          <div className="flex gap-2 mr-8">
            <SkillSlot icon={<Sword size={20} />} active color="#E2D9F3" glow="#ffffff" />
            <SkillSlot icon={<Shield size={20} />} active={false} color="#9D93C0" />
            <SkillSlot icon={<Zap size={20} />} active color="#7C3AED" glow="#7C3AED" />
          </div>

          <button 
            onClick={onOpenCoding}
            className="flex items-center gap-2 px-6 py-3 bg-[#13102A]/90 border border-[#22D3EE]/50 hover:bg-[#1E1A35] transition-all text-[#22D3EE] shadow-[0_0_15px_rgba(34,211,238,0.2)] hover:shadow-[0_0_25px_rgba(34,211,238,0.4)]"
            style={{ fontFamily: "'Cinzel', serif" }}
          >
            <Terminal size={18} />
            <span className="tracking-widest text-sm font-bold">TERMINAL [T]</span>
          </button>
          
          <button 
            onClick={onOpenInventory}
            className="flex items-center gap-2 px-6 py-3 bg-[#0C0A18]/90 border border-[#7A5A10] hover:bg-[#13102A] transition-all text-[#F0A500] shadow-[0_0_15px_rgba(240,165,0,0.1)] hover:shadow-[0_0_25px_rgba(240,165,0,0.3)]"
            style={{ fontFamily: "'Cinzel', serif" }}
          >
            <Hexagon size={18} />
            <span className="tracking-widest text-sm font-bold">GEAR [I]</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
}

function SkillSlot({ icon, active, color, glow }: { icon: React.ReactNode, active: boolean, color: string, glow?: string }) {
  return (
    <div 
      className={`w-12 h-12 flex items-center justify-center bg-[#0C0A18]/80 border ${active ? 'border-[#E2D9F3]' : 'border-[#2D2850]'} backdrop-blur-sm relative`}
      style={{ 
        color: color,
        boxShadow: active && glow ? `0 0 12px ${glow}40` : 'none'
      }}
    >
      {icon}
      {/* Keybind badge */}
      <div className="absolute -bottom-2 -right-2 bg-[#1E1A35] border border-[#2D2850] text-[10px] w-5 h-5 flex items-center justify-center text-[#9D93C0]">
        1
      </div>
    </div>
  )
}
