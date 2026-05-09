'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { useCombatStore } from '@/store/combatStore';

export function HitResultFlash() {
  const { 
    hitQuality, 
    lastDamageDealt, 
    lastDamageTaken, 
    currentBoss, 
    setCombatPhase,
    combatPhase,
    applyBossRetaliation
  } = useCombatStore();

  const [active, setActive] = useState(false);

  useEffect(() => {
    if (combatPhase === 'HIT_RESULT') {
      setActive(true);
      
      // If it's a MISS, we immediately trigger retaliation logic visual
      if (hitQuality === 'MISS') {
        applyBossRetaliation();
      }

      const timer = setTimeout(() => {
        setActive(false);
        if (currentBoss && currentBoss.currentHp <= 0) {
          setCombatPhase('VICTORY');
        } else {
          setCombatPhase('BOSS_RETALIATION');
        }
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [combatPhase, currentBoss, setCombatPhase, hitQuality, applyBossRetaliation]);

  if (!active || !hitQuality) return null;

  const isPerfect = hitQuality === 'PERFECT';
  const isGood = hitQuality === 'GOOD';
  const isMiss = hitQuality === 'MISS';

  return (
    <div style={{ position: 'fixed', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200, pointerEvents: 'none' }}>
      
      {isPerfect && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: [0, 1.5, 2], opacity: [0, 0.6, 0] }}
          transition={{ duration: 0.8 }}
          style={{ position: 'absolute', width: '100vh', height: '100vh', background: 'radial-gradient(circle, #FFD700 0%, transparent 70%)', filter: 'blur(60px)' }}
        />
      )}

      {isMiss && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.8, 0.4] }}
          style={{ position: 'absolute', inset: 0, boxShadow: 'inset 0 0 150px rgba(239, 68, 68, 0.6)', background: 'rgba(239, 68, 68, 0.05)' }}
        />
      )}

      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1, x: isPerfect ? [-10, 10, -5, 5, 0] : 0 }}
        transition={{ duration: 0.4, x: { repeat: 2, duration: 0.1 } }}
        style={{ textAlign: 'center' }}
      >
        <h1 style={{
          fontFamily: 'var(--font-cinzel)',
          fontSize: isPerfect ? '96px' : '64px',
          margin: 0,
          color: isPerfect ? '#FFD700' : isGood ? '#00E5FF' : '#EF4444',
          textShadow: `0 0 30px ${isPerfect ? '#FFD700' : isGood ? '#00E5FF' : '#EF4444'}`,
          fontWeight: 900
        }}>
          {hitQuality}
        </h1>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: -80, opacity: 1 }}
          transition={{ duration: 1, ease: 'easeOut' }}
          style={{ fontFamily: 'var(--font-mono)', fontSize: '32px', fontWeight: 800, color: isMiss ? '#EF4444' : '#FFF', marginTop: '20px' }}
        >
          {isMiss ? `-${lastDamageTaken} HP` : `+${lastDamageDealt} DMG`}
        </motion.div>
      </motion.div>

      {isGood && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.2, 0] }}
          transition={{ duration: 0.5 }}
          style={{ position: 'absolute', inset: 0, background: '#00E5FF' }}
        />
      )}
    </div>
  );
}
