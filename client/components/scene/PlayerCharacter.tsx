'use client';

import React, { useRef, useEffect, useMemo } from 'react';
import { useGLTF, useAnimations, useFBX } from '@react-three/drei';
import * as THREE from 'three';

interface PlayerCharacterProps {
  position: [number, number, number];
  rotation: [number, number, number];
  moving: boolean;
}

export function PlayerCharacter({ position, rotation, moving }: PlayerCharacterProps) {
  const group = useRef<THREE.Group>(null);
  
  // Load the GLB model
  const { scene } = useGLTF('/models/player.glb');
  
  // Load external FBX animations
  const idleFbx = useFBX('/animations/idle.fbx');
  const walkFbx = useFBX('/animations/walk.fbx');
  const attackFbx = useFBX('/animations/attack.fbx');
  const deathFbx = useFBX('/animations/death.fbx');
  const victoryFbx = useFBX('/animations/victory.fbx');
  
  // Process and name animations
  const processedAnimations = useMemo(() => {
    const clips = [
      idleFbx.animations[0].clone(),
      walkFbx.animations[0].clone(),
      attackFbx.animations[0].clone(),
      deathFbx.animations[0].clone(),
      victoryFbx.animations[0].clone()
    ];
    clips[0].name = 'idle';
    clips[1].name = 'walk';
    clips[2].name = 'attack';
    clips[3].name = 'death';
    clips[4].name = 'victory';
    return clips;
  }, [idleFbx, walkFbx, attackFbx, deathFbx, victoryFbx]);

  const { actions } = useAnimations(processedAnimations, group);

  useEffect(() => {
    const idleAction = actions['idle'];
    const walkAction = actions['walk'];

    if (idleAction && walkAction) {
      if (moving) {
        walkAction.reset().fadeIn(0.2).play();
        idleAction.fadeOut(0.2);
      } else {
        idleAction.reset().fadeIn(0.2).play();
        walkAction.fadeOut(0.2);
      }
    }
  }, [moving, actions]);

  return (
    <group ref={group} position={position} rotation={rotation} scale={0.8} dispose={null}>
      <group rotation={[-Math.PI / 2, 0, 0]}>
        <primitive object={scene} position={[0, -0.2, 0]} />
      </group>
      {/* Dynamic light following player for extra visibility */}
      <pointLight position={[0, 2, 0]} intensity={1} color="#FFF" distance={5} />
    </group>
  );
}

useGLTF.preload('/models/player.glb');
