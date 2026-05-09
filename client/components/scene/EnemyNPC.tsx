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
    const deathAnim = actions['enemydeath'] || actions['Death'] || actions['death'];
    if (deathAnim) {
      deathAnim.reset().play();
      deathAnim.time = deathAnim.getClip().duration * 0.95;
      deathAnim.setEffectiveTimeScale(0); // Stop at this frame
      deathAnim.clampWhenFinished = true;
    }
  }, [actions]);

  return (
    <group ref={group} position={position} rotation={rotation} scale={scale} dispose={null}>
      {/* Small stone under the head (Pillow Stone) */}
      <mesh position={[0, 0.1, 1.65]} scale={[0.5, 0.2, 0.5]}>
        <cylinderGeometry args={[0.5, 0.5, 0.5, 8]} />
        <meshStandardMaterial color="#444" roughness={0.9} />
      </mesh>

      {/* Face down pose - Body on ground */}
      <primitive 
        object={scene} 
        rotation={[Math.PI / 2, 0, 0.15]} // Slight Y tilt for natural look
        position={[0, 0, 0]} 
      />
    </group>
  );
}

useGLTF.preload('/models/enemy.glb');
