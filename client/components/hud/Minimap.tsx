'use client';

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useDungeonStore } from '@/store/dungeonStore';
import { Lock, Skull, HelpCircle, Coffee, Sword } from 'lucide-react';

const TYPE_ICONS = {
  START: null,
  COMBAT: Sword,
  ELITE: Skull,
  REST: Coffee,
  MYSTERY: HelpCircle,
  BOSS_FINAL: Skull
};

export function Minimap() {
  const { dungeonGraph, currentRoomId, clearedRooms, unlockedRooms, isRoomLocked } = useDungeonStore();
  const [isCollapsed, setIsCollapsed] = React.useState(false);

  if (!dungeonGraph.length) return null;

  // Scale and offset for SVG layout
  const scale = 0.4;
  const offsetX = 50;
  const offsetY = 100;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      style={{
        position: 'fixed',
        top: '24px',
        right: '24px',
        width: isCollapsed ? '48px' : '220px',
        height: isCollapsed ? '48px' : '260px',
        background: 'rgba(4, 6, 14, 0.94)',
        backdropFilter: 'blur(16px)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '12px',
        zIndex: 1000,
        overflow: 'hidden',
        boxShadow: '0 8px 32px rgba(0,0,0,0.6)',
        cursor: 'default',
        pointerEvents: 'auto'
      }}
    >
      <div 
        onClick={() => setIsCollapsed(!isCollapsed)}
        style={{ 
          height: '40px', 
          display: 'flex', 
          alignItems: 'center', 
          padding: '0 16px',
          borderBottom: isCollapsed ? 'none' : '1px solid rgba(255,255,255,0.05)',
          justifyContent: 'space-between',
          cursor: 'pointer'
        }}
      >
        {!isCollapsed && (
          <span style={{ fontFamily: 'var(--font-cinzel)', fontSize: '12px', color: '#888', letterSpacing: '0.1em' }}>
            DUNGEON MAP
          </span>
        )}
        <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#00E5FF', opacity: 0.8 }} />
      </div>

      <AnimatePresence>
        {!isCollapsed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ width: '100%', height: 'calc(100% - 40px)', padding: '10px' }}
          >
            <svg width="100%" height="100%" viewBox="0 0 200 240">
              {/* Connections */}
              {dungeonGraph.map(room => (
                <React.Fragment key={`lines-${room.id}`}>
                  {room.connections.map(targetId => {
                    const target = dungeonGraph.find(r => r.id === targetId);
                    if (!target) return null;
                    return (
                      <line
                        key={`${room.id}-${targetId}`}
                        x1={room.position.x * scale + offsetX}
                        y1={room.position.y * scale + offsetY}
                        x2={target.position.x * scale + offsetX}
                        y2={target.position.y * scale + offsetY}
                        stroke={unlockedRooms.has(targetId) ? "rgba(255,255,255,0.15)" : "rgba(255,255,255,0.05)"}
                        strokeWidth="1"
                      />
                    );
                  })}
                </React.Fragment>
              ))}

              {/* Nodes */}
              {dungeonGraph.map(room => {
                const isCurrent = room.id === currentRoomId;
                const isCleared = clearedRooms.has(room.id);
                const isLocked = isRoomLocked(room.id);
                const isDiscovered = unlockedRooms.has(room.id);
                
                const Icon = TYPE_ICONS[room.type];
                const nodeColor = 
                  room.type === 'START' ? '#9CA3AF' :
                  room.type === 'BOSS_FINAL' ? '#EF4444' :
                  room.type === 'REST' ? '#2ECC71' :
                  room.type === 'MYSTERY' ? '#8B5CF6' : '#00E5FF';

                if (!isDiscovered) return null;

                return (
                  <g key={`node-${room.id}`}>
                    {isCurrent && (
                      <motion.circle
                        cx={room.position.x * scale + offsetX}
                        cy={room.position.y * scale + offsetY}
                        r="12"
                        fill="none"
                        stroke="#00E5FF"
                        strokeWidth="1.5"
                        animate={{ r: [10, 14, 10], opacity: [0.8, 0.2, 0.8] }}
                        transition={{ repeat: Infinity, duration: 2 }}
                      />
                    )}
                    <circle
                      cx={room.position.x * scale + offsetX}
                      cy={room.position.y * scale + offsetY}
                      r="8"
                      fill={isCleared ? 'rgba(0, 229, 255, 0.1)' : 'rgba(0,0,0,0.6)'}
                      stroke={isLocked ? '#2A1500' : isCurrent ? '#00E5FF' : nodeColor}
                      strokeWidth="1.5"
                      opacity={isLocked ? 0.4 : 1}
                    />
                    {isLocked && (
                      <foreignObject
                        x={room.position.x * scale + offsetX - 4}
                        y={room.position.y * scale + offsetY - 4}
                        width="8"
                        height="8"
                      >
                        <Lock size={8} color="#2A1500" />
                      </foreignObject>
                    )}
                    {!isLocked && Icon && (
                      <foreignObject
                        x={room.position.x * scale + offsetX - 5}
                        y={room.position.y * scale + offsetY - 5}
                        width="10"
                        height="10"
                      >
                        <Icon size={10} color={isCurrent ? '#00E5FF' : nodeColor} />
                      </foreignObject>
                    )}
                    {room.type === 'START' && (
                      <text
                        x={room.position.x * scale + offsetX}
                        y={room.position.y * scale + offsetY + 3}
                        textAnchor="middle"
                        fill="#9CA3AF"
                        style={{ fontSize: '8px', fontWeight: 700, pointerEvents: 'none' }}
                      >
                        S
                      </text>
                    )}
                  </g>
                );
              })}
            </svg>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
