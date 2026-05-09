'use client';

import React, { useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { useMetaStore } from '@/store/metaStore';
import { MainMenu } from '@/components/hud/MainMenu';
import { Onboarding } from '@/components/hud/Onboarding';
import { LoadingScreen } from '@/components/ui/LoadingScreen';
import CombatScene from '@/app/combat/CombatScene';
import dynamic from 'next/dynamic';

const CinematicIntro = dynamic(
  () => import('@/components/three/CinematicIntro').then(m => m.CinematicIntro),
  { ssr: false }
);

export default function Home() {
  const { currentView, initializeMeta } = useMetaStore();

  useEffect(() => {
    initializeMeta();
  }, [initializeMeta]);

  return (
    <main className="relative w-screen h-screen overflow-hidden bg-[#050508]">
      <AnimatePresence mode="wait">
        {currentView === 'MENU' && (
          <motion.div
            key="menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <MainMenu />
          </motion.div>
        )}

        {currentView === 'ONBOARDING' && (
          <motion.div
            key="onboarding"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Onboarding />
          </motion.div>
        )}

        {currentView === 'LOADING' && (
          <LoadingScreen key="loading" onComplete={() => useMetaStore.getState().setView('GAME')} />
        )}

        {currentView === 'CINEMATIC' && (
          <CinematicIntro
            key="cinematic"
            onComplete={() => useMetaStore.getState().setView('LOADING')}
          />
        )}

        {currentView === 'GAME' && (
          <motion.div
            key="game"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            style={{ width: '100%', height: '100%' }}
          >
            <CombatScene />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cinematic Vignette */}
      <div
        className="absolute inset-0 pointer-events-none z-[9999]"
        style={{
          background: 'radial-gradient(circle at center, transparent 30%, rgba(5,5,8,0.4) 100%)'
        }}
      />
    </main>
  );
}