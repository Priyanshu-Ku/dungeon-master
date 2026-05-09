import type React from 'react';
import * as THREE from 'three';
import { useCombatStore } from '@/store/combatStore';

// ─────────────────────────────────────────────────────────────────────────────
// lib/combat-utils.ts
// Cleanup helpers — called on CombatScene unmount and phase resets.
// ─────────────────────────────────────────────────────────────────────────────

/** Names of all shader uniforms that must be zeroed on cleanup. */
const SHADER_UNIFORMS_TO_RESET = [
  'u_time',
  'u_hit',
  'u_miss',
  'u_hitFlash',
  'u_hitIntensity',
  'u_dissolveAmount',
] as const;

/**
 * Cancels any running RAF loop, resets shader uniforms, and resets the
 * combat store to its initial state.
 *
 * @param rafRef   - React ref holding the current requestAnimationFrame id.
 * @param materials - Optional array of THREE.ShaderMaterial instances whose
 *                    uniforms should be zeroed.
 */
export function cleanupCombat(
  rafRef: React.MutableRefObject<number | null>,
  materials?: THREE.ShaderMaterial[]
): void {
  // 1. Cancel the RAF loop
  if (rafRef.current !== null) {
    cancelAnimationFrame(rafRef.current);
    rafRef.current = null;
  }

  // 2. Reset shader uniforms
  if (materials && materials.length > 0) {
    for (const mat of materials) {
      for (const uniformName of SHADER_UNIFORMS_TO_RESET) {
        if (mat.uniforms[uniformName] !== undefined) {
          mat.uniforms[uniformName].value = 0.0;
        }
      }
      mat.needsUpdate = true;
    }
  }

  // 3. Reset combat store
  useCombatStore.getState().resetCombat();

  console.log('Combat cleaned up');
}
