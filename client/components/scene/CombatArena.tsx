'use client';

import React, { useMemo } from 'react';
import { Stars, Sparkles, Float, MeshDistortMaterial, Text } from '@react-three/drei';
import * as THREE from 'three';

export function CombatArena() {
  const arenaSize = 25;

  return (
    <group>
      {/* Dramatic Sky/Background */}
      <color attach="background" args={['#1a0a00']} />
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
      <fog attach="fog" args={['#2a1000', 10, 40]} />

      {/* Atmospheric Embers */}
      <Sparkles count={100} scale={20} size={2} speed={0.4} color="#ff6600" />

      {/* Main Fighting Platform */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[arenaSize, arenaSize]} />
        <meshStandardMaterial 
          color="#0a0a0a" 
          roughness={0.8} 
          metalness={0.2} 
        />
      </mesh>

      {/* Glowing Orange Grid/Markings (Tekken Style) */}
      <gridHelper args={[arenaSize, 10, '#ff4500', '#222']} position={[0, 0.01, 0]} />

      {/* Corner Pillars with Fire/Energy */}
      {[[1, 1], [1, -1], [-1, 1], [-1, -1]].map(([x, z], i) => (
        <group key={i} position={[x * (arenaSize / 2 - 1), 0, z * (arenaSize / 2 - 1)]}>
          {/* Pillar Base */}
          <mesh position={[0, 1.5, 0]}>
            <boxGeometry args={[0.8, 3, 0.8]} />
            <meshStandardMaterial color="#222" metalness={0.8} roughness={0.2} />
          </mesh>
          
          {/* Glowing Energy Core */}
          <Float speed={2} rotationIntensity={1} floatIntensity={1}>
            <mesh position={[0, 3.5, 0]}>
              <octahedronGeometry args={[0.5]} />
              <meshStandardMaterial 
                color="#ff4500" 
                emissive="#ff4500" 
                emissiveIntensity={10} 
                toneMapped={false}
              />
            </mesh>
          </Float>
          
          {/* Light from Pillar */}
          <pointLight position={[0, 3.5, 0]} intensity={15} color="#ff4500" distance={10} />
        </group>
      ))}

      {/* Center "Resonance" Symbol */}
      <group position={[0, 0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <mesh>
          <ringGeometry args={[2.5, 2.7, 64]} />
          <meshBasicMaterial color="#ff4500" transparent opacity={0.6} />
        </mesh>
        <mesh>
          <ringGeometry args={[4, 4.1, 64]} />
          <meshBasicMaterial color="#ff6600" transparent opacity={0.3} />
        </mesh>
      </group>

      {/* Dramatic Text Overlays (optional flair) */}
      <Text
        position={[0, 8, -12]}
        fontSize={3}
        color="#ff4500"
        font="/fonts/Inter-Bold.woff" // Assuming font exists or fallback
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.1}
        outlineColor="black"
      >
        RESONANCE DUEL
      </Text>

      {/* Perimeter Glow */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.1, 0]}>
        <planeGeometry args={[arenaSize + 4, arenaSize + 4]} />
        <meshBasicMaterial color="#ff2200" transparent opacity={0.1} />
      </mesh>

      {/* Floor Detail: Cracked Stone/Lava Vibe */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.05, 0]}>
        <planeGeometry args={[arenaSize, arenaSize]} />
        <MeshDistortMaterial
          color="#111"
          speed={1}
          distort={0.1}
          radius={1}
        />
      </mesh>
    </group>
  );
}
