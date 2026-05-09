'use client';

import React from 'react';

// TODO: Phase 5 — display VictoryOverlay or DefeatOverlay based on
// combatResult from useCombatStore, award XP, and trigger scene teardown.

export function ResolutionOverlay() {
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(0, 0, 0, 0.6)',
        color: '#e0d4f8',
        fontFamily: 'monospace',
        textAlign: 'center',
      }}
    >
      <div>
        <p style={{ margin: 0, opacity: 0.6, fontSize: '12px' }}>
          [ResolutionOverlay — Phase 5]
        </p>
        <p style={{ margin: '8px 0 0', fontSize: '18px' }}>
          Combat resolved.
        </p>
      </div>
    </div>
  );
}
