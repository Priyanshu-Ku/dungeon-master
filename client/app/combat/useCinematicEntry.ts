

import { useEffect, useRef, useCallback } from 'react';
import type React from 'react';
import * as THREE from 'three';
import type { VignetteEffect } from 'postprocessing';
import { useCombatStore } from '@/store/combatStore';

// ─────────────────────────────────────────────────────────────────────────────
// useCinematicEntry.ts
//
// Owns the entire Phase 1 cinematic animation sequence (~1600ms).
// Activated whenever combatPhase transitions to 'entering'.
// All sub-animations run in parallel from a single RAF loop.
//
// Sub-animations:
//   [0–1400ms]  Camera tween     (easeInOutQuart)
//   [0–800ms]   Dimming quad     (easeOutCubic → opacity 0.62)
//   [0–1400ms]  Vignette         (easeInOutQuart → darkness 0.72)
//   [100–700ms] Boss rim sweep   (easeOutCubic)
//   [800ms]     Nameplate CSS fade-in (400ms ease-out, one-shot)
//
// NOTE: useCinematicEntry is the ONLY file that needs to know about timing.
// Phases 2–5 will not touch this file.
// ─────────────────────────────────────────────────────────────────────────────

// ── Easing ───────────────────────────────────────────────────────────────────

function easeInOutQuart(t: number): number {
  return t < 0.5 ? 8 * t * t * t * t : 1 - Math.pow(-2 * t + 2, 4) / 2;
}

function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

// ── Constants ─────────────────────────────────────────────────────────────────

const CAMERA_END_POS    = new THREE.Vector3(0, 2.4, 6.2);
const CAMERA_END_LOOKAT = new THREE.Vector3(0, 1.8, 0);
const CAMERA_DURATION   = 1400; // ms
const DIM_DURATION      = 800;  // ms
const DIM_TARGET_OPACITY = 0.62;
const VIGNETTE_DURATION = 1400; // ms
const VIGNETTE_START    = 0.3;
const VIGNETTE_DELTA    = 0.42; // 0.3 + 0.42 = 0.72
const RIM_START         = 100;  // ms
const RIM_END           = 700;  // ms
const RIM_DURATION      = RIM_END - RIM_START; // 600ms
const NAMEPLATE_TRIGGER = 800;  // ms

// ── Types ─────────────────────────────────────────────────────────────────────

export interface CinematicEntryOpts {
  cameraRef:     React.RefObject<THREE.PerspectiveCamera | null>;
  dimmingMeshRef: React.RefObject<THREE.Mesh | null>;
  bossRef:       React.RefObject<THREE.Mesh | null>;
  vignetteRef:   React.RefObject<VignetteEffect | null>;
  onComplete:    () => void;
  onCinematicStart?: () => void;
}

export interface CinematicEntryHandle {
  cancel: () => void;
}

// ── Hook ─────────────────────────────────────────────────────────────────────

export function useCinematicEntry(opts: CinematicEntryOpts): CinematicEntryHandle {
  const { cameraRef, dimmingMeshRef, bossRef, vignetteRef, onComplete, onCinematicStart } = opts;
  const { combatPhase } = useCombatStore();

  // Internal RAF state — never trigger re-renders
  const rafRef       = useRef<number | null>(null);
  const elapsedRef   = useRef<number>(0);
  const cancelledRef = useRef<boolean>(false);
  const prevTimeRef  = useRef<number>(0);

  // Captured start positions (snapshotted at animation start)
  const startPosRef    = useRef<THREE.Vector3>(new THREE.Vector3());
  const startLookAtRef = useRef<THREE.Vector3>(new THREE.Vector3());

  // One-shot flag — nameplate CSS transition fires exactly once
  const nameplateTriggeredRef = useRef<boolean>(false);

  // ── Snap helper (Escape cancel + end-state normalisation) ──────────────────
  const snapToEndState = useCallback(() => {
    const camera   = cameraRef.current;
    const dimMesh  = dimmingMeshRef.current;
    const boss     = bossRef.current;
    const vignette = vignetteRef.current;

    if (camera) {
      camera.position.copy(CAMERA_END_POS);
      camera.lookAt(CAMERA_END_LOOKAT);
    }

    if (dimMesh) {
      const mat = dimMesh.material as THREE.MeshBasicMaterial;
      mat.opacity = DIM_TARGET_OPACITY;
    }

    if (vignette) {
      vignette.darkness = VIGNETTE_START + VIGNETTE_DELTA;
    }

    if (boss) {
      const mat = boss.material as THREE.ShaderMaterial;
      mat.uniforms['u_rimActive'].value   = 0.0;
      mat.uniforms['u_rimProgress'].value = 0.0;
    }

    const nameplate = document.getElementById('boss-nameplate');
    if (nameplate) {
      nameplate.style.transition = 'none';
      nameplate.style.opacity    = '1';
    }
  }, [cameraRef, dimmingMeshRef, bossRef, vignetteRef]);

  // ── RAF loop ──────────────────────────────────────────────────────────────
  const startSequence = useCallback(() => {
    const camera   = cameraRef.current;
    const dimMesh  = dimmingMeshRef.current;
    const boss     = bossRef.current;
    const vignette = vignetteRef.current;

    if (!camera || !dimMesh || !boss) return;

    // Snapshot start state
    startPosRef.current.copy(camera.position);

    // Compute starting lookAt from camera's current forward direction
    const startDir = new THREE.Vector3();
    camera.getWorldDirection(startDir);
    startLookAtRef.current.copy(camera.position).addScaledVector(startDir, 10);

    // Reset internal state
    cancelledRef.current        = false;
    elapsedRef.current          = 0;
    nameplateTriggeredRef.current = false;
    prevTimeRef.current         = performance.now();

    // Fire onCinematicStart callback at t=0 (before first RAF frame)
    onCinematicStart?.();

    const tick = (now: number) => {
      if (cancelledRef.current) return;

      const delta = now - prevTimeRef.current;
      prevTimeRef.current = now;
      elapsedRef.current += delta;
      const elapsed = elapsedRef.current;

      // ── 1. Camera Tween ─────────────────────────────────────────────────
      if (camera) {
        const camProgress  = Math.min(elapsed / CAMERA_DURATION, 1);
        const camEased     = easeInOutQuart(camProgress);

        camera.position.lerpVectors(startPosRef.current, CAMERA_END_POS, camEased);

        const lerpedLookAt = new THREE.Vector3().lerpVectors(
          startLookAtRef.current,
          CAMERA_END_LOOKAT,
          camEased,
        );
        camera.lookAt(lerpedLookAt);
      }

      // ── 2. Dimming Quad ─────────────────────────────────────────────────
      if (dimMesh) {
        const mat = dimMesh.material as THREE.MeshBasicMaterial;

        if (elapsed < DIM_DURATION) {
          const dimProgress = Math.min(elapsed / DIM_DURATION, 1);
          mat.opacity = easeOutCubic(dimProgress) * DIM_TARGET_OPACITY;
        } else {
          mat.opacity = DIM_TARGET_OPACITY; // locked
        }

        // Track camera position and orientation each frame
        if (camera) {
          const dir  = new THREE.Vector3();
          camera.getWorldDirection(dir);
          const dist = 0.11;
          dimMesh.position.copy(camera.position).addScaledVector(dir, dist);
          dimMesh.quaternion.copy(camera.quaternion);

          const vFov = (camera.fov * Math.PI) / 180;
          const h    = 2 * Math.tan(vFov / 2) * dist;
          const w    = h * camera.aspect;
          dimMesh.scale.set(w, h, 1);
        }
      }

      // ── 3. Vignette ─────────────────────────────────────────────────────
      if (vignette) {
        const vigProgress = Math.min(elapsed / VIGNETTE_DURATION, 1);
        vignette.darkness = VIGNETTE_START + easeInOutQuart(vigProgress) * VIGNETTE_DELTA;
      }

      // ── 4. Boss Rim Sweep ───────────────────────────────────────────────
      if (boss) {
        const mat = boss.material as THREE.ShaderMaterial;
        if (elapsed >= RIM_START && elapsed <= RIM_END) {
          const localProgress = (elapsed - RIM_START) / RIM_DURATION;
          mat.uniforms['u_rimActive'].value   = 1.0;
          mat.uniforms['u_rimProgress'].value = easeOutCubic(Math.min(localProgress, 1));
        } else if (elapsed > RIM_END) {
          mat.uniforms['u_rimActive'].value   = 0.0;
          mat.uniforms['u_rimProgress'].value = 0.0;
        }
      }

      // ── 5. Boss Nameplate (one-shot CSS) ────────────────────────────────
      if (elapsed >= NAMEPLATE_TRIGGER && !nameplateTriggeredRef.current) {
        nameplateTriggeredRef.current = true;
        const nameplate = document.getElementById('boss-nameplate');
        if (nameplate) {
          nameplate.style.transition = 'opacity 400ms ease-out';
          nameplate.style.opacity    = '1';
        }
      }

      // ── 6. Completion ────────────────────────────────────────────────────
      if (elapsed >= CAMERA_DURATION) {
        // Ensure exact end state
        if (camera) {
          camera.position.copy(CAMERA_END_POS);
          camera.lookAt(CAMERA_END_LOOKAT);
        }
        onComplete();
        return; // RAF loop ends — do not schedule another frame
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
  }, [cameraRef, dimmingMeshRef, bossRef, vignetteRef, onComplete, onCinematicStart]);

  // ── Public cancel() ───────────────────────────────────────────────────────
  const cancel = useCallback(() => {
    cancelledRef.current = true;
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    snapToEndState();
    onComplete();
  }, [snapToEndState, onComplete]);

  // ── Phase watcher ─────────────────────────────────────────────────────────
  useEffect(() => {
    if (combatPhase !== 'entering') return;

    // Cancel any previous loop from a prior encounter
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }

    startSequence();

    // Cleanup: cancel loop if component unmounts mid-sequence
    return () => {
      cancelledRef.current = true;
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [combatPhase]); // Only re-run when phase changes — startSequence is stable

  // ── Expose cancel handle ──────────────────────────────────────────────────
  // Return is stable (cancel is memoised with useCallback)
  return { cancel };
}
