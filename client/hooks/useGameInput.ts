'use client';

import { useEffect, useState, useCallback } from 'react';
import { useGameStore, type HitQuality } from '@/store/gameStore';

/**
 * useGameInput
 * 
 * Centralised keyboard input handler.
 * ArrowUp/Down -> Navigate challenges (DECISION)
 * Enter/Space  -> Confirm (DECISION) or Hit (TIMING)
 * Escape       -> Skip/Flee
 */
export function useGameInput() {
  const { 
    combatPhase, 
    currentBoss, 
    setSelectedChallenge, 
    setCombatPhase,
    setHitQuality 
  } = useGameStore();

  const [selectedIndex, setSelectedIndex] = useState(0);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    // Input Lock
    if (['HIT_RESULT', 'BOSS_RETALIATION', 'VICTORY', 'DEFEAT'].includes(combatPhase)) {
      return;
    }

    const challenges = currentBoss?.availableChallenges || [];

    switch (e.code) {
      case 'ArrowUp':
        if (combatPhase === 'DECISION') {
          setSelectedIndex(prev => (prev > 0 ? prev - 1 : challenges.length - 1));
        }
        break;

      case 'ArrowDown':
        if (combatPhase === 'DECISION') {
          setSelectedIndex(prev => (prev < challenges.length - 1 ? prev + 1 : 0));
        }
        break;

      case 'Digit1':
      case 'Digit2':
      case 'Digit3':
        if (combatPhase === 'DECISION') {
          const idx = parseInt(e.key) - 1;
          if (idx < challenges.length) setSelectedIndex(idx);
        }
        break;

      case 'Enter':
      case 'Space':
        e.preventDefault();
        if (combatPhase === 'DECISION') {
          const selected = challenges[selectedIndex];
          if (selected) {
            setSelectedChallenge(selected);
            // Flash effect handled in component, transition here
            setTimeout(() => setCombatPhase('TIMING'), 320);
          }
        } else if (combatPhase === 'TIMING') {
          // Actual hit detection is handled via event dispatch or direct ref reading in TimingTrack
          // but we trigger the phase transition here as a fallback or signal
          window.dispatchEvent(new CustomEvent('combat:hit-trigger'));
        }
        break;

      case 'Escape':
        if (combatPhase === 'DECISION') {
          window.dispatchEvent(new CustomEvent('combat:flee-modal'));
        } else if (combatPhase === 'BOSS_CINEMATIC') {
          setCombatPhase('DECISION');
        }
        break;
    }
  }, [combatPhase, currentBoss, selectedIndex, setSelectedChallenge, setCombatPhase]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown, { capture: true });
    return () => window.removeEventListener('keydown', handleKeyDown, { capture: true });
  }, [handleKeyDown]);

  return { selectedIndex };
}
