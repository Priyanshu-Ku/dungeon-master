"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export function PortalDoor({ position = [0, 3, -48] as [number, number, number] }) {
  const outerRingRef = useRef<THREE.Mesh>(null!);
  const innerRingRef = useRef<THREE.Mesh>(null!);
  const diskRef = useRef<THREE.Mesh>(null!);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();

    if (outerRingRef.current) {
      outerRingRef.current.rotation.z = t * 0.4;
      outerRingRef.current.rotation.x = Math.sin(t * 0.3) * 0.1;
    }
    if (innerRingRef.current) {
      innerRingRef.current.rotation.z = -t * 0.7;
    }
    if (diskRef.current) {
      const mat = diskRef.current.material as THREE.MeshStandardMaterial;
      mat.emissiveIntensity = 1 + Math.sin(t * 2) * 0.5;
    }
  });

  return (
    <group position={position}>
      {/* Outer spinning ring */}
      <mesh ref={outerRingRef}>
        <torusGeometry args={[2.4, 0.12, 16, 80]} />
        <meshStandardMaterial
          color="#7C3AED"
          emissive="#7C3AED"
          emissiveIntensity={3}
          roughness={0.1}
          metalness={0.9}
        />
      </mesh>

      {/* Middle ring */}
      <mesh ref={innerRingRef}>
        <torusGeometry args={[1.8, 0.06, 12, 60]} />
        <meshStandardMaterial
          color="#00FFD4"
          emissive="#00FFD4"
          emissiveIntensity={2.5}
          roughness={0.1}
          metalness={0.9}
        />
      </mesh>

      {/* Inner rune ring — static */}
      <mesh>
        <torusGeometry args={[1.2, 0.04, 8, 40]} />
        <meshStandardMaterial
          color="#A855F7"
          emissive="#A855F7"
          emissiveIntensity={2}
        />
      </mesh>

      {/* Portal disk surface — translucent */}
      <mesh ref={diskRef}>
        <circleGeometry args={[2.3, 64]} />
        <meshStandardMaterial
          color="#3d0a6b"
          emissive="#5b21b6"
          emissiveIntensity={1.5}
          transparent
          opacity={0.55}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Glow light behind portal */}
      <pointLight color="#7C3AED" intensity={8} distance={18} decay={2} />
      <pointLight color="#00FFD4" intensity={3} distance={10} decay={2} position={[0, 0, 0.5]} />

      {/* Arch above portal */}
      <mesh position={[0, -3, 0]}>
        <boxGeometry args={[5.5, 0.3, 0.4]} />
        <meshStandardMaterial color="#0e0b1a" roughness={0.9} />
      </mesh>
      <mesh position={[-2.6, 0, 0]}>
        <boxGeometry args={[0.35, 6, 0.4]} />
        <meshStandardMaterial color="#0e0b1a" roughness={0.9} />
      </mesh>
      <mesh position={[2.6, 0, 0]}>
        <boxGeometry args={[0.35, 6, 0.4]} />
        <meshStandardMaterial color="#0e0b1a" roughness={0.9} />
      </mesh>
    </group>
  );
}
