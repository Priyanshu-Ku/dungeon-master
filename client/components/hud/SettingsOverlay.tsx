'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useSettingsStore, TextSpeed, GraphicsQuality } from '@/store/settingsStore';
import { X, Volume2, Monitor, Keyboard, Gamepad, RotateCcw } from 'lucide-react';

interface SettingsOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

type Tab = 'GAMEPLAY' | 'VIDEO' | 'INPUT';

export function SettingsOverlay({ isOpen, onClose }: SettingsOverlayProps) {
  const [activeTab, setActiveTab] = useState<Tab>('GAMEPLAY');
  const [remappingAction, setRemappingAction] = useState<string | null>(null);

  const { 
    textSpeed, screenShake, masterVolume, keybindings, graphicsQuality,
    updateSetting, updateKeybinding, resetSettings 
  } = useSettingsStore();

  useEffect(() => {
    if (!remappingAction) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      e.preventDefault();
      updateKeybinding(remappingAction, e.code);
      setRemappingAction(null);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [remappingAction, updateKeybinding]);

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
          zIndex: 4000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '40px',
          pointerEvents: 'auto'
        }}
      >
        <div style={{
          width: '100%',
          maxWidth: '800px',
          height: '100%',
          maxHeight: '600px',
          background: 'rgba(12, 10, 24, 0.8)',
          border: '1px solid rgba(124, 58, 237, 0.2)',
          borderRadius: '16px',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden'
        }}>
          {/* Header */}
          <div style={{
            padding: '24px',
            borderBottom: '1px solid rgba(255,255,255,0.05)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <h2 style={{ fontFamily: 'var(--font-cinzel)', fontSize: '20px', letterSpacing: '0.2em', color: '#FFF', margin: 0 }}>
              CORE PROTOCOLS
            </h2>
            <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#4B456A', cursor: 'pointer' }}>
              <X size={24} />
            </button>
          </div>

          {/* Navigation */}
          <div style={{ display: 'flex', background: 'rgba(0,0,0,0.2)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
            <TabButton active={activeTab === 'GAMEPLAY'} onClick={() => setActiveTab('GAMEPLAY')} label="GAMEPLAY" icon={<Gamepad size={16} />} />
            <TabButton active={activeTab === 'VIDEO'} onClick={() => setActiveTab('VIDEO')} label="VIDEO" icon={<Monitor size={16} />} />
            <TabButton active={activeTab === 'INPUT'} onClick={() => setActiveTab('INPUT')} label="INPUT" icon={<Keyboard size={16} />} />
          </div>

          {/* Content */}
          <div style={{ flex: 1, padding: '32px', overflowY: 'auto' }}>
            <AnimatePresence mode="wait">
              {activeTab === 'GAMEPLAY' && (
                <motion.div key="gameplay" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}>
                  <SettingRow label="TEXT SPEED">
                    <div style={{ display: 'flex', gap: '8px' }}>
                      {(['slow', 'normal', 'fast', 'instant'] as TextSpeed[]).map(s => (
                        <button
                          key={s}
                          onClick={() => updateSetting('textSpeed', s)}
                          style={{
                            padding: '6px 12px',
                            background: textSpeed === s ? '#7C3AED' : 'rgba(255,255,255,0.05)',
                            border: 'none',
                            borderRadius: '4px',
                            color: '#FFF',
                            fontSize: '10px',
                            fontFamily: 'var(--font-mono)',
                            cursor: 'pointer'
                          }}
                        >
                          {s.toUpperCase()}
                        </button>
                      ))}
                    </div>
                  </SettingRow>
                  
                  <SettingRow label="MASTER VOLUME">
                    <input 
                      type="range" min="0" max="1" step="0.1" 
                      value={masterVolume} 
                      onChange={(e) => updateSetting('masterVolume', parseFloat(e.target.value))}
                      style={{ flex: 1, accentColor: '#7C3AED' }} 
                    />
                  </SettingRow>
                </motion.div>
              )}

              {activeTab === 'VIDEO' && (
                <motion.div key="video" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}>
                  <SettingRow label="GRAPHICS QUALITY">
                    <div style={{ display: 'flex', gap: '8px' }}>
                      {(['low', 'medium', 'high'] as GraphicsQuality[]).map(q => (
                        <button
                          key={q}
                          onClick={() => updateSetting('graphicsQuality', q)}
                          style={{
                            padding: '6px 12px',
                            background: graphicsQuality === q ? '#7C3AED' : 'rgba(255,255,255,0.05)',
                            border: 'none',
                            borderRadius: '4px',
                            color: '#FFF',
                            fontSize: '10px',
                            fontFamily: 'var(--font-mono)',
                            cursor: 'pointer'
                          }}
                        >
                          {q.toUpperCase()}
                        </button>
                      ))}
                    </div>
                  </SettingRow>

                  <SettingRow label="SCREEN SHAKE">
                    <ToggleButton active={screenShake} onClick={() => updateSetting('screenShake', !screenShake)} />
                  </SettingRow>
                </motion.div>
              )}

              {activeTab === 'INPUT' && (
                <motion.div key="input" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}>
                  <div style={{ display: 'grid', gap: '12px' }}>
                    {Object.entries(keybindings).map(([action, key]) => (
                      <div key={action} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', background: 'rgba(255,255,255,0.03)', borderRadius: '4px' }}>
                        <span style={{ fontSize: '12px', color: '#94A3B8', fontFamily: 'var(--font-mono)' }}>{action.replace('_', ' ')}</span>
                        <button
                          onClick={() => setRemappingAction(action)}
                          style={{
                            minWidth: '100px',
                            padding: '6px 12px',
                            background: remappingAction === action ? '#EF4444' : 'rgba(124, 58, 237, 0.1)',
                            border: `1px solid ${remappingAction === action ? '#EF4444' : '#7C3AED44'}`,
                            borderRadius: '4px',
                            color: '#FFF',
                            fontSize: '11px',
                            fontFamily: 'var(--font-mono)',
                            cursor: 'pointer'
                          }}
                        >
                          {remappingAction === action ? 'PRESS ANY KEY' : key.replace('Key', '')}
                        </button>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Footer */}
          <div style={{ padding: '16px 24px', borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'flex-end' }}>
            <button
              onClick={resetSettings}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                background: 'none',
                border: 'none',
                color: '#4B456A',
                fontSize: '11px',
                fontFamily: 'var(--font-mono)',
                cursor: 'pointer'
              }}
            >
              <RotateCcw size={14} />
              <span>RESET TO DEFAULTS</span>
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

function TabButton({ active, label, icon, onClick }: { active: boolean, label: string, icon: React.ReactNode, onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{
        flex: 1,
        padding: '16px',
        background: active ? 'rgba(124, 58, 237, 0.1)' : 'transparent',
        border: 'none',
        borderBottom: `2px solid ${active ? '#7C3AED' : 'transparent'}`,
        color: active ? '#FFF' : '#4B456A',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        fontSize: '11px',
        fontFamily: 'var(--font-mono)',
        fontWeight: 700,
        cursor: 'pointer',
        transition: 'all 0.2s'
      }}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}

function SettingRow({ label, children }: { label: string, children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
      <span style={{ fontSize: '12px', color: '#94A3B8', fontFamily: 'var(--font-mono)', letterSpacing: '0.1em' }}>{label}</span>
      {children}
    </div>
  );
}

function ToggleButton({ active, onClick }: { active: boolean, onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{
        width: '44px',
        height: '24px',
        borderRadius: '12px',
        background: active ? '#7C3AED' : '#2D2850',
        border: 'none',
        position: 'relative',
        cursor: 'pointer',
        transition: 'background 0.3s'
      }}
    >
      <motion.div
        animate={{ x: active ? 22 : 2 }}
        style={{
          position: 'absolute',
          top: '2px',
          left: '0',
          width: '20px',
          height: '20px',
          borderRadius: '50%',
          background: '#FFF'
        }}
      />
    </button>
  );
}
