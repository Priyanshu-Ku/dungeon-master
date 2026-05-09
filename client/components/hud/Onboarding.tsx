'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useMetaStore } from '@/store/metaStore';
import { ChevronRight, MousePointer2, Keyboard, Sword, Book } from 'lucide-react';

const STEPS = [
  {
    title: 'THE AWAKENING',
    description: 'You are an Explorer in the Obsidian Depths. Use [WASD] or [ARROWS] to navigate the chasm.',
    icon: <Keyboard size={32} color="#7C3AED" />,
    target: 'MOVEMENT'
  },
  {
    title: 'THE RESONANCE',
    description: 'Your real-world coding performance on LeetCode fuels your decryption power. Link your account to channel this energy.',
    icon: <MousePointer2 size={32} color="#00E5FF" />,
    target: 'RESONANCE'
  },
  {
    title: 'THE DECRYPTION',
    description: 'Combat is a battle of timing and logic. Match the rhythm to penetrate the Void Architect’s defenses.',
    icon: <Sword size={32} color="#EF4444" />,
    target: 'COMBAT'
  },
  {
    title: 'THE CODEX',
    description: 'Ancient knowledge is scattered throughout. Open the Codex [C] to understand the world you traverse.',
    icon: <Book size={32} color="#FFD700" />,
    target: 'LORE'
  }
];

export function Onboarding() {
  const [currentStep, setCurrentStep] = useState(0);
  const { completeOnboarding } = useMetaStore();

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      completeOnboarding();
    }
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(5, 5, 8, 0.9)',
      backdropFilter: 'blur(20px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 5000,
      pointerEvents: 'auto'
    }}>
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 1.1, y: -20 }}
          style={{
            width: '400px',
            background: 'rgba(12, 10, 24, 0.8)',
            border: '1px solid rgba(124, 58, 237, 0.3)',
            borderRadius: '16px',
            padding: '40px',
            textAlign: 'center',
            boxShadow: '0 20px 60px rgba(0,0,0,0.8)'
          }}
        >
          <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'center' }}>
            {STEPS[currentStep].icon}
          </div>
          
          <h2 style={{ 
            fontFamily: 'var(--font-cinzel)', 
            fontSize: '24px', 
            color: '#FFF', 
            marginBottom: '16px',
            letterSpacing: '0.1em'
          }}>
            {STEPS[currentStep].title}
          </h2>
          
          <p style={{ 
            fontFamily: 'var(--font-lato)', 
            fontSize: '16px', 
            color: '#94A3B8', 
            lineHeight: 1.6,
            marginBottom: '40px'
          }}>
            {STEPS[currentStep].description}
          </p>

          <button
            onClick={handleNext}
            style={{
              width: '100%',
              padding: '14px',
              background: '#7C3AED',
              color: '#FFF',
              border: 'none',
              borderRadius: '4px',
              fontFamily: 'var(--font-mono)',
              fontSize: '14px',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px'
            }}
          >
            <span>{currentStep === STEPS.length - 1 ? 'BEGIN DESCENT' : 'NEXT PROTOCOL'}</span>
            <ChevronRight size={18} />
          </button>

          {/* Progress dots */}
          <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', marginTop: '24px' }}>
            {STEPS.map((_, i) => (
              <div 
                key={i}
                style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  background: i === currentStep ? '#7C3AED' : '#2D2850',
                  transition: 'background 0.3s'
                }}
              />
            ))}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
