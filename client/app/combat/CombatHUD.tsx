'use client';

import React from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { useCombatStore } from '@/store/combatStore';
import { CombatDecisionMenu } from './CombatDecisionMenu';
import { TimingChallenge } from './TimingChallenge';
import { BossReaction } from './BossReaction';
import { ResolutionOverlay } from './ResolutionOverlay';
import { StatRibbon } from '@/components/ui/StatRibbon';

// ─────────────────────────────────────────────────────────────────────────────
// CombatHUD
// Absolute-positioned overlay that lives above the R3F Canvas.
// AnimatePresence (mode="wait") handles phase transitions.
// ─────────────────────────────────────────────────────────────────────────────

export function CombatHUD() {
  const { combatPhase } = useCombatStore();

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 10,
      }}
    >
      {/* StatRibbon is always visible when not idle */}
      {combatPhase !== 'idle' && <StatRibbon />}

      {/* Phase-conditional panels — AnimatePresence handles mount/unmount */}
      <AnimatePresence mode="wait">
        {combatPhase === 'entering' && null}

        {combatPhase === 'decision' && (
          <motion.div
            key="decision"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ pointerEvents: 'all', width: '100%', height: '100%' }}
          >
            <CombatDecisionMenu />
          </motion.div>
        )}

        {combatPhase === 'challenge' && (
          <motion.div
            key="challenge"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ pointerEvents: 'all', width: '100%', height: '100%' }}
          >
            <TimingChallenge />
          </motion.div>
        )}

        {combatPhase === 'reaction' && (
          <motion.div
            key="reaction"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ pointerEvents: 'all', width: '100%', height: '100%' }}
          >
            <BossReaction />
          </motion.div>
        )}

        {combatPhase === 'resolving' && (
          <motion.div
            key="resolving"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ pointerEvents: 'all', width: '100%', height: '100%' }}
          >
            <ResolutionOverlay />
          </motion.div>
        )}
      </AnimatePresence>

      {/*
        Dimming quad slot — Phase 1 inserts a semi-transparent overlay here
        during the 'entering' cinematic.
      */}
      {/* Postprocessing Vignette slot — Phase 1 wires EffectComposer here */}
    </div>
  );
}
