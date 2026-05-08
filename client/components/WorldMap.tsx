import { motion, AnimatePresence } from "motion/react";
import { X, MapPin, Lock } from "lucide-react";

interface MapNode {
  id: string;
  name: string;
  type: "boss" | "challenge" | "loot" | "start" | "locked";
  x: number;
  y: number;
  cleared?: boolean;
  tooltipText?: string;
}

interface WorldMapProps {
  isOpen: boolean;
  onClose: () => void;
}

export function WorldMap({ isOpen, onClose }: WorldMapProps) {
  const nodes: MapNode[] = [
    { id: "1", name: "ENTRANCE", type: "start", x: 50, y: 80, cleared: true },
    { id: "2", name: "ALGORITHM HALL", type: "challenge", x: 40, y: 60, cleared: true },
    { id: "3", name: "LOOT CACHE", type: "loot", x: 60, y: 55, cleared: false },
    { id: "4", name: "RECURSIVE VOID", type: "challenge", x: 45, y: 40, cleared: false },
    { id: "5", name: "THE OBSIDIAN GATE", type: "boss", x: 50, y: 20, cleared: false },
    { id: "6", name: "FORBIDDEN ARCHIVE", type: "locked", x: 30, y: 30, cleared: false, tooltipText: "Defeat Sentinel Hall guardian to unlock this passage." },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          className="absolute inset-0 z-[200] flex items-center justify-center p-12 bg-[#07060F]/90 backdrop-blur-xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div 
            className="relative w-full max-w-4xl h-[600px] bg-[#1E1A35] border-8 border-[#7A5A10] shadow-[0_0_50px_rgba(0,0,0,0.8),inset_0_0_100px_rgba(0,0,0,0.5)] overflow-hidden"
            initial={{ scale: 0.9, rotate: -2 }}
            animate={{ scale: 1, rotate: 0 }}
          >
            {/* Parchment Texture */}
            <div className="absolute inset-0 opacity-40 mix-blend-multiply" style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/paper-fibers.png')" }} />
            <div className="absolute inset-0 bg-[#F0A500]/5" />
            
            {/* Map Header */}
            <div className="absolute top-8 left-0 right-0 flex flex-col items-center">
              <h2 className="text-[#F0A500] text-3xl tracking-[0.3em] font-['Cinzel'] uppercase">
                OBSIDIAN DEPTHS
              </h2>
              <div className="w-32 h-px bg-gradient-to-r from-transparent via-[#F0A500] to-transparent mt-2" />
            </div>

            {/* Close Button */}
            <button 
              onClick={onClose}
              className="absolute top-6 right-6 text-[#7A5A10] hover:text-[#F0A500] transition-colors z-50 p-2"
            >
              <X size={28} />
            </button>

            {/* Map Content */}
            <div className="relative w-full h-full p-20">
              {/* Connection Lines - Magical Paths */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
                {/* Glow layer */}
                <path d="M 400 480 L 320 360 L 480 330 L 360 240 L 400 120" fill="none" stroke="#F0A500" strokeWidth="6" opacity="0.1" filter="blur(4px)" />
                {/* Core path */}
                <path d="M 400 480 L 320 360 L 480 330 L 360 240 L 400 120" fill="none" stroke="#F0A500" strokeWidth="2" strokeDasharray="8 4" opacity="0.4" />
                
                {/* Locked path */}
                <path d="M 360 240 L 240 180" fill="none" stroke="#4B456A" strokeWidth="6" opacity="0.1" filter="blur(4px)" />
                <path d="M 360 240 L 240 180" fill="none" stroke="#4B456A" strokeWidth="2" strokeDasharray="4 6" opacity="0.5" />
              </svg>

              {nodes.map((node) => (
                <motion.div
                  key={node.id}
                  className="absolute cursor-pointer group"
                  style={{ left: `${node.x}%`, top: `${node.y}%` }}
                  whileHover={{ scale: 1.2 }}
                >
                  <div className={`relative flex items-center justify-center w-10 h-10 border-2 ${
                    node.type === 'locked' ? 'bg-[#0A0812]/80 border-[#2D2850] opacity-80 grayscale' :
                    node.cleared ? 'bg-[#F0A500] border-[#F0A500]' : 'bg-[#0C0A18] border-[#7A5A10]'
                  } rotate-45 transition-colors shadow-lg`}>
                    <div className="transform -rotate-45">
                      {node.type === 'boss' ? (
                        <div className="w-4 h-4 bg-red-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(239,68,68,1)]" />
                      ) : node.type === 'loot' ? (
                        <div className="w-4 h-4 text-[#F0A500]"><MapPin size={16} /></div>
                      ) : node.type === 'locked' ? (
                        <div className="text-[#F0A500]/50"><Lock size={28} /></div>
                      ) : (
                        <div className={`w-3 h-3 ${node.cleared ? 'bg-[#0C0A18]' : 'bg-[#F0A500]/40'} rounded-sm`} />
                      )}
                    </div>

                    {/* Tooltip Label */}
                    <div className="absolute top-12 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-30 pointer-events-none">
                      {node.type === 'locked' ? (
                        <div className="bg-[#13111C] border border-[#2D2850] p-2 shadow-[0_0_15px_rgba(124,58,237,0.2)] flex flex-col gap-1 items-center transform -rotate-45">
                          <span className="text-[#9D93C0] text-[12px] font-['Lato'] max-w-[200px] text-center whitespace-normal">
                            {node.tooltipText}
                          </span>
                        </div>
                      ) : (
                        <div className="bg-[#0C0A18] border border-[#F0A500] px-3 py-1 text-[#F0A500] text-[10px] font-['Cinzel'] tracking-widest uppercase transform -rotate-45">
                          {node.name}
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Map Legend */}
            <div className="absolute bottom-8 left-8 flex flex-col gap-2">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-[#F0A500] rotate-45" />
                <span className="text-[#7A5A10] text-[10px] font-['Cinzel'] tracking-widest uppercase">Cleared Area</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 border border-[#7A5A10] rotate-45" />
                <span className="text-[#7A5A10] text-[10px] font-['Cinzel'] tracking-widest uppercase">Undiscovered</span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
