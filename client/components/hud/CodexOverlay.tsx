'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CODEX_ENTRIES } from '@/lib/dialogueData';
import { useAchievementStore } from '@/store/achievementStore';
import { Book, X, ChevronRight } from 'lucide-react';

interface CodexOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CodexOverlay({ isOpen, onClose }: CodexOverlayProps) {
  const [selectedId, setSelectedId] = useState(CODEX_ENTRIES[0]?.id);
  const selectedEntry = CODEX_ENTRIES.find(e => e.id === selectedId);
  const { updateProgress } = useAchievementStore();

  useEffect(() => {
    if (isOpen) {
      updateProgress('codex_opens', 1);
    }
  }, [isOpen, updateProgress]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(5, 5, 8, 0.95)',
          backdropFilter: 'blur(30px)',
          zIndex: 3000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '40px',
          pointerEvents: 'auto'
        }}
      >
        <div style={{
          width: '100%',
          maxWidth: '1000px',
          height: '100%',
          maxHeight: '700px',
          display: 'flex',
          flexDirection: 'column',
          border: '1px solid rgba(124, 58, 237, 0.2)',
          borderRadius: '16px',
          overflow: 'hidden',
          background: 'rgba(12, 10, 24, 0.8)'
        }}>
          {/* Header */}
          <div style={{
            padding: '24px',
            borderBottom: '1px solid rgba(255,255,255,0.05)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Book color="#7C3AED" size={20} />
              <h2 style={{ margin: 0, fontFamily: 'var(--font-cinzel)', fontSize: '20px', letterSpacing: '0.2em', color: '#FFF' }}>
                THE ANCIENT CODEX
              </h2>
            </div>
            <button 
              onClick={onClose}
              style={{ background: 'none', border: 'none', color: '#4B456A', cursor: 'pointer' }}
            >
              <X size={24} />
            </button>
          </div>

          {/* Main Content */}
          <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
            {/* Sidebar */}
            <div style={{
              width: '300px',
              borderRight: '1px solid rgba(255,255,255,0.05)',
              overflowY: 'auto',
              padding: '16px'
            }}>
              {CODEX_ENTRIES.map(entry => (
                <div
                  key={entry.id}
                  onClick={() => setSelectedId(entry.id)}
                  style={{
                    padding: '12px 16px',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    background: selectedId === entry.id ? 'rgba(124, 58, 237, 0.1)' : 'transparent',
                    border: `1px solid ${selectedId === entry.id ? 'rgba(124, 58, 237, 0.3)' : 'transparent'}`,
                    marginBottom: '8px',
                    transition: 'all 0.2s'
                  }}
                >
                  <div style={{ fontSize: '10px', color: '#7C3AED', fontWeight: 800, letterSpacing: '0.1em', marginBottom: '4px' }}>
                    {entry.category.toUpperCase()}
                  </div>
                  <div style={{ color: selectedId === entry.id ? '#FFF' : '#94A3B8', fontSize: '14px', fontWeight: 600 }}>
                    {entry.title}
                  </div>
                </div>
              ))}
            </div>

            {/* Detail View */}
            <div style={{ flex: 1, padding: '40px', overflowY: 'auto' }}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={selectedId}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <h3 style={{ fontFamily: 'var(--font-cinzel)', fontSize: '32px', color: '#7C3AED', margin: '0 0 24px 0' }}>
                    {selectedEntry?.title}
                  </h3>
                  <p style={{ color: '#E2D9F3', fontSize: '18px', lineHeight: 1.8, fontFamily: 'var(--font-lato)' }}>
                    {selectedEntry?.content}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
