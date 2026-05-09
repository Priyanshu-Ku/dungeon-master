'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { usePlayerStore } from '@/store/playerStore';
import { useCombatStore } from '@/store/combatStore';

export function StatRibbon() {
  const { hp, maxHp, mp, maxMp, xp, xpToNextLevel, level } = usePlayerStore();
  const { combatPhase } = useCombatStore();
  
  const [ghostHp, setGhostHp] = useState(hp);
  const [ghostMp, setGhostMp] = useState(mp);
  
  useEffect(() => {
    const hpTimer = setTimeout(() => setGhostHp(hp), 800);
    const mpTimer = setTimeout(() => setGhostMp(mp), 800);
    return () => {
      clearTimeout(hpTimer);
      clearTimeout(mpTimer);
    };
  }, [hp, mp]);

  if (['VICTORY', 'DEFEAT'].includes(combatPhase)) return null;

  const isLowHp = hp / maxHp < 0.25;

  return (
    <motion.div
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      style={{
        position: 'fixed',
        bottom: '24px',
        left: '24px',
        width: '240px',
        background: 'rgba(8, 10, 18, 0.92)',
        backdropFilter: 'blur(12px)',
        border: '1px solid rgba(255,255,255,0.07)',
        borderRadius: '12px',
        padding: '16px',
        color: '#E8EAF0',
        zIndex: 100,
        boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: '#FFD700' }}>
          LVL {level}
        </span>
        <span style={{ fontSize: '13px', fontWeight: 700, letterSpacing: '0.05em', fontFamily: 'var(--font-cinzel)' }}>
          CODEWIELDER
        </span>
      </div>

      {/* HP Bar */}
      <div style={{ marginBottom: '10px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', marginBottom: '4px', fontFamily: 'var(--font-mono)' }}>
          <span>HP</span>
          <span>{Math.round(hp)}/{maxHp}</span>
        </div>
        <div style={{ height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', overflow: 'hidden', position: 'relative' }}>
          <motion.div
            animate={{ width: `${(ghostHp / maxHp) * 100}%` }}
            transition={{ duration: 0.6 }}
            style={{ position: 'absolute', top: 0, left: 0, height: '100%', background: 'rgba(255,255,255,0.3)', borderRadius: '3px' }}
          />
          <motion.div
            animate={{ 
              width: `${(hp / maxHp) * 100}%`,
              backgroundColor: isLowHp ? '#FF3B30' : '#2ECC71'
            }}
            style={{ 
              position: 'absolute', 
              top: 0, 
              left: 0, 
              height: '100%', 
              borderRadius: '3px',
              boxShadow: isLowHp ? '0 0 10px #FF3B30' : 'none'
            }}
          />
        </div>
      </div>

      {/* MP Bar */}
      <div style={{ marginBottom: '10px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', marginBottom: '4px', fontFamily: 'var(--font-mono)' }}>
          <span>MP</span>
          <span>{Math.round(mp)}/{maxMp}</span>
        </div>
        <div style={{ height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', overflow: 'hidden', position: 'relative' }}>
          <motion.div
            animate={{ width: `${(ghostMp / maxMp) * 100}%` }}
            transition={{ duration: 0.6 }}
            style={{ position: 'absolute', top: 0, left: 0, height: '100%', background: 'rgba(255,255,255,0.3)', borderRadius: '3px' }}
          />
          <motion.div
            animate={{ width: `${(mp / maxMp) * 100}%` }}
            style={{ position: 'absolute', top: 0, left: 0, height: '100%', background: '#5B8DEF', borderRadius: '3px' }}
          />
        </div>
      </div>

      {/* XP Line */}
      <div style={{ marginTop: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '10px', color: '#4B5563', fontFamily: 'var(--font-mono)' }}>
          <span>⭐</span>
          <span>{xp.toLocaleString()} / {xpToNextLevel.toLocaleString()} XP</span>
        </div>
        <div style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: '2px', background: 'rgba(255,255,255,0.05)' }}>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${(xp / xpToNextLevel) * 100}%` }}
            transition={{ type: 'spring', stiffness: 50, damping: 15 }}
            style={{ height: '100%', background: '#FFD700', boxShadow: '0 0 8px #FFD700' }}
          />
        </div>
      </div>
    </motion.div>
  );
}
