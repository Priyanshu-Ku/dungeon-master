'use client';

import React from 'react';
import { motion } from 'motion/react';
import { ItemInstance, ITEM_REGISTRY } from '@/lib/lootSystem';
import { Box, Sparkles, Zap, Shield } from 'lucide-react';

interface LootRevealProps {
  items: ItemInstance[];
  onClaim: (item: ItemInstance) => void;
}

const TIER_COLORS = {
  Common: '#9CA3AF',
  Rare: '#3B82F6',
  Epic: '#A855F7',
  Obsidian: '#FFD700'
};

export function LootReveal({ items, onClaim }: LootRevealProps) {
  return (
    <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', marginTop: '40px', pointerEvents: 'auto' }}>
      {items.map((item, index) => {
        const def = ITEM_REGISTRY[item.definitionId];
        const color = TIER_COLORS[item.rarity];

        return (
          <motion.div
            key={item.instanceId}
            initial={{ opacity: 0, y: 40, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: index * 0.2, type: 'spring', damping: 15 }}
            style={{
              width: '240px',
              background: 'rgba(255, 255, 255, 0.03)',
              backdropFilter: 'blur(10px)',
              border: `1px solid ${color}44`,
              borderRadius: '16px',
              padding: '24px',
              position: 'relative',
              cursor: 'pointer',
              boxShadow: `0 0 20px ${color}11`
            }}
            whileHover={{ scale: 1.05, borderColor: color }}
            onClick={() => onClaim(item)}
          >
            {/* Rarity Glow */}
            <div style={{
              position: 'absolute',
              inset: 0,
              background: `radial-gradient(circle at top, ${color}22, transparent 70%)`,
              borderRadius: '16px',
              pointerEvents: 'none'
            }} />

            <div style={{ color, fontSize: '10px', fontWeight: 800, letterSpacing: '0.2em', marginBottom: '8px' }}>
              {item.rarity.toUpperCase()}
            </div>
            
            <h3 style={{ margin: 0, fontSize: '20px', fontFamily: 'var(--font-cinzel)', color: '#FFF' }}>
              {def.name}
            </h3>

            <p style={{ fontSize: '12px', color: '#94A3B8', margin: '12px 0' }}>
              {def.description}
            </p>

            {/* Stats */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '12px' }}>
              {item.rolledStats.hpBonus !== 0 && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#FFF' }}>
                  <Shield size={14} color="#EF4444" />
                  <span>+{item.rolledStats.hpBonus} Max HP</span>
                </div>
              )}
              {item.rolledStats.mpBonus !== 0 && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#FFF' }}>
                  <Zap size={14} color="#3B82F6" />
                  <span>+{item.rolledStats.mpBonus} Max MP</span>
                </div>
              )}
              {item.rolledStats.damageMult !== 0 && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#FFF' }}>
                  <Sparkles size={14} color="#FFD700" />
                  <span>+{Math.round(item.rolledStats.damageMult * 100)}% Damage</span>
                </div>
              )}
            </div>

            <div style={{ marginTop: '20px', textAlign: 'center' }}>
              <span style={{ fontSize: '10px', color: '#444', fontFamily: 'var(--font-mono)' }}>CLICK TO EQUIP</span>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
