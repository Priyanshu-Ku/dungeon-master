'use client';

import React from 'react';
import { motion } from 'motion/react';
import { useGameStore } from '@/store/gameStore';

/**
 * VictoryOverlay
 * 
 * Cinematic victory screen with loot summary and LeetCode progression cards.
 */
export function VictoryOverlay() {
  const { resetCombat, setCombatPhase, combatPhase } = useGameStore();

  if (combatPhase !== 'VICTORY') return null;

  const handleContinue = () => {
    resetCombat();
    setCombatPhase('EXPLORATION');
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      style={{
        position: 'fixed',
        inset: 0,
        background: '#050508',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        color: '#E8EAF0',
        textAlign: 'center'
      }}
    >
      {/* Particle Burst Simulation */}
      <div className="victory-particles" />

      <motion.h1
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        style={{
          fontFamily: 'var(--font-cinzel)',
          fontSize: '96px',
          margin: 0,
          color: '#FFD700',
          textShadow: '0 0 40px rgba(255,215,0,0.4)',
          letterSpacing: '0.4em'
        }}
      >
        VICTORY
      </motion.h1>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1, duration: 0.5 }}
        style={{ marginTop: '40px', display: 'flex', gap: '20px' }}
      >
        {/* Loot Cards */}
        {[
          { label: 'XP Gained', value: '+1,200' },
          { label: 'Loot', value: 'Obsidian Shard' },
          { label: 'New Unlock', value: 'Graph Algorithm' }
        ].map((item, i) => (
          <div key={i} style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.07)',
            borderRadius: '8px',
            padding: '20px',
            width: '160px'
          }}>
            <div style={{ fontSize: '12px', color: '#4B5563', marginBottom: '8px', textTransform: 'uppercase' }}>{item.label}</div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '14px' }}>{item.value}</div>
          </div>
        ))}
      </motion.div>

      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        onClick={handleContinue}
        style={{
          marginTop: '60px',
          padding: '12px 32px',
          background: 'none',
          border: '1px solid #FFD700',
          color: '#FFD700',
          fontFamily: 'var(--font-cinzel)',
          fontSize: '18px',
          cursor: 'pointer',
          borderRadius: '4px',
          letterSpacing: '0.2em',
          transition: 'all 0.2s'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = '#FFD700';
          e.currentTarget.style.color = '#050508';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'none';
          e.currentTarget.style.color = '#FFD700';
        }}
      >
        CONTINUE DESCENT
      </motion.button>

      <style jsx>{`
        .victory-particles {
          position: absolute;
          width: 200px;
          height: 200px;
          background: radial-gradient(circle, #FFD700 0%, transparent 70%);
          filter: blur(40px);
          animation: burst 2s infinite ease-out;
          opacity: 0.3;
          pointer-events: none;
        }
        @keyframes burst {
          0% { transform: scale(0.5); opacity: 0; }
          50% { opacity: 0.4; }
          100% { transform: scale(3); opacity: 0; }
        }
      `}</style>
    </motion.div>
  );
}
