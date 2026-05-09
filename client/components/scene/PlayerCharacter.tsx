'use client';

import React, { useRef, useEffect, useMemo } from 'react';
import { useGLTF, useAnimations, useFBX, Html } from '@react-three/drei';
import * as THREE from 'three';

interface PlayerCharacterProps {
  position: [number, number, number];
  rotation: [number, number, number];
  moving: boolean;
  attacking?: boolean;
  health?: number;
  maxHealth?: number;
}

export function PlayerCharacter({ 
  position, 
  rotation, 
  moving, 
  attacking = false,
  health = 100,
  maxHealth = 100
}: PlayerCharacterProps) {
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
    const attackAction = actions['attack'];

    if (attacking && attackAction) {
      Object.values(actions).forEach(a => a?.fadeOut(0.1));
      attackAction.reset().fadeIn(0.1).play();
    } else if (moving && walkAction) {
      walkAction.reset().fadeIn(0.2).play();
      idleAction?.fadeOut(0.2);
      attackAction?.fadeOut(0.2);
    } else if (idleAction) {
      idleAction.reset().fadeIn(0.2).play();
      walkAction?.fadeOut(0.2);
      attackAction?.fadeOut(0.2);
    }
  }, [moving, attacking, actions]);

  return (
    <group ref={group} position={position} rotation={rotation} scale={0.8} dispose={null}>
      {/* Health Bar */}
      <Html position={[0, 2.5, 0]} center>
        <div style={{ width: '60px', height: '6px', background: '#333', border: '1px solid #000' }}>
          <div style={{ 
            width: `${(health / maxHealth) * 100}%`, 
            height: '100%', 
            background: '#00ff00',
            transition: 'width 0.3s ease-out'
          }} />
        </div>
        <div style={{ color: 'white', fontSize: '10px', textAlign: 'center', marginTop: '2px', fontWeight: 'bold' }}>
          PLAYER
        </div>
      </Html>

      <group rotation={[-Math.PI / 2, 0, 0]}>
        <primitive object={scene} position={[0, -0.2, 0]} />
      </group>
      {/* Dynamic light following player for extra visibility */}
      <pointLight position={[0, 2, 0]} intensity={1} color="#FFF" distance={5} />
    </group>
  );
}

useGLTF.preload('/models/player.glb');
