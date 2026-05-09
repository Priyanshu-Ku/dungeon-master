'use client';

import React, { useRef, useEffect, useState, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Stars, Cloud, Sparkles, Float } from '@react-three/drei';
import { useDungeonStore } from '@/store/dungeonStore';
import { useCombatStore } from '@/store/combatStore';
import * as THREE from 'three';
import { PlayerCharacter } from './PlayerCharacter';

// --- GEOMETRY UTILS ---
function createFloorGeo() {
  const geo = new THREE.PlaneGeometry(50, 50);
  geo.rotateX(-Math.PI / 2);
  return geo;
}

function createPillarGeo() {
  return new THREE.CylinderGeometry(0.3, 0.4, 6, 8);
}

export function DungeonExplorer() {
  const { camera, gl } = useThree();
  const { currentRoomId, getConnectedRooms, initiateTransition } = useDungeonStore();
  const { setCombatPhase } = useCombatStore();

  const [isLocked, setIsLocked] = useState(false);
  const [isMoving, setIsMoving] = useState(false);
  
  // Camera Orbit State (Smooth Interpolation)
  const targetCameraAngle = useRef({ yaw: 0, pitch: 0.3 });
  const currentCameraAngle = useRef({ yaw: 0, pitch: 0.3 });
  const playerPos = useRef(new THREE.Vector3(0, 0, 5));
  const playerRot = useRef(new THREE.Euler(0, 0, 0));
  const velocity = useRef(new THREE.Vector3());
  const moveState = useRef({ forward: false, backward: false, left: false, right: false, sprint: false });

  // Mouse handling
  useEffect(() => {
    const handleLockChange = () => setIsLocked(document.pointerLockElement === gl.domElement);
    const handleCanvasClick = () => {
      if (document.pointerLockElement !== gl.domElement) {
        gl.domElement.requestPointerLock();
      }
    };
    
    // Try to lock immediately on mount (may be blocked by browser until first click)
    gl.domElement.requestPointerLock();
    
    const handleMouseMove = (e: MouseEvent) => {
      if (!document.pointerLockElement) return;
      // Sensitivity factor - reverted to normal level
      const sensitivity = 0.002;
      targetCameraAngle.current.yaw -= e.movementX * sensitivity;
      targetCameraAngle.current.pitch -= e.movementY * sensitivity;
      
      // Expanded pitch range for true 360 orbit
      targetCameraAngle.current.pitch = Math.max(-Math.PI / 2.1, Math.min(Math.PI / 2.1, targetCameraAngle.current.pitch));
    };

    document.addEventListener('pointerlockchange', handleLockChange);
    document.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('click', handleCanvasClick);
    
    return () => {
      document.removeEventListener('pointerlockchange', handleLockChange);
      document.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('click', handleCanvasClick);
    };
  }, [gl]);

  // Keyboard listeners
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.code) {
        case 'KeyW': moveState.current.forward = true; break;
        case 'KeyS': moveState.current.backward = true; break;
        case 'KeyA': moveState.current.left = true; break;
        case 'KeyD': moveState.current.right = true; break;
        case 'ShiftLeft': moveState.current.sprint = true; break;
        case 'KeyE': handleInteraction(); break;
      }
      setIsMoving(Object.values(moveState.current).some(v => v));
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      switch (e.code) {
        case 'KeyW': moveState.current.forward = false; break;
        case 'KeyS': moveState.current.backward = false; break;
        case 'KeyA': moveState.current.left = false; break;
        case 'KeyD': moveState.current.right = false; break;
        case 'ShiftLeft': moveState.current.sprint = false; break;
      }
      setIsMoving(Object.values(moveState.current).some(v => v));
    };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  const handleInteraction = () => {
    const connected = getConnectedRooms(currentRoomId || '');
    const nearest = connected[0];
    if (nearest) {
      if (['COMBAT', 'ELITE', 'BOSS_FINAL'].includes(nearest.type)) {
        setCombatPhase('BOSS_CINEMATIC');
      } else {
        initiateTransition(nearest.id);
      }
    }
  };

  useFrame((state, delta) => {
    // Movement logic should work even if not locked for better accessibility
    const speed = moveState.current.sprint ? 12 : 6;
    const damping = 10;

    // Movement calculation
    velocity.current.x -= velocity.current.x * damping * delta;
    velocity.current.z -= velocity.current.z * damping * delta;

    const inputX = Number(moveState.current.right) - Number(moveState.current.left);
    const inputZ = Number(moveState.current.forward) - Number(moveState.current.backward);

    if (inputX !== 0 || inputZ !== 0) {
      // Get forward vector relative to TARGET camera yaw for responsive input
      const forward = new THREE.Vector3(0, 0, -1);
      forward.applyEuler(new THREE.Euler(0, targetCameraAngle.current.yaw, 0));
      
      const side = new THREE.Vector3().crossVectors(new THREE.Vector3(0, 1, 0), forward).normalize();

      const moveDir = new THREE.Vector3()
        .addScaledVector(forward, inputZ)
        .addScaledVector(side, inputX)
        .normalize();

      velocity.current.addScaledVector(moveDir, speed * 20 * delta);

      // Smoothly rotate player to face movement direction
      const targetAngle = Math.atan2(moveDir.x, moveDir.z);
      let angleDiff = targetAngle - playerRot.current.y;
      while (angleDiff > Math.PI) angleDiff -= Math.PI * 2;
      while (angleDiff < -Math.PI) angleDiff += Math.PI * 2;
      playerRot.current.y += angleDiff * 0.15;
    }

    playerPos.current.addScaledVector(velocity.current, delta);

    // Smoothly interpolate current camera angle towards target
    currentCameraAngle.current.yaw = THREE.MathUtils.lerp(currentCameraAngle.current.yaw, targetCameraAngle.current.yaw, 0.1);
    currentCameraAngle.current.pitch = THREE.MathUtils.lerp(currentCameraAngle.current.pitch, targetCameraAngle.current.pitch, 0.1);

    // Camera Third-Person Orbit Follow
    const cameraDistance = 8;
    
    // Calculate relative camera position using spherical coordinates
    const offsetX = cameraDistance * Math.sin(currentCameraAngle.current.yaw) * Math.cos(currentCameraAngle.current.pitch);
    const offsetY = cameraDistance * Math.sin(currentCameraAngle.current.pitch);
    const offsetZ = cameraDistance * Math.cos(currentCameraAngle.current.yaw) * Math.cos(currentCameraAngle.current.pitch);

    const targetCamPos = playerPos.current.clone().add(new THREE.Vector3(offsetX, offsetY, offsetZ));
    
    // Floor Collision
    if (targetCamPos.y < 0.5) targetCamPos.y = 0.5;

    // Follow lerp
    camera.position.lerp(targetCamPos, 0.2); 
    camera.lookAt(playerPos.current.x, playerPos.current.y + 1.2, playerPos.current.z);
  });

  return (
    <group>
      {/* Fog for Atmosphere */}
      <fog attach="fog" args={['#050508', 5, 25]} />

      {/* World Floor */}
      <mesh receiveShadow geometry={useMemo(createFloorGeo, [])}>
        <meshStandardMaterial color="#0A0A0F" metalness={0.9} roughness={0.1} />
      </mesh>

      {/* Grid for depth perception */}
      <gridHelper args={[50, 50, '#1E1B4B', '#0F172A']} position={[0, 0.01, 0]} />

      {/* Player Model */}
      <PlayerCharacter 
        position={[playerPos.current.x, 0, playerPos.current.z]} 
        rotation={[0, playerRot.current.y, 0]} 
        moving={isMoving} 
      />

      {/* Environment: Floating Motes */}
      <Sparkles count={100} scale={20} size={2} speed={0.5} color="#7C3AED" />

      {/* Pillars with emissive highlights */}
      {[[-8, -8], [8, -8], [-8, 8], [8, 8], [0, -15]].map((pos, i) => (
        <group key={i} position={[pos[0], 3, pos[1]]}>
          <mesh geometry={useMemo(createPillarGeo, [])}>
            <meshStandardMaterial color="#111" metalness={1} roughness={0.2} />
          </mesh>
          <pointLight position={[0, 1, 0]} intensity={1} color="#7C3AED" distance={10} />
          <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
            <mesh position={[0, 4, 0]}>
              <octahedronGeometry args={[0.3]} />
              <meshStandardMaterial color="#7C3AED" emissive="#7C3AED" emissiveIntensity={2} />
            </mesh>
          </Float>
        </group>
      ))}

      {/* Lighting */}
      <ambientLight intensity={0.2} />
      <directionalLight position={[10, 20, 10]} intensity={0.5} color="#00E5FF" />
    </group>
  );
}
