'use client';

import React from 'react';

// TODO: Phase 4 — wire boss AnimationMixer clips ('hit', 'taunt'),
// drive u_hitFlash / u_hitIntensity shader uniforms,
// and display hit-quality feedback text.

export function BossReaction() {
  return (
    <div
      style={{
        position: 'absolute',
        top: '20%',
        left: '50%',
        transform: 'translateX(-50%)',
        background: 'rgba(20, 4, 8, 0.85)',
        border: '1px solid rgba(220, 40, 60, 0.4)',
        borderRadius: '8px',
        padding: '16px 28px',
        color: '#f08090',
        fontFamily: 'monospace',
        textAlign: 'center',
      }}
    >
      <p style={{ margin: 0, opacity: 0.6, fontSize: '12px' }}>
        [BossReaction — Phase 4]
      </p>
      <p style={{ margin: '8px 0 0', fontSize: '14px' }}>
        Boss is reacting…
      </p>
    </div>
  );
}
