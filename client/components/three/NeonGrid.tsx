"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export function NeonGrid() {
  const gridRef = useRef<THREE.LineSegments>(null!);
  const pulseRef = useRef<THREE.LineSegments>(null!);

  // Build a grid of lines on the XZ plane
  const { primaryGeometry, pulseGeometry } = useMemo(() => {
    const primaryLines: number[] = [];
    const pulseLines: number[] = [];

    const W = 10;    // corridor width
    const L = 50;    // corridor length
    const step = 1;  // grid cell size

    // Longitudinal lines (Z axis)
    for (let x = -W / 2; x <= W / 2; x += step) {
      primaryLines.push(x, 0.01, 0, x, 0.01, -L);
    }

    // Lateral lines (X axis)
    for (let z = 0; z >= -L; z -= step) {
      primaryLines.push(-W / 2, 0.01, z, W / 2, 0.01, z);
    }

    // Pulse strip lines — center lane, dashed effect via wider spacing
    for (let z = 0; z >= -L; z -= 2) {
      pulseLines.push(-0.05, 0.02, z, 0.05, 0.02, z);         // center strip
      pulseLines.push(-W / 2, 0.02, z, -W / 2 + 0.3, 0.02, z); // left edge strip
      pulseLines.push(W / 2 - 0.3, 0.02, z, W / 2, 0.02, z);   // right edge strip
    }

    const primaryGeometry = new THREE.BufferGeometry();
    primaryGeometry.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(primaryLines, 3)
    );

    const pulseGeometry = new THREE.BufferGeometry();
    pulseGeometry.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(pulseLines, 3)
    );

    return { primaryGeometry, pulseGeometry };
  }, []);

  // Animate pulse strips — travel toward player
  useFrame((state) => {
    const t = state.clock.getElapsedTime();

    if (gridRef.current) {
      const mat = gridRef.current.material as THREE.LineBasicMaterial;
      mat.opacity = 0.15 + Math.sin(t * 0.8) * 0.05;
    }

    if (pulseRef.current) {
      const mat = pulseRef.current.material as THREE.LineBasicMaterial;
      mat.opacity = 0.6 + Math.sin(t * 2) * 0.3;
      // Scroll texture offset to simulate flow
      pulseRef.current.position.z = (t * 3) % 2;
    }
  });

  return (
    <group>
      {/* Base grid — subtle */}
      <lineSegments ref={gridRef} geometry={primaryGeometry}>
        <lineBasicMaterial
          color="#00FFD4"
          transparent
          opacity={0.15}
          depthWrite={false}
        />
      </lineSegments>

      {/* Pulse strips — bright, animated */}
      <lineSegments ref={pulseRef} geometry={pulseGeometry}>
        <lineBasicMaterial
          color="#00FFD4"
          transparent
          opacity={0.8}
          depthWrite={false}
        />
      </lineSegments>

      {/* Purple secondary grid — offset */}
      <lineSegments geometry={primaryGeometry} position={[0, 0.005, 0]}>
        <lineBasicMaterial
          color="#7C3AED"
          transparent
          opacity={0.06}
          depthWrite={false}
        />
      </lineSegments>
    </group>
  );
}
