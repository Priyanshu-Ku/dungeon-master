'use client';

import React, { useEffect, useRef, useMemo } from 'react';
import { useGLTF, useAnimations, useFBX, Html } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface EnemyNPCProps {
  positionRef: React.MutableRefObject<THREE.Vector3>;
  rotation?: [number, number, number];
  scale?: [number, number, number];
  isConfronted?: boolean;
  isAttacking?: boolean;
  isMoving?: boolean;
  isTalking?: boolean;
  isRoaring?: boolean;
  health?: number;
  maxHealth?: number;
}

export function EnemyNPC({ 
  positionRef, 
  rotation = [0, 0, 0], 
  scale = [1, 1, 1], 
  isConfronted = false,
  isAttacking = false,
  isMoving = false,
  isTalking = false,
  isRoaring = false,
  health = 100,
  maxHealth = 100
}: EnemyNPCProps) {
  const group = useRef<THREE.Group>(null);
  const { scene } = useGLTF('/models/enemy.glb');

  // ... (load animations)
  const idleFbx = useFBX('/animations/idle.fbx');
  const attackFbx = useFBX('/animations/attack.fbx');
  const walkFbx = useFBX('/enemy_animation/enemywalk.fbx');
  const deathFbx = useFBX('/enemy_animation/enemydeath.fbx');
  const roarFbx = useFBX('/enemy_animation/roar.fbx');
  const talkFbx = useFBX('/enemy_animation/talk.fbx');

  const processedAnimations = useMemo(() => {
    const clips = [
      idleFbx.animations[0].clone(),
      walkFbx.animations[0].clone(),
      attackFbx.animations[0].clone(),
      deathFbx.animations[0].clone(),
      roarFbx.animations[0].clone(),
      talkFbx.animations[0].clone()
    ];
    clips[0].name = 'idle';
    clips[1].name = 'walk';
    clips[2].name = 'attack';
    clips[3].name = 'death';
    clips[4].name = 'roar';
    clips[5].name = 'talk';
    return clips;
  }, [idleFbx, walkFbx, attackFbx, deathFbx, roarFbx, talkFbx]);

  const { actions } = useAnimations(processedAnimations, group);

  useFrame(() => {
    if (group.current && positionRef.current) {
      group.current.position.copy(positionRef.current);
    }
  });

  useEffect(() => {
    // ...
    const idleAnim = actions['idle'];
    const walkAnim = actions['walk'];
    const attackAnim = actions['attack'];
    const deathAnim = actions['death'];
    const roarAnim = actions['roar'];
    const talkAnim = actions['talk'];

    if (health <= 0) {
      if (deathAnim) {
        Object.values(actions).forEach(a => a?.fadeOut(0.2));
        deathAnim.reset().fadeIn(0.2).play();
        deathAnim.clampWhenFinished = true;
        deathAnim.setLoop(THREE.LoopOnce, 1);
      }
      return;
    }

    if (isConfronted) {
      if (isRoaring && roarAnim) {
        Object.values(actions).forEach(a => a?.fadeOut(0.2));
        roarAnim.reset().fadeIn(0.2).play();
      } else if (isTalking && talkAnim) {
        Object.values(actions).forEach(a => a?.fadeOut(0.2));
        talkAnim.reset().fadeIn(0.2).play();
      } else if (isAttacking && attackAnim) {
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
      // Sleeping state: use end of death animation
      if (deathAnim) {
        deathAnim.reset().play();
        deathAnim.time = deathAnim.getClip().duration * 0.95;
        deathAnim.setEffectiveTimeScale(0); 
        deathAnim.clampWhenFinished = true;
      }
    }
  }, [actions, isConfronted, isAttacking, isMoving, isTalking, isRoaring, health]);

  return (
    <group ref={group} rotation={rotation} scale={scale} dispose={null}>
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
