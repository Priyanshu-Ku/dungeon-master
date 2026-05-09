'use client';

import React from 'react';
import { motion } from 'motion/react';
import { useCombatStore } from '@/store/combatStore';
import { Compass, User, Sparkles, Trees, Mountain } from 'lucide-react';

// Hardcoded environmental objects for the map (matching the DungeonExplorer scene)
const MAP_TREES = [
  { x: -18, z: -18 }, { x: 18, z: -18 }, { x: -18, z: 18 }, { x: 18, z: 18 },
  { x: 0, z: -22 }, { x: -22, z: 0 }, { x: 22, z: 0 }, { x: 0, z: 22 },
  { x: -8, z: -8 }, { x: 8, z: -8 }, { x: -8, z: 8 }, { x: 8, z: 8 }, { x: 0, z: -15 }
];

const MAP_STONES = [
  { x: -12, z: -5 }, { x: 5, z: 12 }, { x: -5, z: -15 }, { x: 14, z: 6 },
  { x: -10, z: 14 }, { x: 12, z: -12 }, { x: -15, z: -2 }, { x: 3, z: -8 }
];

export function Minimap() {
  const { playerMapPos, showDaughterLocation } = useCombatStore();
  const [isCollapsed, setIsCollapsed] = React.useState(false);

  // Map scale configuration
  const mapSize = 180;
  const scale = 3.5; // Zoom level

  // Center the map on 0,0
  const centerX = mapSize / 2;
  const centerY = mapSize / 2;

  // Convert 3D world coordinates to 2D map coordinates
  const getMapCoords = (x: number, z: number) => ({
    x: centerX + x * scale,
    y: centerY + z * scale
  });

  const playerPos = getMapCoords(playerMapPos.x, playerMapPos.z);
  const wizardPos = getMapCoords(0, 0);

  return (
    <motion.div
      initial={{ opacity: 0, x: 20, scale: 0.9 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      style={{
        position: 'fixed',
        top: '24px',
        right: '24px',
        width: isCollapsed ? '50px' : '220px',
        height: isCollapsed ? '50px' : '220px',
        background: 'rgba(4, 6, 12, 0.9)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.12)',
        borderRadius: isCollapsed ? '50%' : '16px',
        zIndex: 1000,
        overflow: 'hidden',
        boxShadow: '0 12px 48px rgba(0,0,0,0.9), inset 0 0 40px rgba(0, 229, 255, 0.03)',
        cursor: 'pointer',
        pointerEvents: 'auto',
        transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
      }}
      onClick={() => setIsCollapsed(!isCollapsed)}
    >
      {/* Dynamic Header */}
      <div style={{
        position: 'absolute',
        top: 0, left: 0, right: 0,
        height: isCollapsed ? '100%' : '36px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: isCollapsed ? 'center' : 'space-between',
        padding: isCollapsed ? '0' : '0 14px',
        background: 'rgba(255, 255, 255, 0.04)',
        borderBottom: isCollapsed ? 'none' : '1px solid rgba(255,255,255,0.06)',
        zIndex: 10
      }}>
        {!isCollapsed && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#00E5FF', boxShadow: '0 0 8px #00E5FF' }} />
            <span style={{ 
              fontFamily: 'var(--font-mono)', 
              fontSize: '10px', 
              color: '#E2E8F0', 
              letterSpacing: '0.15em',
              fontWeight: 700
            }}>
              FOREST_DEPTHS
            </span>
          </div>
        )}
        <Compass size={isCollapsed ? 24 : 14} color={isCollapsed ? "#00E5FF" : "rgba(255,255,255,0.4)"} />
      </div>

      {!isCollapsed && (
        <div style={{ position: 'relative', width: '100%', height: '100%', paddingTop: '36px' }}>
          {/* Scan Line Animation */}
          <motion.div
            animate={{ top: ['0%', '100%'] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'linear' }}
            style={{
              position: 'absolute',
              left: 0, right: 0,
              height: '2px',
              background: 'linear-gradient(to right, transparent, rgba(0, 229, 255, 0.3), transparent)',
              zIndex: 5,
              pointerEvents: 'none',
              boxShadow: '0 0 15px rgba(0, 229, 255, 0.2)'
            }}
          />

          <svg width="100%" height="100%" viewBox={`0 0 ${mapSize} ${mapSize}`} style={{ padding: '12px' }}>
            {/* Background terrain texture (circles) */}
            <defs>
              <radialGradient id="mapGrad" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="rgba(0, 229, 255, 0.05)" />
                <stop offset="100%" stopColor="transparent" />
              </radialGradient>
            </defs>
            <circle cx={centerX} cy={centerY} r={mapSize/2.2} fill="url(#mapGrad)" />

            {/* Grid Mesh */}
            {[...Array(9)].map((_, i) => (
              <React.Fragment key={i}>
                <line x1={0} y1={(mapSize/8) * i} x2={mapSize} y2={(mapSize/8) * i} stroke="rgba(255,255,255,0.02)" strokeWidth="0.5" />
                <line x1={(mapSize/8) * i} y1={0} x2={(mapSize/8) * i} y2={mapSize} stroke="rgba(255,255,255,0.02)" strokeWidth="0.5" />
              </React.Fragment>
            ))}

            {/* Environment: Stones */}
            {MAP_STONES.map((stone, i) => {
              const pos = getMapCoords(stone.x, stone.z);
              return (
                <g key={`stone-${i}`} opacity="0.4">
                  <path 
                    d={`M ${pos.x-3} ${pos.y+2} L ${pos.x} ${pos.y-3} L ${pos.x+3} ${pos.y+2} Z`} 
                    fill="#64748B" 
                  />
                </g>
              );
            })}

            {/* Environment: Trees */}
            {MAP_TREES.map((tree, i) => {
              const pos = getMapCoords(tree.x, tree.z);
              return (
                <g key={`tree-${i}`} opacity="0.6">
                  <circle cx={pos.x} cy={pos.y} r="4" fill="rgba(34, 197, 94, 0.15)" />
                  <circle cx={pos.x} cy={pos.y} r="1.5" fill="#15803D" />
                </g>
              );
            })}

            {/* Wizard Landmark */}
            <motion.circle 
              cx={wizardPos.x} cy={wizardPos.y} r="10" 
              fill="none" stroke="#7C3AED" strokeWidth="0.5" strokeDasharray="3 2"
              animate={{ rotate: 360 }} transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
            />
            <foreignObject x={wizardPos.x - 7} y={wizardPos.y - 7} width="14" height="14">
              <Sparkles size={14} color="#7C3AED" style={{ filter: 'drop-shadow(0 0 2px #7C3AED)' }} />
            </foreignObject>

            {/* Player Character */}
            <g>
              <motion.circle 
                cx={playerPos.x} cy={playerPos.y} r="12" 
                fill="none" stroke="#00E5FF" strokeWidth="1"
                animate={{ r: [6, 12], opacity: [0.8, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <circle cx={playerPos.x} cy={playerPos.y} r="5" fill="rgba(0, 229, 255, 0.2)" />
              <circle cx={playerPos.x} cy={playerPos.y} r="2.5" fill="#00E5FF" style={{ filter: 'drop-shadow(0 0 4px #00E5FF)' }} />
              <foreignObject x={playerPos.x - 8} y={playerPos.y - 18} width="16" height="16">
                <User size={16} color="#FFF" style={{ filter: 'drop-shadow(0 0 2px rgba(0,0,0,0.8))' }} />
              </foreignObject>
            </g>

            {/* Daughter Location (Hidden until Wizard reveals it) */}
            {showDaughterLocation && (
              <g>
                {(() => {
                  const dPos = getMapCoords(25, -25);
                  return (
                    <>
                      <motion.circle 
                        cx={dPos.x} cy={dPos.y} r="10" 
                        fill="none" stroke="#FF4444" strokeWidth="1"
                        animate={{ r: [6, 14], opacity: [0.8, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      />
                      <circle cx={dPos.x} cy={dPos.y} r="4" fill="#FF4444" style={{ filter: 'drop-shadow(0 0 8px #FF4444)' }} />
                      <text x={dPos.x + 8} y={dPos.y + 4} fill="#FF4444" style={{ fontSize: '8px', fontFamily: 'var(--font-cinzel)', fontWeight: 'bold' }}>
                        DAUGHTER?
                      </text>
                    </>
                  );
                })()}
              </g>
            )}

            {/* Info Legend */}
            <g transform={`translate(10, ${mapSize - 15})`}>
              <text fill="rgba(255,255,255,0.4)" style={{ fontSize: '7px', fontFamily: 'var(--font-mono)' }}>
                X:{Math.round(playerMapPos.x)} Z:{Math.round(playerMapPos.z)}
              </text>
            </g>
          </svg>
        </div>
      )}
    </motion.div>
  );
}
