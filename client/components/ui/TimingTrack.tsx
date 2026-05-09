'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { useCombatStore } from '@/store/combatStore';

export function TimingTrack() {
  const { selectedChallenge, setHitQuality, setCombatPhase, applyHit, combatPhase } = useCombatStore();
  const [progress, setProgress] = useState(0);
  const rafRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const progressRef = useRef(0);
  const isEvaluated = useRef(false);

  const duration = selectedChallenge?.timingWindow || 2000;

  const handleEvaluation = (qualityOverride?: 'PERFECT' | 'GOOD' | 'MISS') => {
    if (isEvaluated.current) return;
    isEvaluated.current = true;
    if (rafRef.current) cancelAnimationFrame(rafRef.current);

    let quality: 'PERFECT' | 'GOOD' | 'MISS' = qualityOverride || 'MISS';
    if (!qualityOverride) {
      const p = progressRef.current;
      if (p >= 0.46 && p <= 0.54) quality = 'PERFECT';
      else if (p >= 0.38 && p <= 0.62) quality = 'GOOD';
    }

    applyHit(quality);
    setCombatPhase('HIT_RESULT');
  };

  useEffect(() => {
    if (combatPhase !== 'TIMING') return;
    isEvaluated.current = false;
    startTimeRef.current = performance.now();

    const tick = (now: number) => {
      const elapsed = now - (startTimeRef.current || now);
      const currentProgress = Math.min(1, elapsed / duration);
      progressRef.current = currentProgress;
      setProgress(currentProgress);

      if (currentProgress >= 1) {
        handleEvaluation('MISS');
        return;
      }
      rafRef.current = requestAnimationFrame(tick);
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.code === 'Enter') {
        e.preventDefault();
        handleEvaluation();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [combatPhase, duration, applyHit, setCombatPhase]);

  if (combatPhase !== 'TIMING') return null;

  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 100, opacity: 0 }}
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        width: '100vw',
        height: '20vh',
        background: 'rgba(5, 5, 8, 0.95)',
        backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 1px, rgba(0, 229, 255, 0.05) 2px)',
        borderTop: '1px solid rgba(0, 229, 255, 0.2)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 100,
        pointerEvents: 'none'
      }}
    >
      <div style={{ width: '80%', height: '60px', background: 'rgba(255,255,255,0.02)', position: 'relative', borderRadius: '4px', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', left: '38%', width: '24%', height: '100%', background: 'rgba(255, 107, 53, 0.1)' }} />
        <div style={{ position: 'absolute', left: '46%', width: '8%', height: '100%', background: 'rgba(0, 229, 255, 0.2)', borderLeft: '1px solid #00E5FF', borderRight: '1px solid #00E5FF' }} />
        <div style={{ 
          position: 'absolute', 
          left: `${progress * 100}%`, 
          width: '4px', 
          height: '100%', 
          background: '#FFF', 
          boxShadow: '0 0 15px #00E5FF',
          zIndex: 10 
        }} />
      </div>
      <div style={{ position: 'absolute', top: '15%', fontFamily: 'var(--font-cinzel)', fontSize: '14px', color: '#00E5FF', letterSpacing: '0.4em' }}>
        SYNCHRONIZE
      </div>
    </motion.div>
  );
}
