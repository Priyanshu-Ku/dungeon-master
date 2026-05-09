'use client';

import React from 'react';
import { motion } from 'motion/react';
import { useGameStore } from '@/store/gameStore';

/**
 * DefeatOverlay
 * 
 * Desaturated red-tinted death screen with boss taunts and retry options.
 */
export function DefeatOverlay() {
  const { resetCombat, setCombatPhase, combatPhase, currentBoss } = useGameStore();

  if (combatPhase !== 'DEFEAT') return null;

  const handleRetry = () => {
    // Return to decision with full HP for retry
    setCombatPhase('DECISION');
  };

  const handleFlee = () => {
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
        background: 'radial-gradient(circle, rgba(60, 0, 0, 0.9) 0%, #050508 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        color: '#E8EAF0',
        textAlign: 'center'
      }}
    >
      <motion.h1
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        style={{
          fontFamily: 'var(--font-cinzel)',
          fontSize: '96px',
          margin: 0,
          color: 'rgba(255, 59, 48, 0.6)',
          textShadow: '0 0 40px rgba(0,0,0,0.8)',
          letterSpacing: '0.2em'
        }}
      >
        DEFEATED
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        style={{
          fontFamily: 'var(--font-dm-sans)',
          fontStyle: 'italic',
          color: '#4B5563',
          maxWidth: '500px',
          marginTop: '20px',
          lineHeight: '1.6'
        }}
      >
        "{currentBoss?.name || 'The void'} whispers: 'Your algorithms were weak... your logic, flawed. Return to the surface, coder.'"
      </motion.p>

      <div style={{ marginTop: '60px', display: 'flex', gap: '24px' }}>
        <button
          onClick={handleRetry}
          style={{
            padding: '12px 32px',
            background: 'rgba(255, 59, 48, 0.1)',
            border: '1px solid #FF3B30',
            color: '#FF3B30',
            fontFamily: 'var(--font-cinzel)',
            fontSize: '18px',
            cursor: 'pointer',
            borderRadius: '4px',
            letterSpacing: '0.1em'
          }}
        >
          TRY AGAIN
        </button>
        <button
          onClick={handleFlee}
          style={{
            padding: '12px 32px',
            background: 'none',
            border: '1px solid #4B5563',
            color: '#4B5563',
            fontFamily: 'var(--font-cinzel)',
            fontSize: '18px',
            cursor: 'pointer',
            borderRadius: '4px',
            letterSpacing: '0.1em'
          }}
        >
          FLEE
        </button>
      </div>
    </motion.div>
  );
}
