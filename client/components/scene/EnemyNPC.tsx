'use client';

import React, { useEffect, useRef } from 'react';
import { useGLTF, useAnimations } from '@react-three/drei';
import * as THREE from 'three';

interface EnemyNPCProps {
  position: [number, number, number];
  rotation?: [number, number, number];
  scale?: [number, number, number];
}

export function EnemyNPC({ position, rotation = [0, 0, 0], scale = [1, 1, 1] }: EnemyNPCProps) {
  const group = useRef<THREE.Group>(null);
  const { scene, animations } = useGLTF('/models/enemy.glb');
  const { actions } = useAnimations(animations, group);

  useEffect(() => {
    // Play 'enemydeath' animation to make it look like they are sleeping/lying down
    if (actions['enemydeath']) {
      const action = actions['enemydeath'];
      action.reset().play();
      // Fast forward to the end of the animation where they are on the ground
      action.paused = false;
      action.time = action.getClip().duration;
      action.paused = true;
      action.clampWhenFinished = true;
    }
  }, [actions]);

  return (
    <group ref={group} position={position} rotation={rotation} scale={scale} dispose={null}>
      <primitive object={scene} />
    </group>
  );
}

useGLTF.preload('/models/enemy.glb');
