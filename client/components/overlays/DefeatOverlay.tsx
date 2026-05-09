'use client';

import React from 'react';

// TODO: Phase 5 — implement full defeat panel with death animation hook,
// HP drain display, and "Try Again" / "Retreat" CTA buttons.

export function DefeatOverlay() {
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(20, 0, 0, 0.78)',
        color: '#f08080',
        fontFamily: 'monospace',
        textAlign: 'center',
      }}
    >
      <div>
        <p style={{ fontSize: '28px', margin: 0 }}>💀 DEFEAT</p>
        <p style={{ fontSize: '12px', margin: '8px 0 0', opacity: 0.5 }}>
          [DefeatOverlay — Phase 5]
        </p>
      </div>
    </div>
  );
}
