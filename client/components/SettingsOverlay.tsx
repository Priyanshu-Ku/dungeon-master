import { motion } from "motion/react";
import { X, Volume2, Monitor, Keyboard, Gamepad2, ArrowLeft } from "lucide-react";
import { Panel, Button, Divider, Badge } from "./SystemUI";

interface SettingsOverlayProps {
  onBack: () => void;
}

export function SettingsOverlay({ onBack }: SettingsOverlayProps) {
  return (
    <motion.div 
      className="absolute inset-0 bg-[#07060F] z-[300] overflow-y-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Background Decor */}
      <div className="absolute inset-0 pointer-events-none opacity-20 bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')]" />
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,rgba(240,165,0,0.05),transparent_70%)]" />

      <div className="relative z-10 max-w-4xl mx-auto p-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 bg-[#13102A] border border-[#F0A500]/30 rotate-45 flex items-center justify-center">
              <div className="-rotate-45 text-[#F0A500]">
                <Gamepad2 size={32} />
              </div>
            </div>
            <div>
              <h1 className="text-[#F0A500] text-4xl tracking-[0.2em] font-['Cinzel Decorative']">SYSTEM SETTINGS</h1>
              <p className="text-[#9D93C0] text-sm tracking-widest font-['Cinzel'] mt-1">Calibrate your interface parameters.</p>
            </div>
          </div>
          <Button variant="ghost" onClick={onBack}>
            <ArrowLeft size={16} className="mr-2" /> RETURN TO SANCTUM
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Audio Settings */}
          <Panel topBorder="gold">
            <div className="flex items-center gap-3 mb-6">
              <Volume2 className="text-[#F0A500]" size={20} />
              <h2 className="text-[#E2D9F3] text-lg font-['Cinzel'] tracking-wider">Audio Frequency</h2>
            </div>
            <div className="space-y-6">
              <SettingSlider label="Master Volume" value={85} />
              <SettingSlider label="Atmosphere (Music)" value={70} />
              <SettingSlider label="Incantations (Voice)" value={90} />
              <SettingSlider label="Impacts (SFX)" value={80} />
            </div>
          </Panel>

          {/* Visual Settings */}
          <Panel>
            <div className="flex items-center gap-3 mb-6">
              <Monitor className="text-[#A78BFA]" size={20} />
              <h2 className="text-[#E2D9F3] text-lg font-['Cinzel'] tracking-wider">Visual Fidelity</h2>
            </div>
            <div className="space-y-4">
              <SettingToggle label="Rune Glow Effects" active />
              <SettingToggle label="Volumetric Fog" active />
              <SettingToggle label="Dynamic Shadows" />
              <SettingToggle label="Screen Shake" active />
              <SettingToggle label="Chromatic Aberration" />
            </div>
          </Panel>

          {/* Controls Settings */}
          <Panel className="md:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <Keyboard className="text-[#F0A500]" size={20} />
              <h2 className="text-[#E2D9F3] text-lg font-['Cinzel'] tracking-wider">Interface Bindings</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <KeyBind label="Character" keycap="C" />
              <KeyBind label="Inventory" keycap="I" />
              <KeyBind label="World Map" keycap="M" />
              <KeyBind label="Terminal" keycap="T" />
            </div>
          </Panel>
        </div>

        <div className="mt-12 flex justify-center gap-6">
          <Button variant="ghost" onClick={onBack}>DISCARD CHANGES</Button>
          <Button variant="primary" onClick={onBack}>SAVE PARAMETERS</Button>
        </div>
      </div>
    </motion.div>
  );
}

function SettingSlider({ label, value }: { label: string, value: number }) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-[10px] font-['Cinzel'] tracking-widest text-[#9D93C0] uppercase">
        <span>{label}</span>
        <span>{value}%</span>
      </div>
      <div className="h-1 bg-[#13102A] border border-[#2D2850] relative overflow-hidden">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          className="absolute inset-y-0 left-0 bg-gradient-to-r from-[#7A5A10] to-[#F0A500]"
        />
      </div>
    </div>
  );
}

function SettingToggle({ label, active }: { label: string, active?: boolean }) {
  return (
    <div className="flex items-center justify-between group cursor-pointer py-1">
      <span className="text-sm font-['Lato'] text-[#9D93C0] group-hover:text-white transition-colors">{label}</span>
      <div className={`w-10 h-5 border transition-colors flex items-center px-1 ${active ? 'bg-[#F0A500]/20 border-[#F0A500]' : 'bg-[#0C0A18] border-[#2D2850]'}`}>
        <motion.div 
          animate={{ x: active ? 20 : 0 }}
          className={`w-3 h-3 ${active ? 'bg-[#F0A500]' : 'bg-[#2D2850]'}`}
        />
      </div>
    </div>
  );
}

function KeyBind({ label, keycap }: { label: string, keycap: string }) {
  return (
    <div className="bg-[#13102A]/50 border border-[#2D2850] p-4 flex flex-col items-center gap-2">
      <span className="text-[10px] font-['Cinzel'] tracking-widest text-[#9D93C0] uppercase">{label}</span>
      <div className="w-10 h-10 border border-[#F0A500]/40 flex items-center justify-center text-[#F0A500] font-bold">
        {keycap}
      </div>
    </div>
  );
}
