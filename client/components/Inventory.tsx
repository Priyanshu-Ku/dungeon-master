import { motion } from "motion/react";
import { X, User } from "lucide-react";

interface InventoryProps {
  onClose: () => void;
}

export function Inventory({ onClose }: InventoryProps) {
  return (
    <motion.div 
      className="absolute inset-0 bg-[#07060F]/80 backdrop-blur-md flex items-center justify-center p-12 z-50"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      {/* Main Panel */}
      <div className="w-full max-w-6xl h-full max-h-[800px] bg-[#0C0A18] border border-[#2D2850] shadow-2xl flex flex-col relative">
        
        {/* Decorative Top Border (Gold Filigree implied) */}
        <div className="h-1 w-full bg-gradient-to-r from-transparent via-[#7A5A10] to-transparent" />
        
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-[#1E1A35]">
          <div className="flex items-center gap-6">
            <h1 className="text-[#F0A500] text-3xl tracking-[0.15em] shadow-[0_0_15px_rgba(240,165,0,0.2)]" style={{ fontFamily: "'Cinzel Decorative', serif" }}>
              EQUIPMENT
            </h1>
            <div className="flex gap-4">
              <Tab active>GEAR</Tab>
              <Tab>ABILITIES</Tab>
              <Tab>LORE</Tab>
            </div>
          </div>
          <button onClick={onClose} className="text-[#9D93C0] hover:text-[#E2D9F3] transition-colors">
            <X size={28} />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 flex overflow-hidden">
          
          {/* Left: Stats & Info (Destiny 2 layout) */}
          <div className="w-1/3 border-r border-[#1E1A35] p-8 flex flex-col">
            <h2 className="text-[#E2D9F3] text-xl mb-6 tracking-wide" style={{ fontFamily: "'Cinzel', serif" }}>
              Attributes
            </h2>
            
            <div className="space-y-4">
              <StatRow label="Power" value="1,245" color="#E2D9F3" />
              <StatRow label="Vitality" value="450" color="#EF4444" />
              <StatRow label="Arcane" value="890" color="#7C3AED" />
              <StatRow label="Agility" value="210" color="#4ADE80" />
            </div>

            <div className="mt-auto">
              <h3 className="text-[#7A5A10] text-sm uppercase tracking-widest mb-3" style={{ fontFamily: "'Cinzel', serif" }}>
                Active Passive
              </h3>
              <div className="bg-[#13102A] border border-[#2D2850] p-4">
                <p className="text-[#E2D9F3] font-medium mb-1">Void Resilience</p>
                <p className="text-[#9D93C0] text-sm leading-relaxed">
                  Reduces incoming damage from dark entities by 15%. Slowly regenerates mana while standing in shadow.
                </p>
              </div>
            </div>
          </div>

          {/* Center: Character Model Mock (Hades energy) */}
          <div className="flex-1 flex flex-col items-center justify-center relative border-r border-[#1E1A35] bg-[#07060F]">
            {/* Glowing background behind character */}
            <div className="absolute w-64 h-64 bg-[#7C3AED]/20 rounded-full blur-[100px]" />
            
            <div className="relative z-10 text-center">
              <User size={120} className="text-[#9D93C0]/50 mb-4 mx-auto" strokeWidth={1} />
              <p className="text-[#7A5A10] text-sm tracking-widest uppercase">Kaelen Voidwalker</p>
            </div>

            {/* Equipment Slots floating around */}
            <div className="absolute top-1/4 left-12"><EquipSlot type="Head" /></div>
            <div className="absolute top-2/4 left-8"><EquipSlot type="Chest" /></div>
            <div className="absolute top-3/4 left-12"><EquipSlot type="Legs" /></div>

            <div className="absolute top-1/4 right-12"><EquipSlot type="Weapon" isGold glow="#F0A500" /></div>
            <div className="absolute top-2/4 right-8"><EquipSlot type="Artifact" /></div>
            <div className="absolute top-3/4 right-12"><EquipSlot type="Relic" isArcane glow="#7C3AED" /></div>
          </div>

          {/* Right: Inventory Grid (Destiny 2 layout) */}
          <div className="w-1/3 p-8 flex flex-col">
            <h2 className="text-[#E2D9F3] text-xl mb-6 tracking-wide" style={{ fontFamily: "'Cinzel', serif" }}>
              Backpack
            </h2>
            
            <div className="grid grid-cols-4 gap-3">
              {[...Array(24)].map((_, i) => (
                <div 
                  key={i} 
                  className="aspect-square bg-[#13102A] border border-[#2D2850] hover:border-[#E2D9F3] transition-colors cursor-pointer relative group"
                >
                  {i === 2 && (
                     <div className="absolute inset-0 bg-[#0C0A18] border-2 border-[#7C3AED] shadow-[0_0_10px_rgba(124,58,237,0.3)] flex items-center justify-center">
                       <div className="w-3/4 h-3/4 bg-gradient-to-br from-[#7C3AED] to-transparent opacity-50" />
                     </div>
                  )}
                  {i === 5 && (
                     <div className="absolute inset-0 bg-[#0C0A18] border-2 border-[#F0A500] shadow-[0_0_10px_rgba(240,165,0,0.3)] flex items-center justify-center">
                       <div className="w-3/4 h-3/4 bg-gradient-to-br from-[#F0A500] to-transparent opacity-50" />
                     </div>
                  )}
                </div>
              ))}
            </div>
            
            <div className="mt-8 pt-6 border-t border-[#1E1A35]">
              <div className="flex justify-between items-center text-sm">
                <span className="text-[#9D93C0]">Currency</span>
                <span className="text-[#F0A500] font-bold">14,205 Runes</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </motion.div>
  );
}

function Tab({ children, active }: { children: React.ReactNode, active?: boolean }) {
  return (
    <button 
      className={`px-4 py-2 text-sm tracking-widest ${active ? 'text-[#E2D9F3] border-b-2 border-[#F0A500]' : 'text-[#9D93C0] hover:text-[#E2D9F3]'}`}
      style={{ fontFamily: "'Cinzel', serif" }}
    >
      {children}
    </button>
  );
}

function StatRow({ label, value, color }: { label: string, value: string, color: string }) {
  return (
    <div className="flex justify-between items-center py-2 border-b border-[#1E1A35]/50">
      <span className="text-[#9D93C0]">{label}</span>
      <span className="font-bold text-lg" style={{ color }}>{value}</span>
    </div>
  )
}

function EquipSlot({ type, isGold, isArcane, glow }: { type: string, isGold?: boolean, isArcane?: boolean, glow?: string }) {
  let borderClass = "border-[#2D2850]";
  let shadowStyle = {};
  
  if (isGold) {
    borderClass = "border-[#F0A500]";
    shadowStyle = { boxShadow: `0 0 15px ${glow}40` };
  } else if (isArcane) {
    borderClass = "border-[#7C3AED]";
    shadowStyle = { boxShadow: `0 0 15px ${glow}40` };
  }

  return (
    <div className="flex flex-col items-center gap-2">
      <div 
        className={`w-16 h-16 bg-[#13102A] border ${borderClass} flex items-center justify-center cursor-pointer hover:bg-[#1E1A35] transition-colors`}
        style={shadowStyle}
      />
      <span className="text-[10px] text-[#9D93C0] uppercase tracking-widest">{type}</span>
    </div>
  )
}
