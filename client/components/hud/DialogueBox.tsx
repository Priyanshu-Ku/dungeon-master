'use client';

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useDialogueStore } from '@/store/dialogueStore';
import { SPEAKERS } from '@/lib/dialogueData';
import { useSettingsStore } from '@/store/settingsStore';
import { ChevronRight } from 'lucide-react';

export function DialogueBox() {
  const { isActive, currentSequence, currentIndex, advanceDialogue } = useDialogueStore();
  const { textDelay, textSpeed } = useSettingsStore();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isActive && (e.code === 'Space' || e.code === 'Enter')) {
        advanceDialogue();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isActive, advanceDialogue]);

  if (!isActive || !currentSequence.length) return null;

  const currentStep = currentSequence[currentIndex];
  const speaker = SPEAKERS[currentStep.speakerId];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 50 }}
        onClick={advanceDialogue}
        style={{
          position: 'fixed',
          bottom: '40px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '80%',
          maxWidth: '800px',
          background: 'rgba(5, 5, 8, 0.9)',
          backdropFilter: 'blur(20px)',
          border: `1px solid ${speaker.color}44`,
          borderRadius: '12px',
          padding: '24px',
          zIndex: 2000,
          cursor: 'pointer',
          boxShadow: `0 10px 40px rgba(0,0,0,0.5), 0 0 20px ${speaker.color}11`,
          pointerEvents: 'auto'
        }}
      >
        {/* Speaker Label */}
        <div style={{
          position: 'absolute',
          top: '-12px',
          left: '20px',
          background: speaker.color,
          color: '#FFF',
          padding: '2px 12px',
          fontSize: '10px',
          fontWeight: 800,
          fontFamily: 'var(--font-mono)',
          borderRadius: '4px',
          letterSpacing: '0.1em'
        }}>
          {speaker.name.toUpperCase()}
        </div>

        {/* Text Area */}
        <div style={{
          minHeight: '60px',
          color: '#E2D9F3',
          fontFamily: 'var(--font-lato)',
          fontSize: '18px',
          lineHeight: '1.6',
          letterSpacing: '0.01em'
        }}>
          <motion.p
            key={`${currentIndex}-${currentStep.text}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ 
              duration: textSpeed === 'instant' ? 0 : (currentStep.text.length * textDelay) / 1000 
            }}
          >
            {currentStep.text}
          </motion.p>
        </div>

        {/* Advance Prompt */}
        <div style={{
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'center',
          gap: '8px',
          marginTop: '12px',
          color: '#4B456A',
          fontSize: '10px',
          fontFamily: 'var(--font-mono)'
        }}>
          <span>PRESS [SPACE] TO CONTINUE</span>
          <motion.div
            animate={{ x: [0, 5, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
          >
            <ChevronRight size={14} />
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
