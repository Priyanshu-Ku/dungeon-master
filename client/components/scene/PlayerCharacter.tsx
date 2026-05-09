'use client';

import React, { useRef, useEffect } from 'react';
import { useGLTF, useAnimations } from '@react-three/drei';
import * as THREE from 'three';

interface PlayerCharacterProps {
  position: [number, number, number];
  rotation: [number, number, number];
  moving: boolean;
}

export function PlayerCharacter({ position, rotation, moving }: PlayerCharacterProps) {
  const group = useRef<THREE.Group>(null);
  const { scene, animations } = useGLTF('/models/player.glb');
  const { actions } = useAnimations(animations, group);

  useEffect(() => {
    console.log('Available Animations:', Object.keys(actions));
  }, [actions]);

  useEffect(() => {
    // Determine the best clips for each state
    const runClip = Object.keys(actions).find(name => 
      ['Run', 'running', 'walk', 'walking', 'locomotion'].includes(name.toLowerCase())
    );
    const idleClip = Object.keys(actions).find(name => 
      ['Idle', 'idle_anim', 'wait', 'standing'].includes(name.toLowerCase())
    );

    if (moving && runClip) {
      actions[runClip]?.reset().fadeIn(0.2).play();
      if (idleClip) actions[idleClip]?.fadeOut(0.2);
    } else if (idleClip) {
      actions[idleClip]?.reset().fadeIn(0.2).play();
      if (runClip) actions[runClip]?.fadeOut(0.2);
    }
    
    return () => {
      if (runClip) actions[runClip]?.fadeOut(0.2);
      if (idleClip) actions[idleClip]?.fadeOut(0.2);
    };
  }, [moving, actions]);

  return (
    <group ref={group} position={position} rotation={rotation} scale={0.8}>
      <primitive object={scene} />
      {/* Dynamic light following player for extra visibility */}
      <pointLight position={[0, 2, 0]} intensity={1} color="#FFF" distance={5} />
    </group>
  );
}

useGLTF.preload('/models/player.glb');
