'use client';

import React, { useEffect, useRef } from 'react';
import { useGLTF, useAnimations, Html } from '@react-three/drei';
import * as THREE from 'three';

interface EnemyNPCProps {
  position: [number, number, number];
  rotation?: [number, number, number];
  scale?: [number, number, number];
  isConfronted?: boolean;
  isAttacking?: boolean;
  isMoving?: boolean;
  health?: number;
  maxHealth?: number;
}

export function EnemyNPC({ 
  position, 
  rotation = [0, 0, 0], 
  scale = [1, 1, 1], 
  isConfronted = false,
  isAttacking = false,
  isMoving = false,
  health = 100,
  maxHealth = 100
}: EnemyNPCProps) {
  const group = useRef<THREE.Group>(null);
  const { scene, animations } = useGLTF('/models/enemy.glb');
  const { actions } = useAnimations(animations, group);

  useEffect(() => {
    if (isConfronted) {
      const idleAnim = actions['enemyidle'] || actions['Idle'] || actions['idle'];
      const walkAnim = actions['enemywalk'] || actions['Walk'] || actions['walk'];
      const attackAnim = actions['enemyattack'] || actions['Attack'] || actions['attack'];

      if (isAttacking && attackAnim) {
        Object.values(actions).forEach(a => a?.fadeOut(0.2));
        attackAnim.reset().fadeIn(0.2).play();
      } else if (isMoving && walkAnim) {
        Object.values(actions).forEach(a => a?.fadeOut(0.2));
        walkAnim.reset().fadeIn(0.2).play();
      } else if (idleAnim) {
        Object.values(actions).forEach(a => a?.fadeOut(0.2));
        idleAnim.reset().fadeIn(0.2).play();
      }
    } else {
      const deathAnim = actions['enemydeath'] || actions['Death'] || actions['death'];
      if (deathAnim) {
        deathAnim.reset().play();
        deathAnim.time = deathAnim.getClip().duration * 0.95;
        deathAnim.setEffectiveTimeScale(0); 
        deathAnim.clampWhenFinished = true;
      }
    }
  }, [actions, isConfronted, isAttacking, isMoving]);

  return (
    <group ref={group} position={position} rotation={rotation} scale={scale} dispose={null}>
      {/* Health Bar */}
      {isConfronted && health > 0 && (
        <Html position={[0, 2.5, 0]} center>
          <div style={{ width: '60px', height: '6px', background: '#333', border: '1px solid #000' }}>
            <div style={{ 
              width: `${(health / maxHealth) * 100}%`, 
              height: '100%', 
              background: '#ff0000',
              transition: 'width 0.3s ease-out'
            }} />
          </div>
          <div style={{ color: 'white', fontSize: '10px', textAlign: 'center', marginTop: '2px', fontWeight: 'bold' }}>
            ENEMY
          </div>
        </Html>
      )}

      {/* Stone Pillow only visible when sleeping */}
      {!isConfronted && (
        <mesh position={[0, 0.1, 1.65]} scale={[0.5, 0.2, 0.5]}>
          <cylinderGeometry args={[0.5, 0.5, 0.5, 8]} />
          <meshStandardMaterial color="#444" roughness={0.9} />
        </mesh>
      )}

      {/* Model pose */}
      <primitive 
        object={scene} 
        rotation={isConfronted ? [0, 0, 0] : [Math.PI / 2, 0, 0.15]} 
        position={[0, 0, 0]} 
      />
    </group>
  );
}

useGLTF.preload('/models/enemy.glb');
