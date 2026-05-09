"use client";
// v3.0 — Pure Procedural Animation, Smooth Cinematic Flow

import { useRef, useEffect, useState, useMemo, Suspense } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { EffectComposer, Bloom, DepthOfField, Vignette, Noise } from "@react-three/postprocessing";
import * as THREE from "three";
import { motion, AnimatePresence } from "motion/react";

const SCENE_1_END = 16;
const SCENE_2_END = 32;
const SCENE_3_END = 45;

// ── Smooth Dampening Helper ──────────────────────────────────────
function damp3(target: THREE.Vector3, to: THREE.Vector3, lambda: number, dt: number) {
  target.x = THREE.MathUtils.damp(target.x, to.x, lambda, dt);
  target.y = THREE.MathUtils.damp(target.y, to.y, lambda, dt);
  target.z = THREE.MathUtils.damp(target.z, to.z, lambda, dt);
}

// ── Procedural Hero Rig ──────────────────────────────────────────
function ProceduralHero({
  position, rotY = 0, scale = 1, animState = "Idle", layDown = false,
  primaryColor = "#aa1100", armorColor = "#1a0a0a"
}: {
  position: [number, number, number];
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
      // Laying down, subtle breathing
      if (torsoRef.current) torsoRef.current.position.y = Math.sin(t * 2) * 0.02;
      return;
    }

    const speed = animState === "Run" ? 12 : animState === "Walk" ? 6 : 2;
    const cycle = t * speed;

    if (animState === "Idle") {
      // Breathing
      if (torsoRef.current) torsoRef.current.position.y = Math.sin(cycle) * 0.03;
      if (armLRef.current) armLRef.current.rotation.z = 0.1 + Math.sin(cycle) * 0.02;
      if (armRRef.current) armRRef.current.rotation.z = -0.1 - Math.sin(cycle) * 0.02;
      if (headRef.current) headRef.current.rotation.y = Math.sin(t * 0.5) * 0.1;
      if (capeRef.current) capeRef.current.rotation.x = 0.2 + Math.sin(t * 3) * 0.05;
      
      // Reset limbs
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
        {/* Torso */}
        <mesh castShadow receiveShadow>
          <capsuleGeometry args={[0.25, 0.7, 8, 16]} />
          <meshStandardMaterial color={primaryColor} roughness={0.7} />
        </mesh>

        {/* Head */}
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

        {/* Left Arm */}
        <group position={[-0.35, 0.3, 0]} ref={armLRef}>
          <mesh position={[0, -0.3, 0]} castShadow>
            <capsuleGeometry args={[0.1, 0.4, 8, 8]} />
            <meshStandardMaterial color={primaryColor} roughness={0.7} />
          </mesh>
        </group>

        {/* Right Arm */}
        <group position={[0.35, 0.3, 0]} ref={armRRef}>
          <mesh position={[0, -0.3, 0]} castShadow>
            <capsuleGeometry args={[0.1, 0.4, 8, 8]} />
            <meshStandardMaterial color={primaryColor} roughness={0.7} />
          </mesh>
        </group>

        {/* Left Leg */}
        <group position={[-0.15, -0.4, 0]} ref={legLRef}>
          <mesh position={[0, -0.4, 0]} castShadow>
            <capsuleGeometry args={[0.12, 0.5, 8, 8]} />
            <meshStandardMaterial color="#0a0a0a" roughness={0.8} />
          </mesh>
        </group>

        {/* Right Leg */}
        <group position={[0.15, -0.4, 0]} ref={legRRef}>
          <mesh position={[0, -0.4, 0]} castShadow>
            <capsuleGeometry args={[0.12, 0.5, 8, 8]} />
            <meshStandardMaterial color="#0a0a0a" roughness={0.8} />
          </mesh>
        </group>

        {/* Cape */}
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
function ProceduralBoss({ position, animState = "Idle" }: { position: [number, number, number], animState?: "Idle" | "Walk" | "Run" }) {
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
      // Heavy breathing
      if (torsoRef.current) torsoRef.current.position.y = Math.sin(cycle) * 0.05;
      if (armLRef.current) armLRef.current.rotation.z = 0.2 + Math.sin(cycle) * 0.03;
      if (armRRef.current) armRRef.current.rotation.z = -0.2 - Math.sin(cycle) * 0.03;
      if (headRef.current) headRef.current.rotation.y = Math.sin(t * 0.5) * 0.15;
      
      if (legLRef.current) legLRef.current.rotation.x = THREE.MathUtils.lerp(legLRef.current.rotation.x, 0, 0.1);
      if (legRRef.current) legRRef.current.rotation.x = THREE.MathUtils.lerp(legRRef.current.rotation.x, 0, 0.1);
      if (armLRef.current) armLRef.current.rotation.x = THREE.MathUtils.lerp(armLRef.current.rotation.x, 0, 0.1);
      if (armRRef.current) armRRef.current.rotation.x = THREE.MathUtils.lerp(armRRef.current.rotation.x, 0, 0.1);
    } 
    else if (animState === "Walk" || animState === "Run") {
      // Lumbering heavy sprint
      const swingAmp = animState === "Run" ? 0.9 : 0.5;
      const bobAmp = animState === "Run" ? 0.2 : 0.08;
      
      if (torsoRef.current) {
        torsoRef.current.position.y = Math.abs(Math.sin(cycle)) * bobAmp;
        // Torso leans forward when running
        torsoRef.current.rotation.x = animState === "Run" ? 0.3 : 0.1;
      }
      // Heavy stomping legs
      if (legLRef.current) legLRef.current.rotation.x = Math.sin(cycle) * swingAmp;
      if (legRRef.current) legRRef.current.rotation.x = Math.sin(cycle + Math.PI) * swingAmp;
      
      // Arms pumping violently
      if (armLRef.current) armLRef.current.rotation.x = Math.sin(cycle + Math.PI) * swingAmp * 0.9;
      if (armRRef.current) armRRef.current.rotation.x = Math.sin(cycle) * swingAmp * 0.9;
      
      if (headRef.current) headRef.current.rotation.y = 0;
    }
    
    // Overall vertical bob to match terrain
    if (rootRef.current) rootRef.current.position.y = position[1] + (animState !== "Idle" ? Math.abs(Math.sin(cycle)) * 0.1 : 0);
  });

  return (
    <group ref={rootRef} position={position}>
      <group position={[0, 2.5, 0]} ref={torsoRef}>
        {/* Massive Dark Armor Body */}
        <mesh castShadow>
          <capsuleGeometry args={[0.8, 1.8, 12, 16]} />
          <meshStandardMaterial color="#050507" roughness={0.2} metalness={0.95} emissive="#220000" emissiveIntensity={0.5} />
        </mesh>
        
        {/* Chest Plate / Ribs */}
        <mesh position={[0, 0.2, 0.4]} castShadow>
          <boxGeometry args={[1.2, 1.0, 0.6]} />
          <meshStandardMaterial color="#020202" roughness={0.3} metalness={0.99} />
        </mesh>
        
        {/* Head */}
        <group position={[0, 1.5, 0]} ref={headRef}>
          <mesh castShadow>
            <sphereGeometry args={[0.5, 16, 16]} />
            <meshStandardMaterial color="#020202" roughness={0.1} metalness={0.99} />
          </mesh>
          {/* Crown/Horns */}
          {[-0.3, -0.15, 0, 0.15, 0.3].map((x, i) => (
            <mesh key={i} position={[x, 0.4, 0]} rotation={[0, 0, -x]} castShadow>
              <coneGeometry args={[0.08, 0.6 + Math.abs(x)*2, 4]} />
              <meshStandardMaterial color="#010101" roughness={0.1} metalness={0.99} />
            </mesh>
          ))}
          {/* Glowing Eyes */}
          <mesh position={[-0.18, 0.1, 0.45]}>
            <boxGeometry args={[0.12, 0.04, 0.05]} />
            <meshStandardMaterial emissive="#ff1100" emissiveIntensity={5} color="#ff0000" />
          </mesh>
          <mesh position={[0.18, 0.1, 0.45]}>
            <boxGeometry args={[0.12, 0.04, 0.05]} />
            <meshStandardMaterial emissive="#ff1100" emissiveIntensity={5} color="#ff0000" />
          </mesh>
        </group>

        {/* Left Arm (Massive) */}
        <group position={[-1.1, 0.8, 0]} ref={armLRef}>
          <mesh position={[0, -0.8, 0]} castShadow>
            <capsuleGeometry args={[0.3, 1.2, 8, 8]} />
            <meshStandardMaterial color="#050507" roughness={0.3} metalness={0.9} />
          </mesh>
          {/* Spiked Shoulder */}
          <mesh position={[0, 0.2, 0]} rotation={[0, 0, 0.4]} castShadow>
            <coneGeometry args={[0.4, 1.2, 4]} />
            <meshStandardMaterial color="#040404" roughness={0.1} metalness={0.99} />
          </mesh>
        </group>

        {/* Right Arm (Massive) */}
        <group position={[1.1, 0.8, 0]} ref={armRRef}>
          <mesh position={[0, -0.8, 0]} castShadow>
            <capsuleGeometry args={[0.3, 1.2, 8, 8]} />
            <meshStandardMaterial color="#050507" roughness={0.3} metalness={0.9} />
          </mesh>
          {/* Spiked Shoulder */}
          <mesh position={[0, 0.2, 0]} rotation={[0, 0, -0.4]} castShadow>
            <coneGeometry args={[0.4, 1.2, 4]} />
            <meshStandardMaterial color="#040404" roughness={0.1} metalness={0.99} />
          </mesh>
        </group>

        {/* Left Leg */}
        <group position={[-0.4, -0.9, 0]} ref={legLRef}>
          <mesh position={[0, -0.8, 0]} castShadow>
            <capsuleGeometry args={[0.35, 1.2, 8, 8]} />
            <meshStandardMaterial color="#030303" roughness={0.5} metalness={0.8} />
          </mesh>
        </group>

        {/* Right Leg */}
        <group position={[0.4, -0.9, 0]} ref={legRRef}>
          <mesh position={[0, -0.8, 0]} castShadow>
            <capsuleGeometry args={[0.35, 1.2, 8, 8]} />
            <meshStandardMaterial color="#030303" roughness={0.5} metalness={0.8} />
          </mesh>
        </group>
      </group>

      {/* Hellfire Rim Lighting */}
      <pointLight color="#ff0000" intensity={30} distance={15} position={[0, 3, 2]} />
      <pointLight color="#ff3300" intensity={15} distance={10} position={[0, 4.5, 1.5]} />
    </group>
  );
}

// ── Environment Helpers ──────────────────────────────────────────
function Sky({ top, mid, bot }: { top: string; mid: string; bot: string }) {
  const mat = useMemo(() => new THREE.ShaderMaterial({
    side: THREE.BackSide,
    uniforms: {
      topColor: { value: new THREE.Color(top) },
      midColor: { value: new THREE.Color(mid) },
      botColor: { value: new THREE.Color(bot) },
    },
    vertexShader: `varying vec3 vP; void main(){ vP = position; gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.0); }`,
    fragmentShader: `
      uniform vec3 topColor, midColor, botColor;
      varying vec3 vP;
      void main(){
        float h = normalize(vP).y;
        vec3 c = mix(botColor, midColor, smoothstep(-0.05,0.3,h));
        c = mix(c, topColor, smoothstep(0.3,1.0,h));
        gl_FragColor = vec4(c,1.0);
      }`,
  }), [top, mid, bot]);
  return <mesh><sphereGeometry args={[280,32,32]}/><primitive object={mat} attach="material"/></mesh>;
}

function Stars() {
  const pos = useMemo(() => {
    const p = new Float32Array(2000 * 3);
    for (let i = 0; i < 2000; i++) {
      const th = Math.random() * Math.PI * 2, ph = Math.acos(2 * Math.random() - 1), r = 260;
      p[i*3]=r*Math.sin(ph)*Math.cos(th); p[i*3+1]=r*Math.sin(ph)*Math.sin(th); p[i*3+2]=r*Math.cos(ph);
    }
    return p;
  }, []);
  return (
    <points>
      <bufferGeometry><bufferAttribute attach="attributes-position" args={[pos,3]}/></bufferGeometry>
      <pointsMaterial color="#ffffff" size={0.5} transparent opacity={0.85} sizeAttenuation/>
    </points>
  );
}

function Tree({ p, s, seed }: { p:[number,number,number]; s:number; seed:number }) {
  const lean = (Math.sin(seed*31.7)*0.07);
  return (
    <group position={p} scale={s} rotation={[lean, seed*2.1, lean*0.5]}>
      <mesh position={[0,2.5,0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.22,0.48,5,10]}/>
        <meshStandardMaterial color="#1c0e07" roughness={0.98} metalness={0.0}/>
      </mesh>
      <mesh position={[0,5.8,0]} castShadow>
        <sphereGeometry args={[2.4,14,14]}/>
        <meshStandardMaterial color={`hsl(${110+seed%30},${40+seed%20}%,${8+seed%8}%)`} roughness={0.95} flatShading/>
      </mesh>
      <mesh position={[0.8,4.8,0.6]} scale={0.65} castShadow>
        <sphereGeometry args={[2.2,10,10]}/>
        <meshStandardMaterial color={`hsl(${115+seed%20},${38+seed%15}%,${7+seed%6}%)`} roughness={0.95} flatShading/>
      </mesh>
    </group>
  );
}

function House({ p, r=0, s=1 }: { p:[number,number,number]; r?:number; s?:number }) {
  return (
    <group position={p} rotation={[0,r,0]} scale={s}>
      <mesh position={[0,0.3,0]} receiveShadow><boxGeometry args={[4.4,0.6,5.4]}/><meshStandardMaterial color="#221810" roughness={1}/></mesh>
      <mesh position={[0,1.8,0]} castShadow receiveShadow><boxGeometry args={[4,3.2,5]}/><meshStandardMaterial color="#3e2e1c" roughness={0.95}/></mesh>
      <mesh position={[0,3.9,0]} castShadow><coneGeometry args={[3.3,2.4,4]}/><meshStandardMaterial color="#1a1008" roughness={0.9}/></mesh>
      <mesh position={[0,1.0,2.52]}><boxGeometry args={[0.85,1.9,0.08]}/><meshStandardMaterial color="#18100a" roughness={0.8}/></mesh>
      <mesh position={[-1.2,1.9,2.52]}><boxGeometry args={[0.7,0.7,0.05]}/><meshStandardMaterial color="#9a8850" emissive="#6a5820" emissiveIntensity={2.5} roughness={0.3}/></mesh>
      <mesh position={[1.2,1.9,2.52]}><boxGeometry args={[0.7,0.7,0.05]}/><meshStandardMaterial color="#9a8850" emissive="#6a5820" emissiveIntensity={2.5} roughness={0.3}/></mesh>
      <mesh position={[1.3,4.6,-1]} castShadow><boxGeometry args={[0.5,1.8,0.5]}/><meshStandardMaterial color="#120c06" roughness={1}/></mesh>
      <pointLight color="#ff9933" intensity={5} distance={15} position={[0,1.5,3.2]}/>
    </group>
  );
}

// ── Shared Camera State ──────────────────────────────────────────
// Keep track of camera between scenes to prevent jumps
const globalCamPos = new THREE.Vector3(1.2, 2.0, 2.5);
const globalCamTarget = new THREE.Vector3(0, 1.6, -2);

// ── Scene 1: Village ─────────────────────────────────────────────
function Scene1({ t }: { t:number }) {
  const { camera } = useThree();
  const smokeRef = useRef<THREE.Mesh>(null!);

  useFrame((_, dt) => {
    let desiredPos = new THREE.Vector3();
    let desiredTarget = new THREE.Vector3();

    if (t < 5) {
      // Close-up pan around hero
      const angle = THREE.MathUtils.lerp(-0.5, 0.5, t/5);
      desiredPos.set(Math.sin(angle)*2, 2.0, Math.cos(angle)*2.5);
      desiredTarget.set(0, 1.6, 0);
    } else if (t < 10) {
      // Pull back smoothly
      const q = (t - 5) / 5;
      const ease = q * q * (3 - 2 * q); // smoothstep
      desiredPos.set(THREE.MathUtils.lerp(1, 5, ease), THREE.MathUtils.lerp(2, 3, ease), THREE.MathUtils.lerp(2.5, 7, ease));
      desiredTarget.set(0, 1.6, -5);
    } else {
      // Track behind running hero
      const hz = -2 - (t-10)*8;
      desiredPos.set(1.5, 2.8, hz + 5);
      desiredTarget.set(0, 1.5, hz - 8);
    }

    // Ultra-smooth camera dampening
    damp3(globalCamPos, desiredPos, 3, dt);
    damp3(globalCamTarget, desiredTarget, 3, dt);
    
    camera.position.copy(globalCamPos);
    camera.lookAt(globalCamTarget);
    
    const targetFov = t < 5 ? 45 : 55;
    camera.fov = THREE.MathUtils.damp(camera.fov, targetFov, 2, dt);
    camera.updateProjectionMatrix();

    if (smokeRef.current && t > 8) {
      smokeRef.current.scale.setScalar(Math.min((t-8)*0.5, 8));
      (smokeRef.current.material as THREE.MeshStandardMaterial).opacity = Math.min((t-8)*0.2, 0.95);
    }
  });

  const trees = useMemo(() => Array.from({length:40},(_,i) => ({
    p: [(10+Math.sin(i*17.3)*22)*(Math.sin(i*3.7)>0?1:-1), 0, -Math.abs(Math.sin(i*7.1))*100] as [number,number,number],
    s: 0.85+Math.sin(i*21.3)*0.5, seed: i
  })), []);

  return (
    <group>
      <Sky top="#0a0c16" mid="#151326" bot="#080712"/>
      <Stars/>
      <fog attach="fog" args={["#080712", 10, 80]}/>
      <ambientLight color="#1a2540" intensity={0.9}/>
      <directionalLight color="#dde8ff" intensity={5} position={[20,40,10]} castShadow shadow-mapSize={[2048,2048]} shadow-camera-far={150} shadow-camera-left={-50} shadow-camera-right={50} shadow-camera-top={50} shadow-camera-bottom={-50}/>
      
      {/* Village fires */}
      <pointLight color="#ff8833" intensity={15} distance={45} position={[0,5,-25]}/>
      <pointLight color="#ff5500" intensity={8} distance={25} position={[-10,3,-18]}/>

      <mesh rotation={[-Math.PI/2,0,0]} receiveShadow>
        <planeGeometry args={[200,200]}/><meshStandardMaterial color="#0c0f09" roughness={1}/>
      </mesh>
      <mesh rotation={[-Math.PI/2,0,0]} position={[0,0.02,-20]}>
        <planeGeometry args={[8,100]}/><meshStandardMaterial color="#110e08" roughness={0.88}/>
      </mesh>

      <House p={[-10,0,-12]} r={0.2}/>
      <House p={[12,0,-18]} r={-0.3} s={1.1}/>
      <House p={[-14,0,-28]} r={0.5} s={1.2}/>
      <House p={[10,0,-35]} r={-0.1} s={0.9}/>

      {trees.map((t,i) => <Tree key={i} {...t}/>)}

      <mesh ref={smokeRef} position={[0,4,-40]} scale={0}>
        <sphereGeometry args={[3,16,16]}/>
        <meshStandardMaterial color="#010101" transparent opacity={0} side={THREE.BackSide}/>
      </mesh>

      {t > 7 && <ProceduralBoss position={[0, 0, -35]} animState="Idle" />}

      <ProceduralHero 
        position={[0, 0, t > 10 ? -2-(t-10)*8 : -2]} 
        rotY={Math.PI} 
        animState={t > 10 ? "Run" : "Idle"} 
      />
      {/* Hero tracking light */}
      <pointLight color="#ffffff" intensity={5} distance={10} position={[0, 4, (t > 10 ? -2-(t-10)*8 : -2) + 2]}/>
    </group>
  );
}

// ── Scene 2: Forest Chase ────────────────────────────────────────
function Scene2({ t }: { t:number }) {
  const { camera } = useThree();
  const localT = t - SCENE_1_END;

  // Initialize camera pos at start of scene 2
  useEffect(() => {
    globalCamPos.set(1.5, 2.5, 3);
    globalCamTarget.set(0, 1.5, -5);
  }, []);

  useFrame((_, dt) => {
    const hz = -3 - localT*9;
    const hx = Math.sin(localT*1.2)*2.5; // frantic weaving
    
    // Dynamic tracking
    const desiredPos = new THREE.Vector3(hx + 1.2, 2.5 + Math.sin(localT*4)*0.15, hz + 5);
    const desiredTarget = new THREE.Vector3(hx, 1.5, hz - 8);
    
    damp3(globalCamPos, desiredPos, 4, dt);
    damp3(globalCamTarget, desiredTarget, 4, dt);
    
    camera.position.copy(globalCamPos);
    camera.lookAt(globalCamTarget);
    
    // Frantic zoom effect
    const targetFov = 65 + Math.sin(localT*2) * 5;
    camera.fov = THREE.MathUtils.damp(camera.fov, targetFov, 2, dt);
    camera.updateProjectionMatrix();
  });

  const trees = useMemo(() => Array.from({length:150},(_,i)=>{
    const fn = (n:number) => { const x=Math.sin(n*127.1+311.7)*43758.5453; return x-Math.floor(x); };
    return { p: [(fn(i)>0.5?1:-1)*(5+fn(i+1)*28), 0, -fn(i+2)*350] as [number,number,number], s:1+fn(i+3)*2.2, seed:i };
  }), []);

  return (
    <group>
      <Sky top="#010205" mid="#020308" bot="#010103"/>
      <fog attach="fog" args={["#010205", 3, 35]}/>
      <ambientLight color="#050a15" intensity={0.5}/>
      <directionalLight color="#223388" intensity={3} position={[-10,30,5]} castShadow shadow-mapSize={[2048,2048]}/>
      
      {/* Violent Lightning */}
      {localT % 6 < 0.15 && <pointLight color="#ddeeff" intensity={150} distance={300} position={[0,50,-100]}/>}
      {localT % 6 > 0.15 && localT % 6 < 0.2 && <pointLight color="#ddeeff" intensity={80} distance={300} position={[20,40,-80]}/>}

      <mesh rotation={[-Math.PI/2,0,0]} receiveShadow>
        <planeGeometry args={[100,400]}/><meshStandardMaterial color="#020402" roughness={1}/>
      </mesh>
      
      {trees.map((tr,i)=><Tree key={i} {...tr}/>)}

      <ProceduralHero 
        position={[Math.sin(localT*1.2)*2.5, 0, -3-localT*9]} 
        rotY={Math.PI + Math.sin(localT*1.2)*0.2} 
        animState="Run" 
      />
      <pointLight color="#ffffff" intensity={8} distance={8} position={[Math.sin(localT*1.2)*2.5, 4, -3-localT*9+2]}/>

      {/* Boss chasing */}
      {localT > 4 && (
        <ProceduralBoss position={[0, 0, -25-localT*9]} animState="Run" />
      )}
    </group>
  );
}

// ── Scene 3: Awakening ───────────────────────────────────────────
function Scene3({ t }: { t:number }) {
  const { camera } = useThree();
  const localT = t - SCENE_2_END;

  // Initialize camera pos at start of scene 3
  useEffect(() => {
    globalCamPos.set(0, 30, 25);
    globalCamTarget.set(0, 0, -5);
  }, []);

  useFrame((_, dt) => {
    // Slow sweeping descent
    const p = Math.min(localT/10, 1);
    const ease = 1 - Math.pow(1 - p, 3); // ease out cubic
    
    const desiredPos = new THREE.Vector3(Math.sin(localT*0.1)*6, THREE.MathUtils.lerp(25, 1.5, ease), THREE.MathUtils.lerp(20, 3, ease));
    const desiredTarget = new THREE.Vector3(0, 0, -2);
    
    damp3(globalCamPos, desiredPos, 1.5, dt); // Very slow dampening for majestic feel
    damp3(globalCamTarget, desiredTarget, 2, dt);
    
    camera.position.copy(globalCamPos);
    camera.lookAt(globalCamTarget);
    
    camera.fov = THREE.MathUtils.damp(camera.fov, 40, 1, dt);
    camera.updateProjectionMatrix();
  });

  const trees = useMemo(() => Array.from({length:120},(_,i)=>{
    const fn=(n:number)=>{const x=Math.sin(n*127.1+311.7)*43758.5453;return x-Math.floor(x);};
    const angle=fn(i)*Math.PI*2, r=12+fn(i+1)*50;
    return { p:[Math.cos(angle)*r,0,Math.sin(angle)*r-15] as [number,number,number], s:1.5+fn(i+2)*3,seed:i};
  }),[]);

  return (
    <group>
      <Sky top="#000411" mid="#000a1c" bot="#000108"/>
      <Stars/>
      <fog attach="fog" args={["#000411", 5, 80]}/>
      <ambientLight color="#00081a" intensity={0.4}/>
      
      {/* Deep forest magical lighting */}
      <pointLight color="#0044ff" intensity={20} distance={60} position={[0,3,-2]}/>
      <pointLight color="#0088ff" intensity={10} distance={120} position={[0,25,-20]}/>
      <directionalLight color="#aaccff" intensity={2} position={[15,30,20]} castShadow shadow-mapSize={[2048,2048]}/>

      <mesh rotation={[-Math.PI/2,0,0]} receiveShadow>
        <planeGeometry args={[250,250]}/><meshStandardMaterial color="#010402" roughness={1}/>
      </mesh>
      
      {/* Glowing Moss Ring */}
      <mesh rotation={[-Math.PI/2,0,0]} position={[0,0.02,0]}>
        <ringGeometry args={[0, 12, 64]}/>
        <meshStandardMaterial color="#002211" emissive="#004422" emissiveIntensity={3} roughness={1} transparent opacity={0.8}/>
      </mesh>

      {trees.map((tr,i)=><Tree key={i} {...tr}/>)}

      {/* Floating magical spores */}
      {Array.from({length:100},(_,i)=>(
        <mesh key={i} position={[Math.sin(i*1.9)*15, 0.5+Math.sin(i*2.7)*4, Math.cos(i*1.4)*15-5]}>
          <sphereGeometry args={[0.05,8,8]}/>
          <meshStandardMaterial color="#0066ff" emissive="#0088ff" emissiveIntensity={6}/>
        </mesh>
      ))}

      {/* Hero collapsed */}
      <ProceduralHero position={[0.5, 0, -2]} rotY={0.5} animState="LayDown" layDown />
    </group>
  );
}

// ── Main Cinematic Controller ────────────────────────────────────
function SceneController({ t }: { t:number }) {
  if (t < SCENE_1_END) return <Scene1 t={t}/>;
  if (t < SCENE_2_END) return <Scene2 t={t}/>;
  return <Scene3 t={t}/>;
}

const DIALOGUE = [
  { at:3,  end:7,  speaker:"Elena", text:"No! Help me! Elian, help!" },
  { at:9,  end:13, speaker:"Boss",  text:"She belongs to the Shadow now." },
  { at:12, end:16, speaker:"Hero",  text:"LET HER GO! ELENA!" },
  { at:18, end:24, speaker:"Hero",  text:"I'm coming... I won't lose you... not again..." },
  { at:34, end:41, speaker:"Hero",  text:"Elena...? Where... where am I...?" },
];

export function CinematicIntro({ onComplete }: { onComplete:()=>void }) {
  const [elapsed, setElapsed] = useState(0);
  const startRef = useRef(Date.now());
  const [scene, setScene] = useState(1);
  const [sceneLabel, setSceneLabel] = useState("The Shattered Peace");

  useEffect(() => {
    const id = setInterval(() => {
      const t = (Date.now()-startRef.current)/1000;
      setElapsed(t);
      if      (t < SCENE_1_END) { setScene(1); setSceneLabel("The Shattered Peace"); }
      else if (t < SCENE_2_END) { setScene(2); setSceneLabel("The Desperate Chase"); }
      else if (t < SCENE_3_END) { setScene(3); setSceneLabel("The Awakening"); }
      else { clearInterval(id); onComplete(); }
    }, 1000/60); // 60fps update
    return () => clearInterval(id);
  }, [onComplete]);

  const dlg = DIALOGUE.find(d => elapsed >= d.at && elapsed < d.end);

  return (
    <div style={{ position:"fixed", inset:0, background:"#000", zIndex:1000 }}>
      <Canvas
        style={{ position:"absolute", inset:0 }}
        shadows={{ type: THREE.PCFSoftShadowMap }}
        gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.5, outputColorSpace: THREE.SRGBColorSpace }}
      >
        <SceneController t={elapsed}/>
        <EffectComposer>
          <DepthOfField focusDistance={0.005} focalLength={0.08} bokehScale={4}/>
          <Bloom intensity={2.5} luminanceThreshold={0.2} luminanceSmoothing={0.9} mipmapBlur/>
          <Vignette eskil={false} offset={0.15} darkness={0.7}/>
          <Noise opacity={0.025}/>
        </EffectComposer>
      </Canvas>

      {/* Cinematic Overlays */}
      <div style={{ position:"absolute", top:0, left:0, right:0, height:"12vh", background:"#000" }}/>
      <div style={{ position:"absolute", bottom:0, left:0, right:0, height:"12vh", background:"#000" }}/>
      <div style={{ position:"absolute", inset:0, pointerEvents:"none", background:"radial-gradient(ellipse at center,transparent 35%,rgba(0,0,0,0.8) 100%)"}}/>

      {/* Scene Label */}
      <AnimatePresence mode="wait">
        <motion.div key={scene} initial={{ opacity:0, x:-20 }} animate={{ opacity:1, x:0 }} exit={{ opacity:0 }} transition={{ duration:1 }}
          style={{ position:"absolute", top:"14vh", left:"5vw", fontFamily:"var(--font-cinzel)", fontSize:"11px", letterSpacing:"0.5em", color:"rgba(255,255,255,0.5)", textTransform:"uppercase" }}>
          {`Scene ${scene} — ${sceneLabel}`}
        </motion.div>
      </AnimatePresence>

      {/* Title */}
      {elapsed > 38 && (
        <motion.div initial={{ opacity:0, scale:0.95 }} animate={{ opacity:1, scale:1 }} transition={{ duration:3, ease:"easeOut" }}
          style={{ position:"absolute", inset:0, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", pointerEvents:"none" }}>
          <div style={{ fontFamily:"var(--font-cinzel)", fontSize:"clamp(40px,8vw,120px)", letterSpacing:"0.3em", color:"#fff", textShadow:"0 0 80px rgba(0,80,255,0.9),0 0 150px rgba(0,30,200,0.5)" }}>
            DEEP FOREST
          </div>
          <div style={{ marginTop:"16px", fontFamily:"var(--font-mono)", fontSize:"13px", letterSpacing:"0.8em", color:"rgba(100,150,255,0.7)" }}>
            A DARK FANTASY RPG
          </div>
        </motion.div>
      )}

      {/* Dialogue */}
      <AnimatePresence>
        {dlg && (
          <motion.div key={dlg.at} initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:-10 }} transition={{ duration:0.4 }}
            style={{ position:"absolute", bottom:"15vh", left:0, right:0, display:"flex", flexDirection:"column", alignItems:"center", gap:"6px", padding:"0 10vw" }}>
            <div style={{ fontFamily:"var(--font-cinzel)", fontSize:"11px", letterSpacing:"0.4em", textTransform:"uppercase", opacity:0.85,
              color: dlg.speaker==="Boss"?"#ff3333": dlg.speaker==="Elena"?"#ffcc88":"#99ccff" }}>
              {dlg.speaker}
            </div>
            <div style={{ fontFamily:"serif", fontSize:"clamp(16px,2vw,24px)", color:"rgba(255,255,255,0.95)", textAlign:"center", textShadow:"0 3px 15px rgba(0,0,0,1)", fontStyle: dlg.speaker!=="Hero"?"italic":"normal" }}>
              &ldquo;{dlg.text}&rdquo;
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button onClick={onComplete} style={{ position:"absolute", bottom:"15vh", right:"5vw", background:"transparent", border:"1px solid rgba(255,255,255,0.2)", color:"rgba(255,255,255,0.4)", fontFamily:"var(--font-mono)", fontSize:"11px", letterSpacing:"0.3em", padding:"10px 20px", cursor:"pointer", textTransform:"uppercase" }}>
        SKIP ▶
      </button>
    </div>
  );
}
