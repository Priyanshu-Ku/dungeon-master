"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export function SceneLighting() {
  const neonLightRef = useRef<THREE.PointLight>(null!);
  const neonLight2Ref = useRef<THREE.PointLight>(null!);

  // Pulse the neon lights
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    const pulse = Math.sin(t * 1.5) * 0.3 + 1.7;
    if (neonLightRef.current) neonLightRef.current.intensity = pulse;
    if (neonLight2Ref.current) neonLight2Ref.current.intensity = pulse * 0.6;
  });

  return (
    <>
      {/* Deep purple ambient — much brighter base */}
      <ambientLight color="#2a1a4e" intensity={2.5} />

      {/* Hemisphere: deep sky / near-black ground */}
      <hemisphereLight
        color="#1a0f3a"
        groundColor="#050310"
        intensity={1.5}
      />

      {/* Primary neon floor glow — cyan, strong */}
      <pointLight
        ref={neonLightRef}
        color="#00FFD4"
        intensity={8}
        distance={30}
        decay={1.5}
        position={[0, 0.5, -5]}
      />

      {/* Secondary cyan — deeper in corridor */}
      <pointLight
        ref={neonLight2Ref}
        color="#00D4FF"
        intensity={5}
        distance={25}
        decay={1.5}
        position={[0, 0.5, -18]}
      />

      {/* Purple accent light — portal end */}
      <pointLight
        color="#7C3AED"
        intensity={10}
        distance={20}
        decay={1.5}
        position={[0, 3, -35]}
      />

      {/* Side fill lights — wall illumination */}
      <pointLight color="#004466" intensity={3} distance={20} position={[-6, 2, -10]} />
      <pointLight color="#004466" intensity={3} distance={20} position={[6, 2, -10]} />
      <pointLight color="#220066" intensity={3} distance={20} position={[-6, 2, -22]} />
      <pointLight color="#220066" intensity={3} distance={20} position={[6, 2, -22]} />

      {/* Character rim light — from above-behind */}
      <spotLight
        color="#00FFD4"
        intensity={6}
        angle={0.6}
        penumbra={0.8}
        distance={15}
        position={[1, 4, 4]}
        castShadow={false}
      />

      {/* Top directional — fill for entire scene */}
      <directionalLight color="#1a0f3a" intensity={1.5} position={[0, 10, 5]} />
    </>
  );
}
