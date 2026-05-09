'use client';

import React, { useEffect, useState } from 'react';
import { motion, useMotionValue, useTransform, animate, AnimatePresence } from 'motion/react';
import { useCombatStore } from '@/store/combatStore';

export function BossHPBar() {
  const { currentBoss, combatPhase } = useCombatStore();
  const [prevPhase, setPrevPhase] = useState(1);
  const [showShockwave, setShowShockwave] = useState(false);

  const hpValue = useMotionValue(currentBoss?.currentHp || 0);
  const displayHP = useTransform(hpValue, (v) => Math.round(v));

  useEffect(() => {
    if (currentBoss) {
      animate(hpValue, currentBoss.currentHp, { duration: 1, ease: 'easeOut' });
      if (currentBoss.phase !== prevPhase) {
        setPrevPhase(currentBoss.phase);
        setShowShockwave(true);
        setTimeout(() => setShowShockwave(false), 1000);
      }
    }
  }, [currentBoss?.currentHp, currentBoss?.phase, hpValue, prevPhase]);

  if (!currentBoss || ['VICTORY', 'DEFEAT'].includes(combatPhase)) return null;

  const currentColor = 
    currentBoss.phase === 1 ? '#FF6B35' : 
    currentBoss.phase === 2 ? '#8B5CF6' : '#EF4444';

  const hpPct = (currentBoss.currentHp / currentBoss.maxHp) * 100;

  return (
    <motion.div
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1, scale: showShockwave ? [1, 1.05, 1] : 1 }}
      style={{
        position: 'fixed',
        top: '32px',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '500px',
        zIndex: 100,
        pointerEvents: 'none',
        textAlign: 'center'
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '8px' }}>
        <h2 style={{ fontFamily: 'var(--font-cinzel)', fontSize: '28px', margin: 0, color: '#E8EAF0', letterSpacing: '0.15em' }}>
          {currentBoss.name}
        </h2>
        <div style={{ fontFamily: 'var(--font-cinzel)', fontSize: '12px', color: currentColor, fontWeight: 800 }}>
          PHASE {['I', 'II', 'III'][currentBoss.phase - 1]}
        </div>
      </div>

      <div style={{ height: '12px', background: 'rgba(0,0,0,0.6)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '2px', position: 'relative', overflow: 'hidden' }}>
        <motion.div animate={{ width: `${hpPct}%`, backgroundColor: currentColor }} transition={{ duration: 0.5 }} style={{ height: '100%' }} />
        <AnimatePresence>
          {showShockwave && (
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: '100%' }}
              transition={{ duration: 0.8 }}
              style={{ position: 'absolute', top: 0, bottom: 0, width: '100px', background: 'linear-gradient(to right, transparent, #FFF, transparent)', opacity: 0.8 }}
            />
          )}
        </AnimatePresence>
      </div>
      <div style={{ marginTop: '6px', fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'rgba(255,255,255,0.5)', textAlign: 'right' }}>
        <motion.span>{displayHP}</motion.span> / {currentBoss.maxHp}
      </div>
    </motion.div>
  );
}
