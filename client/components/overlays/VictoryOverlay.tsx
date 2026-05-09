'use client';

import React from 'react';

// TODO: Phase 5 — implement full victory panel with XP award animation,
// loot reveal, and "Return to Dungeon" CTA button.

export function VictoryOverlay() {
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(0, 20, 10, 0.75)',
        color: '#80f0a0',
        fontFamily: 'monospace',
        textAlign: 'center',
      }}
    >
      <div>
        <p style={{ fontSize: '28px', margin: 0 }}>⚔️ VICTORY</p>
        <p style={{ fontSize: '12px', margin: '8px 0 0', opacity: 0.5 }}>
          [VictoryOverlay — Phase 5]
        </p>
      </div>
    </div>
  );
}
