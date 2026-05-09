"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

// ── Procedural Hero Rig ──────────────────────────────────────────
export function ProceduralHero({
  position = [0, 0, 0],
  rotY = 0,
  scale = 1,
  animState = "Idle",
  layDown = false,
  primaryColor = "#aa1100",
  armorColor = "#1a0a0a"
}: {
  position?: [number, number, number];
  rotY?: number;
  scale?: number;
  animState?: "Idle" | "Walk" | "Run" | "LayDown";
  layDown?: boolean;
  primaryColor?: string;
  armorColor?: string;
}) {
  const rootRef = useRef<THREE.Group>(null!);
  const torsoRef = useRef<THREE.Group>(null!);
  const headRef = useRef<THREE.Group>(null!);
  const armLRef = useRef<THREE.Group>(null!);
  const armRRef = useRef<THREE.Group>(null!);
  const legLRef = useRef<THREE.Group>(null!);
  const legRRef = useRef<THREE.Group>(null!);
  const capeRef = useRef<THREE.Group>(null!);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    
    if (layDown) {
      if (torsoRef.current) torsoRef.current.position.y = Math.sin(t * 2) * 0.02;
      return;
    }

    const speed = animState === "Run" ? 12 : animState === "Walk" ? 6 : 2;
    const cycle = t * speed;

    if (animState === "Idle") {
      if (torsoRef.current) torsoRef.current.position.y = Math.sin(cycle) * 0.03;
      if (armLRef.current) armLRef.current.rotation.z = 0.1 + Math.sin(cycle) * 0.02;
      if (armRRef.current) armRRef.current.rotation.z = -0.1 - Math.sin(cycle) * 0.02;
      if (headRef.current) headRef.current.rotation.y = Math.sin(t * 0.5) * 0.1;
      if (capeRef.current) capeRef.current.rotation.x = 0.2 + Math.sin(t * 3) * 0.05;
      
      if (legLRef.current) legLRef.current.rotation.x = THREE.MathUtils.lerp(legLRef.current.rotation.x, 0, 0.1);
      if (legRRef.current) legRRef.current.rotation.x = THREE.MathUtils.lerp(legRRef.current.rotation.x, 0, 0.1);
      if (armLRef.current) armLRef.current.rotation.x = THREE.MathUtils.lerp(armLRef.current.rotation.x, 0, 0.1);
      if (armRRef.current) armRRef.current.rotation.x = THREE.MathUtils.lerp(armRRef.current.rotation.x, 0, 0.1);
    } 
    else if (animState === "Walk" || animState === "Run") {
      const swingAmp = animState === "Run" ? 0.8 : 0.4;
      const bobAmp = animState === "Run" ? 0.1 : 0.05;
      
      if (torsoRef.current) torsoRef.current.position.y = Math.abs(Math.sin(cycle)) * bobAmp;
      if (legLRef.current) legLRef.current.rotation.x = Math.sin(cycle) * swingAmp;
      if (legRRef.current) legRRef.current.rotation.x = Math.sin(cycle + Math.PI) * swingAmp;
      if (armLRef.current) armLRef.current.rotation.x = Math.sin(cycle + Math.PI) * swingAmp * 0.8;
      if (armRRef.current) armRRef.current.rotation.x = Math.sin(cycle) * swingAmp * 0.8;
      if (capeRef.current) capeRef.current.rotation.x = (animState === "Run" ? 0.8 : 0.4) + Math.sin(cycle * 2) * 0.1;
      if (headRef.current) headRef.current.rotation.y = 0;
    }
  });

  const groupRot: [number,number,number] = layDown ? [Math.PI / 2, rotY, 0] : [0, rotY, 0];

  return (
    <group ref={rootRef} position={position} rotation={groupRot} scale={scale}>
      <group position={[0, 1.2, 0]} ref={torsoRef}>
        <mesh castShadow receiveShadow>
          <capsuleGeometry args={[0.25, 0.7, 8, 16]} />
          <meshStandardMaterial color={primaryColor} roughness={0.7} />
        </mesh>

        <group position={[0, 0.65, 0]} ref={headRef}>
          <mesh castShadow>
            <sphereGeometry args={[0.22, 16, 16]} />
            <meshStandardMaterial color={armorColor} roughness={0.5} metalness={0.8} />
          </mesh>
          <mesh position={[0, 0, 0.15]} castShadow>
            <boxGeometry args={[0.25, 0.3, 0.2]} />
            <meshStandardMaterial color="#050505" roughness={0.4} metalness={0.9} />
          </mesh>
        </group>

        <group position={[-0.35, 0.3, 0]} ref={armLRef}>
          <mesh position={[0, -0.3, 0]} castShadow>
            <capsuleGeometry args={[0.1, 0.4, 8, 8]} />
            <meshStandardMaterial color={primaryColor} roughness={0.7} />
          </mesh>
        </group>

        <group position={[0.35, 0.3, 0]} ref={armRRef}>
          <mesh position={[0, -0.3, 0]} castShadow>
            <capsuleGeometry args={[0.1, 0.4, 8, 8]} />
            <meshStandardMaterial color={primaryColor} roughness={0.7} />
          </mesh>
        </group>

        <group position={[-0.15, -0.4, 0]} ref={legLRef}>
          <mesh position={[0, -0.4, 0]} castShadow>
            <capsuleGeometry args={[0.12, 0.5, 8, 8]} />
            <meshStandardMaterial color="#0a0a0a" roughness={0.8} />
          </mesh>
        </group>

        <group position={[0.15, -0.4, 0]} ref={legRRef}>
          <mesh position={[0, -0.4, 0]} castShadow>
            <capsuleGeometry args={[0.12, 0.5, 8, 8]} />
            <meshStandardMaterial color="#0a0a0a" roughness={0.8} />
          </mesh>
        </group>

        <group position={[0, 0.5, -0.2]} ref={capeRef}>
          <mesh position={[0, -0.7, -0.1]} rotation={[-0.1, 0, 0]} castShadow>
            <planeGeometry args={[0.8, 1.6, 4, 8]} />
            <meshStandardMaterial color="#770a00" roughness={0.9} side={THREE.DoubleSide} />
          </mesh>
        </group>
      </group>
    </group>
  );
}

// ── Procedural Boss Rig ──────────────────────────────────────────
export function ProceduralBoss({ position = [0, 0, 0], animState = "Idle" }: { position?: [number, number, number], animState?: "Idle" | "Walk" | "Run" }) {
  const rootRef = useRef<THREE.Group>(null!);
  const torsoRef = useRef<THREE.Group>(null!);
  const headRef = useRef<THREE.Group>(null!);
  const armLRef = useRef<THREE.Group>(null!);
  const armRRef = useRef<THREE.Group>(null!);
  const legLRef = useRef<THREE.Group>(null!);
  const legRRef = useRef<THREE.Group>(null!);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    const speed = animState === "Run" ? 8 : animState === "Walk" ? 3 : 1.5;
    const cycle = t * speed;

    if (animState === "Idle") {
      if (torsoRef.current) torsoRef.current.position.y = Math.sin(cycle) * 0.05;
      if (armLRef.current) armLRef.current.rotation.z = 0.2 + Math.sin(cycle) * 0.03;
      if (armRRef.current) armRRef.current.rotation.z = -0.2 - Math.sin(cycle) * 0.03;
      if (headRef.current) headRef.current.rotation.y = Math.sin(t * 0.5) * 0.15;
    } 
    else if (animState === "Walk" || animState === "Run") {
      const swingAmp = animState === "Run" ? 0.9 : 0.5;
      const bobAmp = animState === "Run" ? 0.2 : 0.08;
      
      if (torsoRef.current) {
        torsoRef.current.position.y = Math.abs(Math.sin(cycle)) * bobAmp;
        torsoRef.current.rotation.x = animState === "Run" ? 0.3 : 0.1;
      }
      if (legLRef.current) legLRef.current.rotation.x = Math.sin(cycle) * swingAmp;
      if (legRRef.current) legRRef.current.rotation.x = Math.sin(cycle + Math.PI) * swingAmp;
      if (armLRef.current) armLRef.current.rotation.x = Math.sin(cycle + Math.PI) * swingAmp * 0.9;
      if (armRRef.current) armRRef.current.rotation.x = Math.sin(cycle) * swingAmp * 0.9;
    }
    
    if (rootRef.current) rootRef.current.position.y = position[1] + (animState !== "Idle" ? Math.abs(Math.sin(cycle)) * 0.1 : 0);
  });

  return (
    <group ref={rootRef} position={position}>
      <group position={[0, 2.5, 0]} ref={torsoRef}>
        <mesh castShadow>
          <capsuleGeometry args={[0.8, 1.8, 12, 16]} />
          <meshStandardMaterial color="#050507" roughness={0.2} metalness={0.95} emissive="#220000" emissiveIntensity={0.5} />
        </mesh>
        
        <mesh position={[0, 0.2, 0.4]} castShadow>
          <boxGeometry args={[1.2, 1.0, 0.6]} />
          <meshStandardMaterial color="#020202" roughness={0.3} metalness={0.99} />
        </mesh>
        
        <group position={[0, 1.5, 0]} ref={headRef}>
          <mesh castShadow>
            <sphereGeometry args={[0.5, 16, 16]} />
            <meshStandardMaterial color="#020202" roughness={0.1} metalness={0.99} />
          </mesh>
          {[-0.3, -0.15, 0, 0.15, 0.3].map((x, i) => (
            <mesh key={i} position={[x, 0.4, 0]} rotation={[0, 0, -x]} castShadow>
              <coneGeometry args={[0.08, 0.6 + Math.abs(x)*2, 4]} />
              <meshStandardMaterial color="#010101" roughness={0.1} metalness={0.99} />
            </mesh>
          ))}
          <mesh position={[-0.18, 0.1, 0.45]}>
            <boxGeometry args={[0.12, 0.04, 0.05]} />
            <meshStandardMaterial emissive="#ff1100" emissiveIntensity={5} color="#ff0000" />
          </mesh>
          <mesh position={[0.18, 0.1, 0.45]}>
            <boxGeometry args={[0.12, 0.04, 0.05]} />
            <meshStandardMaterial emissive="#ff1100" emissiveIntensity={5} color="#ff0000" />
          </mesh>
        </group>

        <group position={[-1.1, 0.8, 0]} ref={armLRef}>
          <mesh position={[0, -0.8, 0]} castShadow>
            <capsuleGeometry args={[0.3, 1.2, 8, 8]} />
            <meshStandardMaterial color="#050507" roughness={0.3} metalness={0.9} />
          </mesh>
          <mesh position={[0, 0.2, 0]} rotation={[0, 0, 0.4]} castShadow>
            <coneGeometry args={[0.4, 1.2, 4]} />
            <meshStandardMaterial color="#040404" roughness={0.1} metalness={0.99} />
          </mesh>
        </group>

        <group position={[1.1, 0.8, 0]} ref={armRRef}>
          <mesh position={[0, -0.8, 0]} castShadow>
            <capsuleGeometry args={[0.3, 1.2, 8, 8]} />
            <meshStandardMaterial color="#050507" roughness={0.3} metalness={0.9} />
          </mesh>
          <mesh position={[0, 0.2, 0]} rotation={[0, 0, -0.4]} castShadow>
            <coneGeometry args={[0.4, 1.2, 4]} />
            <meshStandardMaterial color="#040404" roughness={0.1} metalness={0.99} />
          </mesh>
        </group>

        <group position={[-0.4, -0.9, 0]} ref={legLRef}>
          <mesh position={[0, -0.8, 0]} castShadow>
            <capsuleGeometry args={[0.35, 1.2, 8, 8]} />
            <meshStandardMaterial color="#030303" roughness={0.5} metalness={0.8} />
          </mesh>
        </group>

        <group position={[0.4, -0.9, 0]} ref={legRRef}>
          <mesh position={[0, -0.8, 0]} castShadow>
            <capsuleGeometry args={[0.35, 1.2, 8, 8]} />
            <meshStandardMaterial color="#030303" roughness={0.5} metalness={0.8} />
          </mesh>
        </group>
      </group>
      <pointLight color="#ff0000" intensity={30} distance={15} position={[0, 3, 2]} />
    </group>
  );
}
