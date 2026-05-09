'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useLeetCodeStore } from '@/store/leetcodeStore';
import { Terminal, RefreshCw, Unlink, CheckCircle, AlertCircle } from 'lucide-react';

export function AccountLinker() {
  const { 
    username, profile, syncStatus, linkAccount, unlinkAccount, syncProfile, error 
  } = useLeetCodeStore();
  
  const [inputValue, setInputValue] = useState('');

  const handleLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue) return;
    try {
      await linkAccount(inputValue);
      setInputValue('');
    } catch (err) {
      // Error is handled in store
    }
  };

  return (
    <div style={{
      width: '100%',
      background: 'rgba(12, 10, 24, 0.6)',
      backdropFilter: 'blur(12px)',
      border: '1px solid rgba(124, 58, 237, 0.2)',
      borderRadius: '8px',
      padding: '20px',
      fontFamily: 'var(--font-mono)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
        <Terminal size={18} color="#7C3AED" />
        <span style={{ fontSize: '12px', fontWeight: 700, color: '#E2D9F3', letterSpacing: '0.1em' }}>
          LEETCODE RESONANCE
        </span>
      </div>

      <AnimatePresence mode="wait">
        {!username ? (
          <motion.form
            key="link-form"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            onSubmit={handleLink}
            style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}
          >
            <p style={{ fontSize: '11px', color: '#9D93C0', lineHeight: 1.5 }}>
              Link your LeetCode account to channel your algorithmic performance into the depths.
            </p>
            <div style={{ display: 'flex', gap: '8px' }}>
              <input
                type="text"
                placeholder="USERNAME"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                disabled={syncStatus === 'LOADING'}
                style={{
                  flex: 1,
                  background: 'rgba(0,0,0,0.3)',
                  border: '1px solid rgba(124, 58, 237, 0.3)',
                  borderRadius: '4px',
                  padding: '8px 12px',
                  color: '#FFF',
                  fontSize: '12px',
                  outline: 'none'
                }}
              />
              <button
                type="submit"
                disabled={syncStatus === 'LOADING'}
                style={{
                  background: '#7C3AED',
                  color: '#FFF',
                  border: 'none',
                  borderRadius: '4px',
                  padding: '0 16px',
                  fontSize: '11px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  opacity: syncStatus === 'LOADING' ? 0.5 : 1
                }}
              >
                {syncStatus === 'LOADING' ? '...' : 'LINK'}
              </button>
            </div>
            {error && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#EF4444', fontSize: '10px' }}>
                <AlertCircle size={12} />
                <span>{error}</span>
              </div>
            )}
          </motion.form>
        ) : (
          <motion.div
            key="profile-view"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle size={14} color="#4ADE80" />
                <span style={{ fontSize: '14px', color: '#4ADE80', fontWeight: 700 }}>{username}</span>
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button 
                  onClick={syncProfile}
                  disabled={syncStatus === 'LOADING'}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#7C3AED' }}
                >
                  <RefreshCw size={14} className={syncStatus === 'LOADING' ? 'animate-spin' : ''} />
                </button>
                <button 
                  onClick={unlinkAccount}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#4B456A' }}
                >
                  <Unlink size={14} />
                </button>
              </div>
            </div>

            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: '1fr 1fr', 
              gap: '8px',
              padding: '12px',
              background: 'rgba(0,0,0,0.2)',
              borderRadius: '4px',
              border: '1px solid rgba(255,255,255,0.05)'
            }}>
              <StatItem label="SOLVED" value={profile?.totalSolved || 0} />
              <StatItem label="STREAK" value={profile?.streak || 0} />
              <StatItem label="RANK" value={`#${profile?.ranking?.toLocaleString() || '---'}`} />
              <StatItem label="HARD" value={profile?.hardSolved || 0} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function StatItem({ label, value }: { label: string, value: string | number }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <span style={{ fontSize: '8px', color: '#4B456A', letterSpacing: '0.1em' }}>{label}</span>
      <span style={{ fontSize: '12px', color: '#E2D9F3', fontWeight: 600 }}>{value}</span>
    </div>
  );
}
