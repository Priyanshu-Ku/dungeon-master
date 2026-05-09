'use client';

import { useEffect, useRef, useCallback } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

/**
 * useBossAnimations
 * 
 * Manages boss GLTF animations with smooth cross-fading.
 */
export function useBossAnimations(mixer: THREE.AnimationMixer | null, animations: THREE.AnimationClip[]) {
  const actions = useRef<Record<string, THREE.AnimationAction>>({});
  const currentAction = useRef<THREE.AnimationAction | null>(null);

  useEffect(() => {
    if (!mixer || animations.length === 0) return;

    // Initialize actions
    animations.forEach(clip => {
      actions.current[clip.name.toLowerCase()] = mixer.clipAction(clip);
    });

    return () => {
      mixer.stopAllAction();
    };
  }, [mixer, animations]);

  const fadeTo = useCallback((name: string, duration: number = 0.25, loop: boolean = true) => {
    const next = actions.current[name.toLowerCase()];
    if (!next || next === currentAction.current) return;

    if (currentAction.current) {
      next.reset().setEffectiveTimeScale(1).setEffectiveWeight(1).fadeIn(duration).play();
      currentAction.current.fadeOut(duration);
    } else {
      next.reset().fadeIn(duration).play();
    }

    next.setLoop(loop ? THREE.LoopRepeat : THREE.LoopOnce, Infinity);
    if (!loop) next.clampWhenFinished = true;

    currentAction.current = next;
  }, []);

  useFrame((state, delta) => {
    mixer?.update(delta);
  });

  return {
    playIdle:        () => fadeTo('idle'),
    playTaunt:       () => fadeTo('taunt', 0.25, false),
    playHitReact:    () => fadeTo('hit_react', 0.1, false),
    playPhaseChange: () => fadeTo('phase_change', 0.4, false),
    playDeath:       (onComplete?: () => void) => {
      fadeTo('death', 0.5, false);
      if (mixer && onComplete) {
        const handleFinished = (e: any) => {
          if (e.action.getClip().name.toLowerCase() === 'death') {
            onComplete();
            mixer.removeEventListener('finished', handleFinished);
          }
        };
        mixer.addEventListener('finished', handleFinished);
      }
    }
  };
}
