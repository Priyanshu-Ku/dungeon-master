'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'motion/react';
import { useCombatStore } from '@/store/combatStore';
import { CountdownRing } from '@/components/ui/CountdownRing';
import { 
  Search, 
  Grid3X3, 
  Zap, 
  Network, 
  BarChart2,
  AlertCircle 
} from 'lucide-react';

const ICON_MAP = {
  search: Search,
  dp: Grid3X3,
  greedy: Zap,
  graph: Network,
  sort: BarChart2
};

export function CombatDecisionMenu() {
  const { 
    currentBoss, 
    setCombatPhase, 
    setSelectedChallenge, 
    combatPhase,
    playerMp,
    drainMp 
  } = useCombatStore();
  
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [confirming, setConfirming] = useState(false);

  const challenges = currentBoss?.availableChallenges || [];

  const handleConfirm = useCallback(() => {
    const selected = challenges[selectedIndex];
    if (selected && playerMp >= selected.mpCost) {
      setSelectedChallenge(selected);
      drainMp(selected.mpCost);
      setConfirming(true);
    }
  }, [selectedIndex, challenges, playerMp, setSelectedChallenge, drainMp]);

  useEffect(() => {
    if (combatPhase !== 'DECISION' || confirming) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.code) {
        case 'ArrowUp':
          setSelectedIndex(prev => (prev > 0 ? prev - 1 : challenges.length - 1));
          break;
        case 'ArrowDown':
          setSelectedIndex(prev => (prev < challenges.length - 1 ? prev + 1 : 0));
          break;
        case 'Enter':
        case 'Space':
          e.preventDefault();
          handleConfirm();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [combatPhase, confirming, challenges.length, handleConfirm]);

  if (combatPhase !== 'DECISION') return null;

  return (
    <div style={{
      position: 'fixed',
      left: '40px',
      top: '50%',
      transform: 'translateY(-50%)',
      width: '420px',
      zIndex: 100,
      pointerEvents: 'none'
    }}>
      <motion.div
        initial={{ y: 60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 280, damping: 24 }}
        style={{
          background: 'rgba(255,255,255,0.04)',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(255,255,255,0.07)',
          borderRadius: '24px',
          padding: '24px',
          pointerEvents: 'auto'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h3 style={{ fontFamily: 'var(--font-cinzel)', fontSize: '20px', margin: 0, color: '#E8EAF0', letterSpacing: '0.2em' }}>
            STRATEGY
          </h3>
          <CountdownRing 
            durationMs={8000} 
            variant="decision" 
            onExpire={() => setCombatPhase('BOSS_RETALIATION')}
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {challenges.map((challenge, idx) => {
            const isSelected = selectedIndex === idx;
            const IconComp = ICON_MAP[challenge.icon] || AlertCircle;
            const canAfford = playerMp >= challenge.mpCost;
            const isConfirmingThis = confirming && isSelected;

            return (
              <motion.div
                key={challenge.id}
                initial={{ y: 20, opacity: 0 }}
                animate={isConfirmingThis ? { scale: 1.05 } : { y: 0, opacity: 1 }}
                transition={{ delay: idx * 0.08 }}
                onAnimationComplete={() => {
                  if (isConfirmingThis) setCombatPhase('TIMING');
                }}
                style={{
                  background: 'rgba(255,255,255,0.02)',
                  border: '1px solid',
                  borderColor: isSelected ? '#00E5FF' : 'rgba(255,255,255,0.05)',
                  borderRadius: '16px',
                  padding: '16px',
                  opacity: canAfford ? 1 : 0.4,
                  boxShadow: isSelected ? '0 0 0 1.5px #00E5FF, 0 0 24px rgba(0,229,255,0.18)' : 'none',
                  position: 'relative'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <IconComp size={20} color={isSelected ? '#00E5FF' : '#64748B'} />
                    <span style={{ fontFamily: 'var(--font-cinzel)', fontSize: '16px', color: isSelected ? '#00E5FF' : '#E8EAF0' }}>
                      {challenge.name}
                    </span>
                  </div>
                  <div style={{ 
                    fontSize: '10px', 
                    padding: '2px 8px', 
                    background: challenge.difficulty === 'easy' ? '#22C55E22' : challenge.difficulty === 'medium' ? '#F59E0B22' : '#EF444422',
                    color: challenge.difficulty === 'easy' ? '#22C55E' : challenge.difficulty === 'medium' ? '#F59E0B' : '#EF4444',
                    border: '1px solid currentColor',
                    borderRadius: '4px'
                  }}>
                    {challenge.difficulty.toUpperCase()}
                  </div>
                </div>
                <p style={{ margin: '0 0 16px 0', fontSize: '14px', color: '#94A3B8', fontFamily: 'var(--font-dm-sans)' }}>
                  {challenge.description}
                </p>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-mono)', fontSize: '12px' }}>
                  <span style={{ color: '#00E5FF' }}>⚔ {Math.floor(challenge.damageMult * 10)}–20 DMG</span>
                  <span style={{ color: canAfford ? '#818CF8' : '#EF4444' }}>◆ {challenge.mpCost} MP</span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}
