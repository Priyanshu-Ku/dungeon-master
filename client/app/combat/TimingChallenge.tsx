'use client';

import React from 'react';

// TODO: Phase 3 — implement the timing bar, Space-key listener via
// 'combat:spacePressed' custom event, and perfect/good/miss detection.

export function TimingChallenge() {
  return (
    <div
      style={{
        position: 'absolute',
        bottom: '18%',
        left: '50%',
        transform: 'translateX(-50%)',
        background: 'rgba(6, 12, 24, 0.88)',
        border: '1px solid rgba(60, 160, 240, 0.4)',
        borderRadius: '8px',
        padding: '20px 40px',
        color: '#90c8f4',
        fontFamily: 'monospace',
        textAlign: 'center',
        minWidth: '400px',
      }}
    >
      <p style={{ margin: 0, opacity: 0.6, fontSize: '12px' }}>
        [TimingChallenge — Phase 3]
      </p>
      <p style={{ margin: '8px 0 0', fontSize: '14px' }}>
        Press SPACE at the right moment!
      </p>
    </div>
  );
}
