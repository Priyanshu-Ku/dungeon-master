'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { assetLoader } from '@/lib/assetLoader';

interface LoadingScreenProps {
  onComplete: () => void;
}

export function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [progress, setProgress] = useState(0);
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    assetLoader.addOnProgressListener((p) => {
      setProgress(p);
      if (p >= 100) {
        setTimeout(() => {
          setIsDone(true);
          onComplete();
        }, 500);
      }
    });

    assetLoader.preloadAll();
  }, [onComplete]);

  return (
    <AnimatePresence>
      {!isDone && (
        <motion.div
          exit={{ opacity: 0 }}
          style={{
            position: 'fixed',
            inset: 0,
            background: '#050508',
            zIndex: 9999,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: 'var(--font-mono)'
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ textAlign: 'center' }}
          >
            <h2 style={{ 
              color: '#FFF', 
              fontSize: '12px', 
              letterSpacing: '0.4em', 
              marginBottom: '40px',
              opacity: 0.8
            }}>
              INITIALIZING RESONANCE
            </h2>

            {/* Progress Bar Container */}
            <div style={{
              width: '240px',
              height: '2px',
              background: 'rgba(124, 58, 237, 0.1)',
              position: 'relative',
              overflow: 'hidden'
            }}>
              {/* Active Progress */}
              <motion.div
                animate={{ width: `${progress}%` }}
                style={{
                  height: '100%',
                  background: '#7C3AED',
                  boxShadow: '0 0 10px #7C3AED'
                }}
              />
            </div>

            <div style={{
              marginTop: '16px',
              fontSize: '10px',
              color: '#4B456A',
              letterSpacing: '0.1em'
            }}>
              {Math.round(progress)}% COMPILED
            </div>
          </motion.div>

          {/* Background Atmosphere */}
          <div style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            background: 'radial-gradient(circle at center, rgba(124, 58, 237, 0.05) 0%, transparent 70%)',
            pointerEvents: 'none'
          }} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
