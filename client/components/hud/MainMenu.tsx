'use client';

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useMetaStore } from '@/store/metaStore';
import { useDailyStore } from '@/store/dailyStore';
import { useProgressionStore } from '@/store/progressionStore';
import { useAchievementStore } from '@/store/achievementStore';
import { audioManager } from '@/lib/audioManager';
import { SettingsOverlay } from '@/components/hud/SettingsOverlay';
import { ChevronRight, Play, Database, Settings, Calendar, Check, Zap, Award } from 'lucide-react';

export function MainMenu() {
  const { setView } = useMetaStore();
  const { startDaily, hasCompletedToday } = useDailyStore();
  const { ngPlusCount } = useProgressionStore();
  const { unlockedBadgeIds } = useAchievementStore();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const hasSave = typeof window !== 'undefined' && localStorage.getItem('obsidian_depths_save_v1') !== null;

  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      background: '#050508',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Background Atmosphere */}
      <motion.div
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.1, 0.2, 0.1]
        }}
        transition={{ repeat: Infinity, duration: 10, ease: 'easeInOut' }}
        style={{
          position: 'absolute',
          width: '800px',
          height: '800px',
          background: 'radial-gradient(circle, #7C3AED 0%, transparent 70%)',
          filter: 'blur(100px)',
          zIndex: 0
        }}
      />

      <div style={{ zIndex: 10, textAlign: 'center' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <h2 style={{ 
            fontFamily: 'var(--font-cinzel)', 
            fontSize: '14px', 
            letterSpacing: '0.8em', 
            color: '#7C3AED',
            marginBottom: '8px'
          }}>
            THE VOID CHASM
          </h2>
          <h1 style={{ 
            fontFamily: 'var(--font-cinzel)', 
            fontSize: '84px', 
            letterSpacing: '0.2em', 
            color: '#FFF',
            margin: 0,
            textShadow: '0 0 40px rgba(124, 58, 237, 0.4)'
          }}>
            OBSIDIAN DEPTHS
          </h1>
          <p style={{ 
            fontFamily: 'var(--font-mono)', 
            fontSize: '12px', 
            color: '#4B456A',
            marginTop: '20px',
            letterSpacing: '0.2em'
          }}>
            VERSION 1.0.4C // SYSTEM READY
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 1 }}
          style={{ 
            marginTop: '80px', 
            display: 'flex', 
            flexDirection: 'column', 
            gap: '16px',
            alignItems: 'center' 
          }}
        >
          {hasSave && (
            <MenuButton 
              label="RESUME DESCENT" 
              icon={<Play size={18} />} 
              primary 
              onClick={() => setView('LOADING')} 
            />
          )}
          
          <MenuButton 
            label={ngPlusCount > 0 ? `NEW DESCENT (NG+ ${ngPlusCount})` : "NEW DESCENT"} 
            icon={ngPlusCount > 0 ? <Zap size={18} color="#FFD700" /> : <ChevronRight size={18} />} 
            onClick={() => {
              localStorage.removeItem('obsidian_depths_save_v1');
              setView('LOADING');
            }} 
          />

          <MenuButton 
            label={hasCompletedToday() ? "DAILY COMPLETED" : "DAILY PROTOCOL"} 
            icon={hasCompletedToday() ? <Check size={18} color="#4ADE80" /> : <Calendar size={18} />} 
            disabled={hasCompletedToday()}
            onClick={() => {
              startDaily();
              setView('LOADING');
            }} 
          />
          
          <MenuButton 
            label="CORE SETTINGS" 
            icon={<Settings size={18} />} 
            onClick={() => setIsSettingsOpen(true)} 
          />
        </motion.div>
      </div>

      <SettingsOverlay isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />

      {/* Footer Info */}
      <div style={{
        position: 'absolute',
        bottom: '40px',
        width: '100%',
        display: 'flex',
        justifyContent: 'space-between',
        padding: '0 60px',
        color: '#4B456A',
        fontFamily: 'var(--font-mono)',
        fontSize: '10px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: unlockedBadgeIds.length > 0 ? '#7C3AED' : '#4B456A' }}>
          <Award size={14} />
          <span>HALL OF RECORDS: {unlockedBadgeIds.length} BADGES EARNED</span>
        </div>
        <span>RESONANCE CONNECTED: LEETCODE.API</span>
      </div>
    </div>
  );
}

function MenuButton({ label, icon, primary, disabled, onClick }: { 
  label: string, 
  icon: React.ReactNode, 
  primary?: boolean, 
  disabled?: boolean,
  onClick?: () => void 
}) {
  const handleAction = () => {
    if (!disabled && onClick) {
      audioManager.playSFX('/audio/sfx/click.mp3');
      onClick();
    }
  };

  return (
    <motion.button
      whileHover={!disabled ? { scale: 1.05, x: 10 } : {}}
      whileTap={!disabled ? { scale: 0.95 } : {}}
      onClick={handleAction}
      disabled={disabled}
      style={{
        width: '320px',
        padding: '16px 32px',
        background: primary ? '#7C3AED' : 'rgba(255,255,255,0.03)',
        border: `1px solid ${primary ? '#7C3AED' : 'rgba(124, 58, 237, 0.2)'}`,
        borderRadius: '4px',
        color: disabled ? '#2D2850' : '#FFF',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        cursor: disabled ? 'not-allowed' : 'pointer',
        fontFamily: 'var(--font-mono)',
        fontSize: '14px',
        letterSpacing: '0.1em',
        transition: 'all 0.2s'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        {icon}
        <span>{label}</span>
      </div>
      <ChevronRight size={16} opacity={0.5} />
    </motion.button>
  );
}
