"use client";

import { useRef, useMemo, useState } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useGameStore } from "@/stores/useGameStore";

const STONE_DARK = "#0e0b1a";
const STONE_MID = "#1a1625";
const NEON_GOLD = "#F0A500";

function GoldenNode({ position }: { position: [number, number, number] }) {
  const meshRef = useRef<THREE.Mesh>(null!);
  const [hovered, setHovered] = useState(false);
  const playerStats = useGameStore((state) => state.playerStats);
  
  const timer = useMemo(() => new THREE.Timer(), []);
  
  // Optional: Could display badgeName in a 3D text component in the future
  const badgeName = playerStats.activeBadge?.displayName || 
                    (playerStats.badges.length > 0 ? playerStats.badges[0].displayName : "Resonance Badge");

  useFrame(() => {
    if (!meshRef.current) return;
    timer.update();
    const t = timer.getElapsed();

    meshRef.current.rotation.x += 0.01;
    meshRef.current.rotation.y += 0.015;
    meshRef.current.position.y = position[1] + Math.sin(t * 1.5) * 0.3;

    const targetScale = hovered ? 1.4 : 1;
    meshRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);
  });

  return (
    <group position={position}>
      <mesh
        ref={meshRef}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <octahedronGeometry args={[0.8, 0]} />
        <meshStandardMaterial
          color={NEON_GOLD}
          emissive={NEON_GOLD}
          emissiveIntensity={hovered ? 3 : 1.5}
          roughness={0.1}
          metalness={0.9}
        />
      </mesh>

      <mesh renderOrder={1} position={position} scale={[1.1, 1.1, 1.1]}>
        <octahedronGeometry args={[0.8, 0]} />
        <meshStandardMaterial
          color="#ffffff"
          emissive="#ffffff"
          emissiveIntensity={0.5}
          wireframe
          transparent
          opacity={0.3}
        />
      </mesh>

      <pointLight color={NEON_GOLD} intensity={hovered ? 2.5 : 1.5} distance={6} decay={2} />
    </group>
  );
}

export function HiddenRoom({ position }: { position: [number, number, number] }) {
  const roomDepth = 15;
  const roomWidth = 12;
  const wallHeight = 7;
  const corridorWidth = 6;
  const corridorLength = 8;
  
  return (
    <group position={position}>
      {/* Side Corridor Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[corridorLength / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[corridorLength, corridorWidth]} />
        <meshStandardMaterial color="#0a0815" roughness={0.95} />
      </mesh>
      
      {/* Side Corridor Walls */}
      <mesh position={[corridorLength / 2, wallHeight / 2, -corridorWidth / 2]} castShadow>
         <boxGeometry args={[corridorLength, wallHeight, 0.8]} />
         <meshStandardMaterial color={STONE_MID} roughness={0.92} />
      </mesh>
      <mesh position={[corridorLength / 2, wallHeight / 2, corridorWidth / 2]} castShadow>
         <boxGeometry args={[corridorLength, wallHeight, 0.8]} />
         <meshStandardMaterial color={STONE_MID} roughness={0.92} />
      </mesh>
      
      {/* Room Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[corridorLength + roomDepth / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[roomDepth, roomWidth]} />
        <meshStandardMaterial color="#0a0815" roughness={0.95} />
      </mesh>
      
      {/* Room Walls */}
      {/* Back Wall */}
      <mesh position={[corridorLength + roomDepth, wallHeight / 2, 0]} castShadow>
         <boxGeometry args={[0.8, wallHeight, roomWidth + 0.8]} />
         <meshStandardMaterial color={STONE_DARK} roughness={0.92} />
      </mesh>
      {/* Side Walls */}
      <mesh position={[corridorLength + roomDepth / 2, wallHeight / 2, -roomWidth / 2]} castShadow>
         <boxGeometry args={[roomDepth, wallHeight, 0.8]} />
         <meshStandardMaterial color={STONE_MID} roughness={0.92} />
      </mesh>
      <mesh position={[corridorLength + roomDepth / 2, wallHeight / 2, roomWidth / 2]} castShadow>
         <boxGeometry args={[roomDepth, wallHeight, 0.8]} />
         <meshStandardMaterial color={STONE_MID} roughness={0.92} />
      </mesh>
      {/* Front Wall with Gap */}
      <mesh position={[corridorLength, wallHeight / 2, -roomWidth / 4 - corridorWidth / 4]} castShadow>
         <boxGeometry args={[0.8, wallHeight, roomWidth / 2 - corridorWidth / 2]} />
         <meshStandardMaterial color={STONE_MID} roughness={0.92} />
      </mesh>
      <mesh position={[corridorLength, wallHeight / 2, roomWidth / 4 + corridorWidth / 4]} castShadow>
         <boxGeometry args={[0.8, wallHeight, roomWidth / 2 - corridorWidth / 2]} />
         <meshStandardMaterial color={STONE_MID} roughness={0.92} />
      </mesh>
      
      {/* Room Ceiling */}
      <mesh position={[corridorLength + roomDepth / 2, wallHeight, 0]}>
         <boxGeometry args={[roomDepth, 0.6, roomWidth + 0.8]} />
         <meshStandardMaterial color={STONE_DARK} roughness={0.92} />
      </mesh>
      
      {/* Side Corridor Ceiling */}
      <mesh position={[corridorLength / 2, wallHeight, 0]}>
         <boxGeometry args={[corridorLength, 0.6, corridorWidth]} />
         <meshStandardMaterial color={STONE_DARK} roughness={0.92} />
      </mesh>

      {/* The Golden Node */}
      <GoldenNode position={[corridorLength + roomDepth / 2, 2.5, 0]} />
      
      {/* Decorative Gold Edge (Floor Ring) */}
      <mesh position={[corridorLength + roomDepth / 2, 0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[2, 2.1, 32]} />
        <meshStandardMaterial color={NEON_GOLD} emissive={NEON_GOLD} emissiveIntensity={2} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}
