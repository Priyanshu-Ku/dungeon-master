'use client';

import React from 'react';
import { motion } from 'motion/react';
import { useCombatStore } from '@/store/combatStore';
import { Compass, User, Sparkles, Navigation, Globe } from 'lucide-react';

const SATELLITE_IMAGE = 'C:\\Users\\priya\\.gemini\\antigravity\\brain\\1a4e1f75-9b9c-4823-bfa7-c8bc1cad71f3\\forest_minimap_texture_1778361592839.png';

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
  const [isExpanded, setIsExpanded] = React.useState(false);

  const mapSize = isExpanded ? 500 : 200;
  const scale = isExpanded ? 10 : 5; 
  const worldSize = 80; 
  const viewCenter = mapSize / 2;

  const imageSize = worldSize * scale;
  const imageX = viewCenter - (playerMapPos.x * scale) - (imageSize / 2);
  const imageY = viewCenter - (playerMapPos.z * scale) - (imageSize / 2);

  const getMapCoords = (x: number, z: number) => ({
    x: viewCenter + (x - playerMapPos.x) * scale,
    y: viewCenter + (z - playerMapPos.z) * scale
  });

  const playerPos = { x: viewCenter, y: viewCenter };
  const wizardPos = getMapCoords(0, 0);

  const toggleExpand = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isCollapsed) setIsCollapsed(false);
    else setIsExpanded(!isExpanded);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ 
        opacity: 1, 
        scale: 1,
        width: isExpanded ? '650px' : (isCollapsed ? '52px' : '220px'),
        height: isExpanded ? '650px' : (isCollapsed ? '52px' : '220px'),
        left: isExpanded ? '50%' : 'auto',
        top: isExpanded ? '50%' : '24px',
        right: isExpanded ? 'auto' : '24px',
        translateX: isExpanded ? '-50%' : '0%',
        translateY: isExpanded ? '-50%' : '0%',
        borderRadius: isExpanded ? '24px' : '50%',
      }}
      style={{
        position: 'fixed',
        background: '#050805',
        border: '4px solid rgba(74, 222, 128, 0.2)',
        zIndex: isExpanded ? 5000 : 1000,
        overflow: 'hidden',
        boxShadow: isExpanded ? '0 0 150px rgba(0,0,0,1)' : '0 12px 64px rgba(0,0,0,0.9)',
        cursor: 'pointer',
        pointerEvents: 'auto',
        fontFamily: 'var(--font-mono)'
      }}
      onClick={toggleExpand}
    >
      {/* Satellite Feed Container */}
      {!isCollapsed && (
        <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden' }}>
          
          {/* Realistic Texture Layer */}
          <div style={{
            position: 'absolute',
            width: `${imageSize}px`,
            height: `${imageSize}px`,
            left: `${imageX}px`,
            top: `${imageY}px`,
            backgroundImage: `url("file://${SATELLITE_IMAGE}")`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: 0.95,
            zIndex: 1
          }} />

          {/* HUD Vignette */}
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'radial-gradient(circle, transparent 30%, rgba(0,0,0,0.6) 100%)',
            zIndex: 10,
            pointerEvents: 'none'
          }} />

          {/* Grid Lines Overlay */}
          <svg width="100%" height="100%" viewBox={`0 0 ${mapSize} ${mapSize}`} style={{ position: 'relative', zIndex: 20 }}>
            {[...Array(11)].map((_, i) => (
              <React.Fragment key={i}>
                <line x1={0} y1={(mapSize/10) * i} x2={mapSize} y2={(mapSize/10) * i} stroke="rgba(74, 222, 128, 0.1)" strokeWidth="0.5" />
                <line x1={(mapSize/10) * i} y1={0} x2={(mapSize/10) * i} y2={mapSize} stroke="rgba(74, 222, 128, 0.1)" strokeWidth="0.5" />
              </React.Fragment>
            ))}

            {/* Environment: Stones */}
            {MAP_STONES.map((stone, i) => {
              const pos = getMapCoords(stone.x, stone.z);
              return (
                <path 
                  key={`stone-${i}`}
                  d={`M ${pos.x-3} ${pos.y+2} L ${pos.x} ${pos.y-3} L ${pos.x+3} ${pos.y+2} Z`} 
                  fill="#94A3B8"
                  opacity="0.6"
                />
              );
            })}

            {/* Environment: Trees */}
            {MAP_TREES.map((tree, i) => {
              const pos = getMapCoords(tree.x, tree.z);
              return (
                <g key={`tree-${i}`}>
                  <circle cx={pos.x} cy={pos.y} r="3" fill="#15803D" opacity="0.4" />
                  <circle cx={pos.x} cy={pos.y} r="1" fill="#22C55E" />
                </g>
              );
            })}

            {/* Wizard Marker */}
            <g transform={`translate(${wizardPos.x}, ${wizardPos.y})`}>
              <circle r="12" fill="none" stroke="#7C3AED" strokeWidth="1" strokeDasharray="3 3" />
              <Sparkles size={14} color="#7C3AED" style={{ filter: 'drop-shadow(0 0 5px #7C3AED)' }} />
            </g>

            {/* Daughter Marker */}
            {showDaughterLocation && (
              <g transform={`translate(${getMapCoords(25, -25).x}, ${getMapCoords(25, -25).y})`}>
                <motion.circle 
                  r="14" fill="none" stroke="#EF4444" strokeWidth="1"
                  animate={{ r: [8, 16], opacity: [0.8, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
                <circle r="4" fill="#EF4444" style={{ filter: 'drop-shadow(0 0 10px #EF4444)' }} />
                <text x="10" y="4" fill="#EF4444" style={{ fontSize: '10px', fontWeight: 900 }}>RESONANCE_LOCK</text>
              </g>
            )}

            {/* Player Marker */}
            <g transform={`translate(${playerPos.x}, ${playerPos.y})`}>
              <motion.circle 
                r="16" fill="none" stroke="#4ADE80" strokeWidth="1"
                animate={{ r: [10, 20], opacity: [0.5, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <circle r="5" fill="#4ADE80" style={{ filter: 'drop-shadow(0 0 10px #4ADE80)' }} />
              <Navigation size={12} color="#FFF" style={{ transform: 'translate(-6px, -6px)' }} />
            </g>
          </svg>

          {/* Header Overlay */}
          <div style={{
            position: 'absolute',
            top: 0, left: 0, right: 0,
            height: '32px',
            background: 'linear-gradient(to bottom, rgba(0,0,0,0.8), transparent)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 16px',
            zIndex: 30
          }}>
            <Globe size={14} color="#4ADE80" />
            <span style={{ fontSize: '9px', color: '#4ADE80', fontWeight: 900 }}>GPS_LIVE</span>
          </div>

          {/* Expanded Sidebar Data */}
          {isExpanded && (
            <>
              <div style={{
                position: 'absolute',
                bottom: '30px', left: '30px',
                padding: '16px',
                background: 'rgba(0,0,0,0.85)',
                borderRadius: '8px',
                border: '1px solid #4ADE80',
                color: '#4ADE80',
                fontSize: '11px',
                zIndex: 40
              }}>
                <div style={{ marginBottom: '5px' }}>X: {Math.round(playerMapPos.x)}</div>
                <div style={{ marginBottom: '5px' }}>Z: {Math.round(playerMapPos.z)}</div>
                <div style={{ color: '#FFF', opacity: 0.5 }}>SIGNAL: STABLE</div>
              </div>

              <div style={{
                position: 'absolute',
                top: '60px', right: '30px',
                color: '#FFF',
                fontSize: '14px',
                fontWeight: 900,
                zIndex: 40
              }}>
                <div>N</div>
                <div style={{ width: '1px', height: '40px', background: '#FFF', margin: '4px auto' }} />
              </div>
            </>
          )}
        </div>
      )}

      {/* Collapse State Icon */}
      {isCollapsed && (
        <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 30 }}>
          <Compass size={28} color="#4ADE80" />
        </div>
      )}
    </motion.div>
  );
}
