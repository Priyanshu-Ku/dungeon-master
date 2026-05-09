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
    <div className="ancient-texture" style={{
      width: '100vw',
      height: '100vh',
      background: '#050508',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <div className="ancient-vignette" />

      {/* Atmospheric Flicker */}
      <motion.div
        animate={{ 
          opacity: [0.2, 0.4, 0.2, 0.3, 0.2]
        }}
        transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          background: 'radial-gradient(circle at 50% 40%, rgba(124, 58, 237, 0.1) 0%, transparent 60%)',
          zIndex: 1,
          pointerEvents: 'none'
        }}
      />

      {/* Drifting Dust Particles */}
      {[...Array(12)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ 
            x: Math.random() * 100 + '%', 
            y: '110vh', 
            opacity: 0,
            scale: Math.random() * 0.5 + 0.5
          }}
          animate={{ 
            y: '-10vh',
            x: (Math.random() * 100 - 10) + '%',
            opacity: [0, 0.4, 0.4, 0],
          }}
          transition={{ 
            duration: Math.random() * 10 + 10, 
            repeat: Infinity, 
            delay: Math.random() * 20,
            ease: "linear"
          }}
          style={{
            position: 'absolute',
            width: '2px',
            height: '2px',
            background: '#7C3AED',
            borderRadius: '50%',
            filter: 'blur(1px)',
            zIndex: 1,
            pointerEvents: 'none'
          }}
        />
      ))}

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
          transition={{ duration: 1.5, ease: "easeOut" }}
        >
          <h2 className="font-cormorant" style={{ 
            fontSize: '16px', 
            letterSpacing: '1.2em', 
            color: '#7C3AED',
            marginBottom: '12px',
            opacity: 0.8
          }}>
            THE VOID CHASM
          </h2>
          <h1 className="font-cormorant" style={{ 
            fontSize: '96px', 
            letterSpacing: '0.3em', 
            color: '#FFF',
            margin: 0,
            fontWeight: 400,
            textShadow: '0 0 40px rgba(124, 58, 237, 0.2), 0 0 80px rgba(124, 58, 237, 0.1)'
          }}>
            OBSIDIAN DEPTHS
          </h1>
          <p className="font-fira" style={{ 
            fontSize: '11px', 
            color: '#4B456A',
            marginTop: '24px',
            letterSpacing: '0.4em',
            textTransform: 'uppercase'
          }}>
            VERSION 1.0.4C // SYSTEM READY
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1.2 }}
          style={{ 
            marginTop: '90px', 
            display: 'flex', 
            flexDirection: 'column', 
            gap: '12px',
            alignItems: 'center' 
          }}
        >
          {hasSave && (
            <MenuButton 
              label="RESUME DESCENT" 
              icon={<Play size={18} fill="currentColor" />} 
              primary 
              onClick={() => setView('LOADING')} 
            />
          )}
          
          <MenuButton 
            label={ngPlusCount > 0 ? `NEW DESCENT (NG+ ${ngPlusCount})` : "NEW DESCENT"} 
            icon={ngPlusCount > 0 ? <Zap size={18} color="#FFD700" /> : <ChevronRight size={18} />} 
            onClick={() => {
              localStorage.removeItem('obsidian_depths_save_v1');
              setView('CINEMATIC');
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
      <div className="font-fira" style={{
        position: 'absolute',
        bottom: '40px',
        width: '100%',
        display: 'flex',
        justifyContent: 'space-between',
        padding: '0 60px',
        color: '#4B456A',
        fontSize: '10px',
        letterSpacing: '0.15em',
        opacity: 0.6
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: unlockedBadgeIds.length > 0 ? '#7C3AED' : '#4B456A' }}>
          <div className="issue-badge" style={{ 
            background: '#EF4444', 
            color: '#FFF', 
            padding: '2px 8px', 
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            marginRight: '12px',
            cursor: 'default'
          }}>
            <span style={{ fontSize: '8px', fontWeight: 'bold', background: 'rgba(0,0,0,0.2)', padding: '0 4px', borderRadius: '50%' }}>N</span>
            <span style={{ fontSize: '9px' }}>1 ISSUE</span>
          </div>
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
      whileHover={!disabled ? { scale: 1.02, x: 5 } : {}}
      whileTap={!disabled ? { scale: 0.98 } : {}}
      onClick={handleAction}
      disabled={disabled}
      className="font-fira"
      style={{
        width: '380px',
        padding: '18px 32px',
        background: primary ? 'linear-gradient(135deg, #7C3AED 0%, #5B21B6 100%)' : 'rgba(255,255,255,0.02)',
        border: primary ? 'none' : '1px solid rgba(124, 58, 237, 0.1)',
        borderRadius: '2px',
        color: disabled ? '#2D2850' : '#FFF',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        cursor: disabled ? 'not-allowed' : 'pointer',
        fontSize: '13px',
        letterSpacing: '0.2em',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        boxShadow: primary ? '0 10px 30px rgba(124, 58, 237, 0.2)' : 'none',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {!primary && !disabled && (
        <div style={{
          position: 'absolute',
          left: 0,
          top: 0,
          width: '2px',
          height: '100%',
          background: '#7C3AED',
          opacity: 0,
          transition: 'opacity 0.3s ease'
        }} className="hover-indicator" />
      )}
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        {icon}
        <span style={{ fontWeight: primary ? 600 : 400 }}>{label}</span>
      </div>
      <ChevronRight size={16} style={{ opacity: 0.3, transition: 'transform 0.3s ease' }} className="arrow-icon" />
      
      <style jsx>{`
        button:hover .hover-indicator { opacity: 1 !important; }
        button:hover .arrow-icon { transform: translateX(4px); opacity: 0.8 !important; }
        button:hover { background: ${primary ? 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)' : 'rgba(255,255,255,0.05)'} !important; border-color: rgba(124, 58, 237, 0.4) !important; }
      `}</style>
    </motion.button>
  );
}
