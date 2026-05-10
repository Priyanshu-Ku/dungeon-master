'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'motion/react';
import { useMetaStore } from '@/store/metaStore';
import { useAchievementStore } from '@/store/achievementStore';
import { SettingsOverlay } from '@/components/hud/SettingsOverlay';
import { Play, Database, Settings, Award } from 'lucide-react';

export function MainMenu() {
  const { setView } = useMetaStore();
  const { unlockedBadgeIds } = useAchievementStore();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const hasSave = typeof window !== 'undefined' && localStorage.getItem('obsidian_depths_save_v1') !== null;

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 50, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 50, damping: 20 });
  const rotateX = useTransform(springY, [-500, 500], [4, -4]);
  const rotateY = useTransform(springX, [-500, 500], [-4, 4]);
  const glowX = useTransform(springX, (v) => v * 0.04);
  const glowY = useTransform(springY, (v) => v * 0.04);

  useEffect(() => {
    setIsMounted(true);
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX - window.innerWidth / 2);
      mouseY.set(e.clientY - window.innerHeight / 2);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  if (!isMounted) return <div style={{ background: '#05050A', width: '100vw', height: '100vh' }} />;

  return (
    <div style={{
      width: '100vw', height: '100vh',
      background: 'radial-gradient(ellipse at 60% 50%, #0D0A0F 0%, #05050A 60%, #020203 100%)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      position: 'relative', overflow: 'hidden',
      fontFamily: "'Cinzel', serif"
    }}>
      
      {/* Deep atmospheric glow — mouse reactive */}
      <motion.div style={{
        position: 'absolute', inset: 0, zIndex: 0,
        x: glowX, y: glowY
      }}>
        <div style={{
          position: 'absolute', top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '900px', height: '500px',
          background: 'radial-gradient(ellipse, rgba(212,175,55,0.07) 0%, transparent 70%)',
          filter: 'blur(80px)', pointerEvents: 'none'
        }} />
      </motion.div>

      {/* Ambient particles */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none' }}>
        {[...Array(18)].map((_, i) => (
          <motion.div
            key={i}
            style={{
              position: 'absolute',
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${Math.random() * 2 + 1}px`,
              height: `${Math.random() * 2 + 1}px`,
              borderRadius: '50%',
              background: '#D4AF37',
              filter: 'blur(1px)',
            }}
            animate={{ y: [-20, -60, -20], opacity: [0, 0.6, 0] }}
            transition={{
              duration: Math.random() * 6 + 8,
              repeat: Infinity,
              delay: Math.random() * 8,
              ease: 'easeInOut'
            }}
          />
        ))}
      </div>

      {/* Thin vignette */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 2,
        background: 'radial-gradient(ellipse at center, transparent 40%, rgba(2,2,3,0.8) 100%)',
        pointerEvents: 'none'
      }} />

      {/* Corner ornaments */}
      {[
        { top: 24, left: 24, bt: 'borderTop', bl: 'borderLeft' },
        { top: 24, right: 24, bt: 'borderTop', bl: 'borderRight' },
        { bottom: 24, left: 24, bt: 'borderBottom', bl: 'borderLeft' },
        { bottom: 24, right: 24, bt: 'borderBottom', bl: 'borderRight' },
      ].map((pos, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 + i * 0.1 }}
          style={{
            position: 'absolute', width: 50, height: 50,
            [pos.bt]: '2px solid rgba(212,175,55,0.5)',
            [pos.bl]: '2px solid rgba(212,175,55,0.5)',
            zIndex: 6, pointerEvents: 'none',
            ...(pos.top !== undefined ? { top: pos.top } : { bottom: pos.bottom }),
            ...(pos.left !== undefined ? { left: pos.left } : { right: pos.right }),
          }}
        />
      ))}

      {/* Main card — subtle 3D tilt */}
      <motion.div
        style={{ rotateX, rotateY, perspective: 1200, zIndex: 10 }}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
        className="flex flex-col items-center"
      >

        {/* Decorative top line */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1.2, delay: 0.3 }}
          style={{
            width: 280, height: 1,
            background: 'linear-gradient(90deg, transparent, #D4AF37, transparent)',
            marginBottom: 32
          }}
        />

        {/* Small label */}
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.45 }}
          transition={{ delay: 0.5 }}
          style={{ letterSpacing: 10, fontSize: 11, color: '#D4AF37', marginBottom: 12 }}
        >
          ANCIENT CHRONICLES
        </motion.span>

        {/* Main title */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 1 }}
          style={{ textAlign: 'center', marginBottom: 8 }}
        >
          <h1 style={{
            fontSize: 'clamp(64px, 10vw, 110px)',
            fontWeight: 900,
            letterSpacing: 18,
            color: '#D4AF37',
            textShadow: '0 0 60px rgba(212,175,55,0.35), 0 4px 30px rgba(0,0,0,0.9)',
            lineHeight: 1,
            marginBottom: 4
          }}>
            OBSIDIAN
          </h1>
          <h2 style={{
            fontSize: 'clamp(28px, 4.5vw, 48px)',
            letterSpacing: 28,
            color: 'rgba(139,115,85,0.65)',
            fontWeight: 400,
            marginLeft: 28
          }}>
            DEPTHS
          </h2>
        </motion.div>

        {/* Decorative bottom line */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1.2, delay: 0.6 }}
          style={{
            width: 180, height: 1,
            background: 'linear-gradient(90deg, transparent, rgba(212,175,55,0.5), transparent)',
            marginTop: 24, marginBottom: 52
          }}
        />

        {/* Menu Buttons */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{ visible: { transition: { staggerChildren: 0.12, delayChildren: 0.8 } } }}
          style={{ display: 'flex', flexDirection: 'column', gap: 14, width: 380 }}
        >
          {hasSave ? (
            <>
              <MenuButton
                icon={<Play size={18} />}
                label="RESUME DESCENT"
                onClick={() => setView('CINEMATIC')}
                primary
              />
              <MenuButton
                icon={<Play size={18} />}
                label="START DESCENT"
                onClick={() => setView('CINEMATIC')}
              />
            </>
          ) : (
            <MenuButton
              icon={<Play size={18} />}
              label="START DESCENT"
              onClick={() => setView('CINEMATIC')}
              primary
            />
          )}
          <MenuButton
            icon={<Settings size={18} />}
            label="SETTINGS"
            onClick={() => setIsSettingsOpen(true)}
          />
        </motion.div>

        {/* Achievement badges */}
        {unlockedBadgeIds.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2 }}
            style={{ display: 'flex', gap: 16, marginTop: 52 }}
          >
            {unlockedBadgeIds.slice(0, 5).map((id, i) => (
              <motion.div
                key={id}
                whileHover={{ scale: 1.25, y: -6 }}
                style={{
                  width: 44, height: 44,
                  border: '1px solid rgba(212,175,55,0.3)',
                  borderRadius: '50%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#D4AF37',
                  background: 'rgba(5,5,10,0.9)',
                  cursor: 'pointer',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.5)'
                }}
              >
                <Award size={20} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </motion.div>

      <AnimatePresence>
        {isSettingsOpen && (
          <SettingsOverlay onClose={() => setIsSettingsOpen(false)} />
        )}
      </AnimatePresence>
    </div>
  );
}

function MenuButton({
  icon, label, onClick, primary = false
}: {
  icon: React.ReactNode; label: string; onClick: () => void; primary?: boolean;
}) {
  return (
    <motion.button
      variants={{ hidden: { opacity: 0, x: -20 }, visible: { opacity: 1, x: 0 } }}
      whileHover={{ x: 10 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      style={{
        width: '100%',
        padding: '18px 28px',
        display: 'flex',
        alignItems: 'center',
        gap: 18,
        background: primary
          ? 'linear-gradient(100deg, rgba(212,175,55,0.18) 0%, rgba(212,175,55,0.04) 100%)'
          : 'rgba(255,255,255,0.02)',
        border: primary
          ? '1px solid rgba(212,175,55,0.6)'
          : '1px solid rgba(255,255,255,0.07)',
        cursor: 'pointer',
        transition: 'border-color 0.3s, background 0.3s',
        position: 'relative',
        overflow: 'hidden',
        fontFamily: "'Cinzel', serif",
      }}
      onMouseEnter={(e) => {
        const btn = e.currentTarget;
        btn.style.borderColor = 'rgba(212,175,55,0.8)';
        btn.style.background = primary
          ? 'linear-gradient(100deg, rgba(212,175,55,0.26) 0%, rgba(212,175,55,0.08) 100%)'
          : 'rgba(212,175,55,0.06)';
      }}
      onMouseLeave={(e) => {
        const btn = e.currentTarget;
        btn.style.borderColor = primary ? 'rgba(212,175,55,0.6)' : 'rgba(255,255,255,0.07)';
        btn.style.background = primary
          ? 'linear-gradient(100deg, rgba(212,175,55,0.18) 0%, rgba(212,175,55,0.04) 100%)'
          : 'rgba(255,255,255,0.02)';
      }}
    >
      <span style={{ color: '#D4AF37', opacity: primary ? 1 : 0.6 }}>{icon}</span>
      <span style={{
        color: primary ? '#F5E6C8' : 'rgba(255,255,255,0.55)',
        fontSize: 13,
        fontWeight: 700,
        letterSpacing: '4px',
      }}>
        {label}
      </span>
    </motion.button>
  );
}
