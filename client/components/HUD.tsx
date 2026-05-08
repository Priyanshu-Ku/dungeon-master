import { motion } from "motion/react";
import { Hexagon, Sword, Shield, Zap, Terminal, Compass } from "lucide-react";
import { BossBar, StatBar, Panel, EnergyRing } from "./SystemUI";

interface HUDProps {
  isActive: boolean;
  onOpenInventory: () => void;
  onOpenCoding: () => void;
}

export function HUD({ isActive, onOpenInventory, onOpenCoding }: HUDProps) {
  return (
    <motion.div 
      className="absolute inset-0 pointer-events-none p-10 flex flex-col justify-between z-40"
      animate={{ opacity: isActive ? 1 : 0.2 }}
      transition={{ duration: 0.5 }}
    >
      {/* BOSS BAR (CENTER TOP) */}
      <motion.div 
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 1, ease: [0.16, 1, 0.3, 1] }}
        className="absolute top-12 left-1/2 -translate-x-1/2 w-full flex justify-center"
      >
        <BossBar 
          name="THE STACK OVERSEER" 
          title="Guardian of the Recursive Void"
          health={640}
          maxHealth={1000}
        />
      </motion.div>

      {/* TOP ROW: Character info & Mini-map */}
      <div className="flex justify-between items-start">
        {/* Top Left: Character Plaque */}
        <motion.div 
          initial={{ x: -60, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="flex gap-8 items-center"
        >
          {/* Soul Level Badge */}
          <div className="relative group">
            <div className="absolute inset-0 bg-[#F0A500] blur-2xl opacity-10" />
            <div className="w-20 h-20 bg-[#13111C] border border-[#F0A500]/40 flex items-center justify-center transform rotate-45 shadow-[0_0_20px_rgba(0,0,0,0.5)] overflow-hidden relative">
               <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/granite.png')] opacity-20 pointer-events-none" />
               <span className="transform -rotate-45 text-[#F0A500] font-black text-3xl tracking-tighter drop-shadow-[0_2px_4px_rgba(0,0,0,1)]" style={{ fontFamily: "'Cinzel Decorative', serif" }}>
                24
              </span>
            </div>
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-[#0C0A18] border border-[#F0A500]/60 text-[#F0A500] text-[10px] font-bold px-2 py-0.5 rounded-[1px] font-['Cinzel'] tracking-widest shadow-xl">
              SOUL
            </div>
          </div>
          
          <div className="flex flex-col gap-2">
            <h2 className="text-[#E2D9F3] text-3xl tracking-[0.15em] font-black drop-shadow-lg" style={{ fontFamily: "'Cinzel', serif" }}>
              Kaelen Voidwalker
            </h2>
            
            <div className="w-96 space-y-4">
              <StatBar type="hp" label="Vitality" value={750} max={1000} />
              <div className="w-72">
                <StatBar type="mp" label="Arcanum" value={180} max={300} />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Top Right: Ancient Compass / Mini-map */}
        <motion.div 
          initial={{ x: 60, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="flex flex-col items-end gap-10"
        >
          {/* The Mirror Compass */}
          <div className="relative pointer-events-auto cursor-pointer group">
            <div className="absolute inset-0 bg-[#7C3AED]/10 blur-3xl rounded-full" />
            
            {/* Circular Frame */}
            <div className="w-52 h-52 rounded-full border-2 border-[#322D46] bg-[#0C0A18] relative overflow-hidden shadow-[0_0_40px_rgba(0,0,0,0.8)] transition-all group-hover:border-[#F0A500]/40">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,#2D1B69_0%,#0C0A18_90%)] opacity-40" />
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10 mix-blend-screen" />
              
              {/* Carved Grid */}
              <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "radial-gradient(#F0A500 1px, transparent 1px)", backgroundSize: "30px 30px" }} />
              
              {/* Player Icon (Glowing Rune) */}
              <motion.div 
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 text-[#F0A500]"
                animate={{ scale: [1, 1.3, 1], opacity: [0.6, 1, 0.6] }}
                transition={{ repeat: Infinity, duration: 3 }}
              >
                <div className="text-xl font-serif">ᛉ</div>
                <div className="absolute inset-0 blur-md bg-[#F0A500]/40 scale-150" />
              </motion.div>
              
              {/* Compass Marks */}
              <div className="absolute inset-4 rounded-full border border-white/5 pointer-events-none" />
              <div className="absolute top-2 left-1/2 -translate-x-1/2 text-[10px] text-[#F0A500]/40 font-serif">N</div>
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-[10px] text-[#F0A500]/40 font-serif">S</div>
              
              {/* Location Text */}
              <div className="absolute bottom-8 left-0 right-0 text-center">
                <span className="text-[10px] font-['Cinzel'] text-[#F0A500]/80 tracking-[0.4em] uppercase drop-shadow-md">
                  Obsidian Depths
                </span>
              </div>
            </div>
            
            {/* Room Identifier */}
            <div className="absolute -top-4 right-2 text-[10px] font-['Cinzel'] text-[#9D93C0]/40 tracking-widest">
              CHAMBER // 04-B
            </div>
          </div>

          {/* Objective Plaque */}
          <div className="w-72">
            <Panel variant="stone" padding="compact" topBorder="gold">
              <div className="flex items-center gap-3 mb-3">
                <Compass size={14} className="text-[#F0A500]" />
                <h3 className="text-[#F0A500] text-[10px] tracking-[0.4em] uppercase font-black" style={{ fontFamily: "'Cinzel', serif" }}>
                  Current Task
                </h3>
              </div>
              <p className="text-[#9D93C0] text-[13px] font-['Lato'] leading-relaxed italic opacity-80">
                "Solve the <span className="text-[#E2D9F3] not-italic font-bold">Riddle of Recursion</span> to breach the seal of the Stack Overseer."
              </p>
            </Panel>
          </div>
        </motion.div>
      </div>

      {/* BOTTOM ROW: Skills & Inventory */}
      <motion.div 
        initial={{ y: 60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.8, duration: 1 }}
        className="flex justify-between items-end"
      >
        {/* Event Scroll (Bottom Left) */}
        <div className="flex flex-col gap-3 max-w-sm text-sm p-6 bg-gradient-to-t from-[#07060F]/90 to-transparent border-l border-white/5">
          <p className="text-[#9D93C0] font-['Lato'] flex gap-3"><span className="text-[#4ADE80] font-bold tracking-widest">GAINED:</span> 15 fragments of the Void.</p>
          <p className="text-[#9D93C0] font-['Lato'] flex gap-3"><span className="text-[#22D3EE] font-bold tracking-widest">OMEN:</span> A terminal hums in the distance...</p>
          <div className="h-px w-full bg-gradient-to-r from-white/10 to-transparent" />
          <p className="text-[#F0A500] font-['Cinzel'] text-[11px] tracking-widest uppercase">Ancient Wisdom: Quick Sort Discovered</p>
        </div>

        {/* Action Belt (Bottom Right) */}
        <div className="flex gap-10 pointer-events-auto items-end">
          {/* Skill Slots */}
          <div className="flex gap-6 mr-12 mb-2">
            <SkillSlot icon={<Sword size={24} />} active color="#E2D9F3" keybind="Q" progress={100} />
            <SkillSlot icon={<Shield size={24} />} active={false} color="#9D93C0" keybind="W" progress={45} />
            <SkillSlot icon={<Zap size={24} />} active color="#7C3AED" glow="#7C3AED" keybind="E" progress={100} />
          </div>

          <div className="flex gap-6 pb-2">
            <HUDButton 
              icon={<Terminal size={20} />} 
              label="Terminal" 
              keybind="T" 
              color="#7C3AED" 
              onClick={onOpenCoding} 
            />
            <HUDButton 
              icon={<Hexagon size={20} />} 
              label="Inventory" 
              keybind="I" 
              color="#F0A500" 
              onClick={onOpenInventory} 
            />
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function HUDButton({ icon, label, keybind, color, onClick }: { icon: React.ReactNode, label: string, keybind: string, color: string, onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className="group relative flex flex-col items-center gap-2 active:scale-95 transition-all pointer-events-auto"
    >
      <div 
        className="px-8 py-4 bg-[#0C0A18] border transition-all duration-500 rounded-[2px] shadow-2xl relative overflow-hidden"
        style={{ borderColor: `${color}30` }}
      >
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/granite.png')] opacity-10 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/5 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity" />
        
        <div className="flex items-center gap-4 relative z-10">
          <div style={{ color }}>{icon}</div>
          <span className="text-[#E2D9F3] tracking-[0.3em] text-xs font-bold uppercase font-['Cinzel'] group-hover:text-white transition-colors">
            {label}
          </span>
        </div>
      </div>
      <span className="text-[9px] font-mono text-[#9D93C0]/40 tracking-widest uppercase">
        Key [{keybind}]
      </span>
    </button>
  );
}

interface SkillSlotProps {
  icon: React.ReactNode;
  active: boolean;
  color: string;
  glow?: string;
  keybind: string;
  progress: number;
}

function SkillSlot({ icon, active, color, glow, keybind, progress }: SkillSlotProps) {
  return (
    <div 
      className={`w-16 h-16 flex items-center justify-center bg-[#13111C] border transition-all duration-500 rounded-[2px] relative group cursor-pointer hover:-translate-y-1`}
      style={{ 
        borderColor: active ? `${color}60` : '#2D2850',
        boxShadow: active && glow ? `0 0 25px ${glow}20` : 'none'
      }}
    >
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-5 pointer-events-none" />
      <div className="absolute inset-[1px] border-[0.5px] border-white/5 pointer-events-none" />

      {/* Progress Fill */}
      <div 
        className="absolute bottom-0 left-0 w-full bg-white/5 transition-all duration-700"
        style={{ height: `${100 - progress}%` }}
      />

      {/* Status Ring */}
      <div className="absolute inset-0 p-1.5 opacity-40">
        <EnergyRing progress={progress} color={glow || color} />
      </div>

      <div className={`relative z-10 transition-all duration-500 ${!active ? 'grayscale opacity-30' : 'drop-shadow-[0_0_10px_currentColor]'}`}>
        {icon}
      </div>
      
      {/* Keybind */}
      <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-[#0C0A18] border border-[#F0A500]/30 text-[9px] px-2 h-[18px] flex items-center justify-center text-[#F0A500] font-bold rounded-sm shadow-xl font-['Cinzel'] z-20 group-hover:border-[#F0A500] transition-colors">
        {keybind}
      </div>
    </div>
  );
}
