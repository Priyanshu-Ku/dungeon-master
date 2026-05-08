import { motion } from "motion/react";
import { ArrowLeft, BookOpen, Crown, Flame, Ghost, Sparkles, Sword, Shield } from "lucide-react";
import { 
  Panel, 
  Button, 
  StatBar, 
  Input, 
  Badge, 
  ItemCard, 
  Tooltip, 
  Divider 
} from "./SystemUI";

interface DesignSystemViewerProps {
  onBack: () => void;
}

export function DesignSystemViewer({ onBack }: DesignSystemViewerProps) {
  return (
    <motion.div 
      className="absolute inset-0 bg-[#07060F] z-50 overflow-y-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Background Decor */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_top,rgba(124,58,237,0.05),transparent_60%)]" />
      <div className="absolute inset-0 pointer-events-none" style={{ background: "linear-gradient(rgba(7,6,15,0) 0%, #07060F 100%)" }} />

      <div className="relative z-10 max-w-7xl mx-auto p-12">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-12 border-b border-[#2D2850] pb-6">
          <div>
            <h1 className="text-[#F0A500] text-3xl tracking-[0.15em] mb-2" style={{ fontFamily: "'Cinzel Decorative', serif" }}>
              GRIMOIRE OF DESIGN
            </h1>
            <p className="text-[#9D93C0] font-['Lato']">Standardized UI Components for Capsule.</p>
          </div>
          <Button variant="ghost" onClick={onBack}>
            <ArrowLeft size={16} /> RETURN
          </Button>
        </div>

        {/* Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-12">
          
          {/* Column 1: Panels & Typography */}
          <div className="space-y-8">
            <section>
              <h2 className="text-[#E2D9F3] text-xl mb-4 font-['Cinzel'] tracking-wider">Panels</h2>
              <div className="space-y-4">
                <Panel>
                  <h3 className="text-[#E2D9F3] text-sm font-bold mb-2 font-['Inter']">Standard Panel</h3>
                  <p className="text-[#9D93C0] text-sm">A carved stone base for general UI.</p>
                </Panel>
                
                <Panel variant="rune">
                  <h3 className="text-[#A78BFA] text-sm font-bold mb-2 font-['Inter']">Rune Panel</h3>
                  <p className="text-[#9D93C0] text-sm">Used for important lore or magic items.</p>
                </Panel>
                
                <Panel topBorder="gold">
                  <h3 className="text-[#F0A500] text-sm font-bold mb-2 font-['Inter']">Gold Border Panel</h3>
                  <p className="text-[#9D93C0] text-sm">Elevated panel for primary menus.</p>
                </Panel>
              </div>
            </section>

            <section>
              <h2 className="text-[#E2D9F3] text-xl mb-4 font-['Cinzel'] tracking-wider">Typography</h2>
              <Panel padding="compact">
                <div className="space-y-4">
                  <div>
                    <span className="text-[#7A5A10] text-[10px] uppercase font-['Cinzel'] tracking-widest block mb-1">Display Title</span>
                    <h1 className="text-[#F0A500] text-4xl" style={{ fontFamily: "'Cinzel Decorative', serif" }}>BOSS NAME</h1>
                  </div>
                  <div>
                    <span className="text-[#7A5A10] text-[10px] uppercase font-['Cinzel'] tracking-widest block mb-1">Heading 1</span>
                    <h2 className="text-[#E2D9F3] text-2xl" style={{ fontFamily: "'Cinzel', serif" }}>Section Header</h2>
                  </div>
                  <div>
                    <span className="text-[#7A5A10] text-[10px] uppercase font-['Cinzel'] tracking-widest block mb-1">Body Text</span>
                    <p className="text-[#9D93C0] text-sm font-['Lato']">The ancient texts speak of recursive loops that can tear the very fabric of reality.</p>
                  </div>
                  <div>
                    <span className="text-[#7A5A10] text-[10px] uppercase font-['Cinzel'] tracking-widest block mb-1">Code Text (Terminal Only)</span>
                    <p className="text-[#C9D1D9] bg-[#0D1117] p-2 text-sm font-['Fira_Code'] border border-[#2D2850]">return true;</p>
                  </div>
                </div>
              </Panel>
            </section>
          </div>

          {/* Column 2: Interactive Elements */}
          <div className="space-y-8">
            <section>
              <h2 className="text-[#E2D9F3] text-xl mb-4 font-['Cinzel'] tracking-wider">Interactive</h2>
              <Panel className="space-y-6">
                <div>
                  <h3 className="text-[#9D93C0] text-xs font-['Cinzel'] tracking-widest uppercase mb-3">Buttons</h3>
                  <div className="flex flex-col gap-3">
                    <Button variant="primary"><Sword size={16} /> Primary Action</Button>
                    <Button variant="ghost"><Ghost size={16} /> Ghost Action</Button>
                    <Button variant="danger"><Flame size={16} /> Danger Action</Button>
                  </div>
                </div>

                <Divider />

                <div>
                  <h3 className="text-[#9D93C0] text-xs font-['Cinzel'] tracking-widest uppercase mb-3">Inputs</h3>
                  <div className="space-y-4">
                    <Input label="Character Name" placeholder="Enter your name..." />
                    <Input label="Secret Passphrase" type="password" placeholder="••••••••" />
                  </div>
                </div>
              </Panel>
            </section>

            <section>
              <h2 className="text-[#E2D9F3] text-xl mb-4 font-['Cinzel'] tracking-wider">Dividers & Tooltips</h2>
              <Panel padding="compact" className="space-y-6 flex flex-col items-center">
                <Divider />
                <Divider icon={BookOpen} />
                <Divider label="Chapter I" />
                
                <div className="py-4">
                  <Tooltip content="Grants +15 to your Arcane power when standing in shadow.">
                    <button className="text-[#A78BFA] border-b border-dashed border-[#A78BFA] font-['Lato'] text-sm pb-0.5">
                      Hover to read Lore
                    </button>
                  </Tooltip>
                </div>
              </Panel>
            </section>
          </div>

          {/* Column 3: Stats, Badges, & Cards */}
          <div className="space-y-8">
            <section>
              <h2 className="text-[#E2D9F3] text-xl mb-4 font-['Cinzel'] tracking-wider">Data & Status</h2>
              <Panel className="space-y-6">
                <div>
                  <h3 className="text-[#9D93C0] text-xs font-['Cinzel'] tracking-widest uppercase mb-3">Stat Bars</h3>
                  <div className="space-y-4">
                    <StatBar type="hp" label="Vitality" value={850} max={1000} />
                    <StatBar type="mp" label="Arcane" value={320} max={500} />
                    <StatBar type="xp" label="Experience" value={14500} max={20000} />
                  </div>
                </div>

                <Divider />

                <div>
                  <h3 className="text-[#9D93C0] text-xs font-['Cinzel'] tracking-widest uppercase mb-3">Badges & Pills</h3>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="apprentice">Apprentice</Badge>
                    <Badge variant="knight">Void Knight</Badge>
                    <Badge variant="boss">Arch-Demon</Badge>
                    <Badge variant="category">Weapon</Badge>
                    <Badge variant="category">Consumable</Badge>
                  </div>
                </div>
              </Panel>
            </section>

            <section>
              <h2 className="text-[#E2D9F3] text-xl mb-4 font-['Cinzel'] tracking-wider">Item Cards</h2>
              <div className="flex flex-wrap gap-4 justify-center">
                <ItemCard 
                  title="Blade of Sorting" 
                  description="Deals O(n log n) physical damage per swing." 
                  icon={Sword} 
                />
                <ItemCard 
                  title="Crown of the Void" 
                  description="Requires level 40. Protects against stack overflows." 
                  icon={Crown} 
                  locked
                />
                <ItemCard 
                  title="Arcane Core" 
                  description="Restores 50 MP instantly." 
                  icon={Sparkles} 
                />
                <ItemCard 
                  title="Shield of Recursion" 
                  description="Reflects damage back to the sender." 
                  icon={Shield} 
                  locked
                />
              </div>
            </section>
          </div>

        </div>
      </div>
    </motion.div>
  );
}
