"use client";

import { useRef, useMemo, useState } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useGameStore } from "@/stores/useGameStore";

const CUBE_LABELS = ["O(n)", "BFS", "DFS", "DP", "SORT", "HASH", "TREE", "HEAP"];
const NEON_CYAN = "#00FFD4";
const NEON_PURPLE = "#7C3AED";

interface CubeData {
  id: number;
  position: [number, number, number];
  rotationSpeed: [number, number, number];
  floatOffset: number;
  color: string;
  label: string;
}

function DSANode({
  data,
  onClick,
}: {
  data: CubeData;
  onClick: (label: string) => void;
}) {
  const meshRef = useRef<THREE.Mesh>(null!);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.getElapsedTime();

    // Rotate
    meshRef.current.rotation.x += data.rotationSpeed[0] * 0.01;
    meshRef.current.rotation.y += data.rotationSpeed[1] * 0.01;

    // Float bob
    meshRef.current.position.y =
      data.position[1] + Math.sin(t * 0.8 + data.floatOffset) * 0.25;

    // Hover scale
    const targetScale = hovered ? 1.3 : 1;
    meshRef.current.scale.lerp(
      new THREE.Vector3(targetScale, targetScale, targetScale),
      0.1
    );
  });

  return (
    <group position={data.position}>
      <mesh
        ref={meshRef}
        onClick={() => onClick(data.label)}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <boxGeometry args={[0.7, 0.7, 0.7]} />
        <meshStandardMaterial
          color={data.color}
          emissive={data.color}
          emissiveIntensity={hovered ? 2.5 : 1.2}
          roughness={0.2}
          metalness={0.8}
          wireframe={false}
        />
      </mesh>

      {/* Wireframe overlay — circuit pattern effect */}
      <mesh position={[0, 0, 0]} renderOrder={1}>
        <boxGeometry args={[0.72, 0.72, 0.72]} />
        <meshStandardMaterial
          color={hovered ? "#ffffff" : data.color}
          emissive={hovered ? "#ffffff" : data.color}
          emissiveIntensity={0.5}
          wireframe
          transparent
          opacity={0.4}
        />
      </mesh>

      {/* Glow point */}
      <pointLight
        color={data.color}
        intensity={hovered ? 1.5 : 0.5}
        distance={3}
        decay={2}
      />
    </group>
  );
}

export function FloatingDSANodes({
  onChallengeActivate,
}: {
  onChallengeActivate?: (label: string) => void;
}) {
  const cubes = useMemo<CubeData[]>(() => {
    const positions: [number, number, number][] = [
      [-3, 2.5, -6],
      [3, 3, -8],
      [-2, 4, -12],
      [2.5, 2.8, -15],
      [-3.5, 3.5, -18],
      [0, 5, -22],
      [3, 2.5, -25],
      [-1.5, 4, -28],
    ];

    const c = positions.map((pos, i) => ({
      id: i,
      position: pos,
      rotationSpeed: [
        (Math.random() - 0.5) * 2,
        (Math.random() - 0.5) * 2,
        (Math.random() - 0.5) * 2,
      ],
      floatOffset: i * 0.8,
      color: i % 3 === 0 ? NEON_PURPLE : NEON_CYAN,
      label: CUBE_LABELS[i % CUBE_LABELS.length],
    }));

    return c;
  }, []);

  const stats = useGameStore((state) => state.playerStats);
  const hasResonanceUnlock = stats.badges.length > 0;

  return (
    <group>
      {cubes.map((cube) => (
        <DSANode
          key={cube.id}
          data={cube}
          onClick={(label) => onChallengeActivate?.(label)}
        />
      ))}
      
      {hasResonanceUnlock && (
        <DSANode 
          data={{
            id: 999,
            position: [5, 4, -12], // Hidden alcove position
            rotationSpeed: [1, 2, 0.5],
            floatOffset: 0,
            color: "#00FFD4",
            label: "RESONANCE"
          }}
          onClick={(label) => onChallengeActivate?.(label)}
        />
      )}
    </group>
  );
}
