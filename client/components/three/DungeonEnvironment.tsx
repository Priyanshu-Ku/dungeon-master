"use client";

import { useMemo } from "react";
import * as THREE from "three";

// Stone color palette
const STONE_DARK = "#0e0b1a";
const STONE_MID = "#1a1625";
const NEON_CYAN = "#00FFD4";
const NEON_PURPLE = "#7C3AED";

function WallSection({
  position,
  size,
  color = STONE_MID,
}: {
  position: [number, number, number];
  size: [number, number, number];
  color?: string;
}) {
  return (
    <mesh position={position} castShadow receiveShadow>
      <boxGeometry args={size} />
      <meshStandardMaterial
        color={color}
        roughness={0.92}
        metalness={0.05}
        envMapIntensity={0.1}
      />
    </mesh>
  );
}

function EmissiveEdge({
  position,
  size,
  color = NEON_CYAN,
  intensity = 2,
}: {
  position: [number, number, number];
  size: [number, number, number];
  color?: string;
  intensity?: number;
}) {
  return (
    <mesh position={position}>
      <boxGeometry args={size} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={intensity}
        roughness={0.3}
        metalness={0.8}
      />
    </mesh>
  );
}

export function DungeonEnvironment() {
  const corridorLength = 50;
  const corridorWidth = 10;
  const wallHeight = 7;
  const segments = 10; // number of wall segments

  const wallSections = useMemo(() => {
    const sections = [];
    const segLen = corridorLength / segments;

    for (let i = 0; i < segments; i++) {
      const z = -(i * segLen + segLen / 2);

      // Left wall
      sections.push({
        key: `lw-${i}`,
        position: [-corridorWidth / 2, wallHeight / 2, z] as [number, number, number],
        size: [0.8, wallHeight, segLen] as [number, number, number],
      });

      // Right wall
      sections.push({
        key: `rw-${i}`,
        position: [corridorWidth / 2, wallHeight / 2, z] as [number, number, number],
        size: [0.8, wallHeight, segLen] as [number, number, number],
      });

      // Ceiling
      sections.push({
        key: `ceil-${i}`,
        position: [0, wallHeight, z] as [number, number, number],
        size: [corridorWidth + 1.6, 0.6, segLen] as [number, number, number],
        color: STONE_DARK,
      });
    }

    return sections;
  }, []);

  const edgePositions = useMemo(() => {
    const edges = [];
    const segLen = 4;
    const count = Math.floor(corridorLength / segLen);

    for (let i = 0; i < count; i++) {
      const z = -(i * segLen + segLen / 2);

      // Floor-wall junction edges — cyan
      edges.push({
        key: `fl-${i}`,
        position: [-corridorWidth / 2 + 0.45, 0.05, z] as [number, number, number],
        size: [0.04, 0.04, segLen - 0.2] as [number, number, number],
        color: NEON_CYAN,
        intensity: 2.5,
      });
      edges.push({
        key: `fr-${i}`,
        position: [corridorWidth / 2 - 0.45, 0.05, z] as [number, number, number],
        size: [0.04, 0.04, segLen - 0.2] as [number, number, number],
        color: NEON_CYAN,
        intensity: 2.5,
      });

      // Mid-wall rune strips — alternating cyan/purple
      if (i % 2 === 0) {
        edges.push({
          key: `ml-${i}`,
          position: [-corridorWidth / 2 + 0.42, 2.5, z] as [number, number, number],
          size: [0.03, 0.8, 0.06] as [number, number, number],
          color: i % 4 === 0 ? NEON_PURPLE : NEON_CYAN,
          intensity: 1.5,
        });
        edges.push({
          key: `mr-${i}`,
          position: [corridorWidth / 2 - 0.42, 2.5, z] as [number, number, number],
          size: [0.03, 0.8, 0.06] as [number, number, number],
          color: i % 4 === 0 ? NEON_PURPLE : NEON_CYAN,
          intensity: 1.5,
        });
      }

      // Ceiling-wall junction edges — purple
      edges.push({
        key: `cl-${i}`,
        position: [-corridorWidth / 2 + 0.45, wallHeight - 0.35, z] as [number, number, number],
        size: [0.03, 0.03, segLen - 0.2] as [number, number, number],
        color: NEON_PURPLE,
        intensity: 1.2,
      });
      edges.push({
        key: `cr-${i}`,
        position: [corridorWidth / 2 - 0.45, wallHeight - 0.35, z] as [number, number, number],
        size: [0.03, 0.03, segLen - 0.2] as [number, number, number],
        color: NEON_PURPLE,
        intensity: 1.2,
      });
    }

    return edges;
  }, []);

  return (
    <group>
      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, -corridorLength / 2]} receiveShadow>
        <planeGeometry args={[corridorWidth, corridorLength]} />
        <meshStandardMaterial
          color="#0a0815"
          roughness={0.95}
          metalness={0.02}
        />
      </mesh>

      {/* End wall — back of corridor */}
      <WallSection
        position={[0, wallHeight / 2, -corridorLength]}
        size={[corridorWidth + 1.6, wallHeight, 0.8]}
        color={STONE_DARK}
      />

      {/* Wall sections */}
      {wallSections.map(({ key, position, size, color }) => (
        <WallSection key={key} position={position} size={size} color={color ?? STONE_MID} />
      ))}

      {/* Emissive edges */}
      {edgePositions.map(({ key, position, size, color, intensity }) => (
        <EmissiveEdge key={key} position={position} size={size} color={color} intensity={intensity} />
      ))}

      {/* Entry arch — behind player */}
      <mesh position={[0, wallHeight / 2, 2]}>
        <boxGeometry args={[corridorWidth + 1.6, wallHeight, 0.6]} />
        <meshStandardMaterial color={STONE_DARK} roughness={0.95} />
      </mesh>
    </group>
  );
}
