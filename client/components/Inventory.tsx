import { motion } from "motion/react";
import { X, User, Sword, Shield, Zap, Gem, Scroll } from "lucide-react";
import { Panel } from "./SystemUI";

interface InventoryProps {
  onClose: () => void;
}

export function Inventory({ onClose }: InventoryProps) {
  return (
    <motion.div 
      className="absolute inset-0 bg-[#07060F]/90 backdrop-blur-xl flex items-center justify-center p-12 z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Background Atmosphere */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,#2D1B69_0%,#07060F_70%)] opacity-20" />
      
      <div className="w-full max-w-7xl h-full max-h-[850px] relative">
        <Panel variant="stone" padding="none" topBorder="gold">
          
          {/* Header */}
          <div className="flex justify-between items-center p-8 border-b border-[#2D2850]/50 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-[#F0A500]/5 to-transparent pointer-events-none" />
            
            <div className="flex items-center gap-10 relative z-10">
              <h1 className="text-[#F0A500] text-4xl tracking-[0.2em] font-black drop-shadow-[0_0_15px_rgba(240,165,0,0.3)]" style={{ fontFamily: "'Cinzel Decorative', serif" }}>
                Vault of Souls
              </h1>
              <div className="flex gap-6">
                <Tab active>Equipment</Tab>
                <Tab>Relics</Tab>
                <Tab>Grimoire</Tab>
              </div>
            </div>
            
            <button 
              onClick={onClose} 
              className="text-[#9D93C0] hover:text-[#F0A500] transition-all hover:rotate-90 pointer-events-auto"
            >
              <X size={32} strokeWidth={1.5} />
            </button>
          </div>

          {/* Content Body */}
          <div className="flex h-[calc(100%-100px)] overflow-hidden">
            
            {/* Left: Attributes & Mastery */}
            <div className="w-[30%] border-r border-[#2D2850]/30 p-10 flex flex-col bg-[#07060F]/30 overflow-y-auto">
              <SectionHeader title="Hero Attributes" />
              
              <div className="space-y-6 mt-6">
                <StatRow icon={<Sword size={16} />} label="Vanquish" value="1,245" color="#E2D9F3" />
                <StatRow icon={<Shield size={16} />} label="Fortitude" value="450" color="#EF4444" />
                <StatRow icon={<Zap size={16} />} label="Arcanum" value="890" color="#7C3AED" />
                <StatRow icon={<User size={16} />} label="Presence" value="210" color="#4ADE80" />
              </div>

              <div className="mt-12">
                <SectionHeader title="Active Blessing" />
                <div className="mt-6 p-6 bg-[#13111C] border border-[#F0A500]/10 rounded-[2px] relative overflow-hidden group">
                  <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-5" />
                  <p className="text-[#F0A500] text-sm font-bold tracking-widest mb-2 font-['Cinzel']">Void Resilience</p>
                  <p className="text-[#9D93C0] text-[13px] leading-relaxed italic font-['Lato']">
                    "The shadows embrace you. Reduces incoming dark damage by 15% and whispers secrets of the recursive void."
                  </p>
                </div>
              </div>

              <div className="mt-auto pt-10">
                <div className="flex items-center justify-between p-4 bg-[#0C0A18] border border-[#2D2850]/50">
                   <div className="flex items-center gap-3">
                     <Gem size={18} className="text-[#F0A500]" />
                     <span className="text-[#9D93C0] text-xs tracking-widest uppercase font-['Cinzel']">Soul Fragments</span>
                   </div>
                   <span className="text-[#F0A500] font-black text-xl tabular-nums">14,205</span>
                </div>
              </div>
            </div>

            {/* Center: Character Portrait */}
            <div className="flex-1 flex flex-col items-center justify-center relative bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] bg-fixed">
              {/* Magical Backglow */}
              <div className="absolute w-[500px] h-[500px] bg-[#7C3AED]/5 rounded-full blur-[120px]" />
              
              {/* The "Mirror" Frame */}
              <div className="relative z-10 w-96 h-[500px] border-x border-[#322D46] flex flex-col items-center justify-center group">
                 <div className="absolute top-0 w-full h-24 bg-gradient-to-b from-[#F0A500]/5 to-transparent" />
                 <div className="absolute bottom-0 w-full h-24 bg-gradient-to-t from-[#F0A500]/5 to-transparent" />
                 
                 {/* Placeholder for Character - Stylized Icon */}
                 <div className="relative">
                    <User size={200} className="text-[#E2D9F3]/10 drop-shadow-[0_0_30px_rgba(124,58,237,0.2)]" strokeWidth={0.5} />
                    <motion.div 
                      className="absolute inset-0 flex items-center justify-center"
                      animate={{ opacity: [0.1, 0.3, 0.1] }}
                      transition={{ repeat: Infinity, duration: 4 }}
                    >
                      <div className="text-8xl text-[#7C3AED]/20 font-serif">ᛉ</div>
                    </motion.div>
                 </div>
                 
                 <h2 className="mt-8 text-[#E2D9F3] text-2xl tracking-[0.4em] font-black uppercase" style={{ fontFamily: "'Cinzel', serif" }}>
                   Voidwalker
                 </h2>
              </div>

              {/* Equipment Orbits */}
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-[15%] left-[20%] pointer-events-auto"><EquipSlot label="Visage" rarity="epic" /></div>
                <div className="absolute top-[40%] left-[15%] pointer-events-auto"><EquipSlot label="Raiment" /></div>
                <div className="absolute top-[65%] left-[20%] pointer-events-auto"><EquipSlot label="Greaves" /></div>

                <div className="absolute top-[15%] right-[20%] pointer-events-auto"><EquipSlot label="Harbinger" rarity="legendary" /></div>
                <div className="absolute top-[40%] right-[15%] pointer-events-auto"><EquipSlot label="Amulet" /></div>
                <div className="absolute top-[65%] right-[20%] pointer-events-auto"><EquipSlot label="Grimoire" rarity="legendary" /></div>
              </div>
            </div>

            {/* Right: Backpack Grid */}
            <div className="w-[30%] border-l border-[#2D2850]/30 p-10 flex flex-col bg-[#07060F]/30 overflow-y-auto">
              <SectionHeader title="Ancient Satchel" />
              
              <div className="grid grid-cols-4 gap-3 mt-8">
                {[...Array(28)].map((_, i) => (
                  <InventoryItem key={i} index={i} />
                ))}
              </div>
              
              <div className="mt-10 p-6 border border-[#2D2850]/30 bg-[#0C0A18]/50">
                 <div className="flex gap-4 items-start">
                    <Scroll size={20} className="text-[#9D93C0] mt-1" />
                    <div>
                      <h4 className="text-[#E2D9F3] text-sm font-bold tracking-widest font-['Cinzel']">Scribe's Note</h4>
                      <p className="text-[#9D93C0] text-xs leading-relaxed italic mt-2">
                        "Each item carries the weight of those who failed the trials. Carry them with purpose."
                      </p>
                    </div>
                 </div>
              </div>
            </div>

          </div>
        </Panel>
      </div>
    </motion.div>
  );
}

function Tab({ children, active }: { children: React.ReactNode, active?: boolean }) {
  return (
    <button 
      className={`px-6 py-3 text-xs tracking-[0.3em] uppercase font-black transition-all relative group pointer-events-auto
        ${active ? 'text-[#F0A500]' : 'text-[#9D93C0] hover:text-[#E2D9F3]'}`}
      style={{ fontFamily: "'Cinzel', serif" }}
    >
      {children}
      {active && (
        <motion.div 
          layoutId="activeTab"
          className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#F0A500] shadow-[0_0_10px_#F0A500]"
        />
      )}
    </button>
  );
}

function SectionHeader({ title }: { title: string }) {
  return (
    <div className="flex items-center gap-4">
      <div className="h-px flex-1 bg-gradient-to-r from-transparent to-[#2D2850]" />
      <h3 className="text-[#9D93C0] text-[10px] tracking-[0.5em] uppercase font-black font-['Cinzel']">
        {title}
      </h3>
      <div className="h-px flex-1 bg-gradient-to-l from-transparent to-[#2D2850]" />
    </div>
  );
}

function StatRow({ icon, label, value, color }: { icon: React.ReactNode, label: string, value: string, color: string }) {
  return (
    <div className="flex justify-between items-center group cursor-default">
      <div className="flex items-center gap-4 text-[#9D93C0] group-hover:text-[#E2D9F3] transition-colors">
        <div className="opacity-40 group-hover:opacity-100 transition-opacity" style={{ color }}>{icon}</div>
        <span className="text-xs tracking-widest uppercase font-['Cinzel']">{label}</span>
      </div>
      <span className="text-lg font-black tracking-tighter tabular-nums" style={{ color }}>{value}</span>
    </div>
  );
}

function EquipSlot({ label, rarity }: { label: string, rarity?: 'epic' | 'legendary' }) {
  const isEpic = rarity === 'epic';
  const isLegendary = rarity === 'legendary';
  
  return (
    <div className="flex flex-col items-center gap-3">
      <div className={`w-20 h-20 bg-[#0C0A18] border transition-all duration-500 rounded-[2px] flex items-center justify-center relative overflow-hidden group hover:scale-110
        ${isLegendary ? 'border-[#F0A500] shadow-[0_0_20px_rgba(240,165,0,0.2)]' : 
          isEpic ? 'border-[#7C3AED] shadow-[0_0_20px_rgba(124,58,237,0.2)]' : 'border-[#2D2850]'}`}
      >
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/granite.png')] opacity-10" />
        <div className="w-12 h-12 border border-white/5 opacity-20" />
        
        {isLegendary && <div className="absolute inset-0 bg-gradient-to-tr from-[#F0A500]/10 via-transparent to-transparent" />}
        {isEpic && <div className="absolute inset-0 bg-gradient-to-tr from-[#7C3AED]/10 via-transparent to-transparent" />}
      </div>
      <span className={`text-[9px] tracking-[0.3em] uppercase font-bold font-['Cinzel'] 
        ${isLegendary ? 'text-[#F0A500]' : isEpic ? 'text-[#7C3AED]' : 'text-[#9D93C0]'}`}>
        {label}
      </span>
    </div>
  );
}

function InventoryItem({ index }: { index: number }) {
  const isSpecial = index === 2 || index === 7;
  const isMythic = index === 11;
  
  return (
    <div className={`aspect-square bg-[#0C0A18] border transition-all hover:bg-[#13111C] cursor-pointer group relative rounded-[1px]
      ${isMythic ? 'border-[#F0A500]/50' : isSpecial ? 'border-[#7C3AED]/50' : 'border-[#2D2850]/50 hover:border-[#E2D9F3]/30'}`}
    >
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/granite.png')] opacity-5" />
      {isMythic && <div className="absolute bottom-1 right-1 w-1.5 h-1.5 bg-[#F0A500] rounded-full blur-[2px]" />}
      {isSpecial && <div className="absolute bottom-1 right-1 w-1.5 h-1.5 bg-[#7C3AED] rounded-full blur-[2px]" />}
      
      {/* Hover Info Tip Placeholder */}
      <div className="absolute inset-0 bg-white/0 group-hover:bg-white/5 transition-colors" />
    </div>
  );
}
