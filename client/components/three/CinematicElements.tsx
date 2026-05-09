"use client";

import * as THREE from "three";
import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";

// ── Seeded random ──────────────────────────────────────────────
function sr(s: number) {
  const x = Math.sin(s * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
}

// ── Medieval House ──────────────────────────────────────────────
function House({ position, scale = 1, rotation = 0 }: {
  position: [number, number, number];
  scale?: number;
  rotation?: number;
}) {
  return (
    <group position={position} scale={scale} rotation={[0, rotation, 0]}>
      {/* Main walls */}
      <mesh position={[0, 1.6, 0]} castShadow receiveShadow>
        <boxGeometry args={[4, 3.2, 5]} />
        <meshStandardMaterial color="#4a3728" roughness={0.95} />
      </mesh>
      {/* Stone foundation */}
      <mesh position={[0, 0.3, 0]} castShadow receiveShadow>
        <boxGeometry args={[4.3, 0.6, 5.3]} />
        <meshStandardMaterial color="#2d2420" roughness={1} />
      </mesh>
      {/* Roof */}
      <mesh position={[0, 3.8, 0]} castShadow>
        <coneGeometry args={[3.2, 2.5, 4]} />
        <meshStandardMaterial color="#1e1510" roughness={0.9} />
      </mesh>
      {/* Door */}
      <mesh position={[0, 0.9, 2.52]} receiveShadow>
        <boxGeometry args={[0.9, 1.8, 0.1]} />
        <meshStandardMaterial color="#2a1a0e" roughness={0.8} />
      </mesh>
      {/* Window left */}
      <mesh position={[-1.2, 1.8, 2.52]}>
        <boxGeometry args={[0.7, 0.7, 0.05]} />
        <meshStandardMaterial color="#8a7a50" emissive="#443a1a" emissiveIntensity={0.5} roughness={0.5} />
      </mesh>
      {/* Window right */}
      <mesh position={[1.2, 1.8, 2.52]}>
        <boxGeometry args={[0.7, 0.7, 0.05]} />
        <meshStandardMaterial color="#8a7a50" emissive="#443a1a" emissiveIntensity={0.5} roughness={0.5} />
      </mesh>
      {/* Chimney */}
      <mesh position={[1.2, 4.5, -1]} castShadow>
        <boxGeometry args={[0.5, 1.5, 0.5]} />
        <meshStandardMaterial color="#1e1510" roughness={1} />
      </mesh>
      {/* Warm window glow */}
      <pointLight color="#ffaa44" intensity={1.5} distance={8} position={[0, 1.5, 2.5]} />
    </group>
  );
}

// ── Dark Armored Hero (matching reference image) ─────────────────
export function DarkArmoredHero({ position, scale = 1 }: {
  position: [number, number, number];
  scale?: number;
}) {
  const groupRef = useRef<THREE.Group>(null!);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (groupRef.current) {
      // Subtle idle sway
      groupRef.current.rotation.y = Math.sin(t * 0.3) * 0.05;
    }
  });

  return (
    <group ref={groupRef} position={position} scale={scale}>
      {/* Boots */}
      <mesh position={[-0.22, 0.25, 0]} castShadow>
        <boxGeometry args={[0.25, 0.5, 0.35]} />
        <meshStandardMaterial color="#0d0905" roughness={0.9} metalness={0.2} />
      </mesh>
      <mesh position={[0.22, 0.25, 0]} castShadow>
        <boxGeometry args={[0.25, 0.5, 0.35]} />
        <meshStandardMaterial color="#0d0905" roughness={0.9} metalness={0.2} />
      </mesh>

      {/* Legs — dark worn cloth */}
      <mesh position={[-0.18, 0.85, 0]} castShadow>
        <boxGeometry args={[0.28, 0.7, 0.3]} />
        <meshStandardMaterial color="#1a1208" roughness={0.95} />
      </mesh>
      <mesh position={[0.18, 0.85, 0]} castShadow>
        <boxGeometry args={[0.28, 0.7, 0.3]} />
        <meshStandardMaterial color="#1a1208" roughness={0.95} />
      </mesh>

      {/* Skirt/lower cloth (tattered) */}
      <mesh position={[0, 0.9, 0]} castShadow>
        <boxGeometry args={[0.65, 0.55, 0.35]} />
        <meshStandardMaterial color="#3d1a12" roughness={1} />
      </mesh>

      {/* Torso — dark jagged black armor */}
      <mesh position={[0, 1.55, 0]} castShadow>
        <boxGeometry args={[0.72, 0.9, 0.42]} />
        <meshStandardMaterial color="#0a0a0c" roughness={0.3} metalness={0.8} />
      </mesh>
      {/* Armor plates with red emissive cracks */}
      <mesh position={[0, 1.7, 0.22]} castShadow>
        <boxGeometry args={[0.55, 0.65, 0.05]} />
        <meshStandardMaterial color="#0d0d0f" roughness={0.2} metalness={0.9} emissive="#330000" emissiveIntensity={0.3} />
      </mesh>

      {/* Shoulders — jagged pauldrons */}
      <mesh position={[-0.52, 1.75, 0]} rotation={[0, 0, 0.3]} castShadow>
        <boxGeometry args={[0.32, 0.25, 0.4]} />
        <meshStandardMaterial color="#080808" roughness={0.2} metalness={0.9} />
      </mesh>
      <mesh position={[0.52, 1.75, 0]} rotation={[0, 0, -0.3]} castShadow>
        <boxGeometry args={[0.32, 0.25, 0.4]} />
        <meshStandardMaterial color="#080808" roughness={0.2} metalness={0.9} />
      </mesh>
      {/* Shoulder spikes */}
      <mesh position={[-0.6, 1.95, 0]} rotation={[0, 0, -0.3]} castShadow>
        <coneGeometry args={[0.06, 0.35, 6]} />
        <meshStandardMaterial color="#060606" roughness={0.2} metalness={0.9} />
      </mesh>
      <mesh position={[0.6, 1.95, 0]} rotation={[0, 0, 0.3]} castShadow>
        <coneGeometry args={[0.06, 0.35, 6]} />
        <meshStandardMaterial color="#060606" roughness={0.2} metalness={0.9} />
      </mesh>

      {/* Arms */}
      <mesh position={[-0.5, 1.4, 0]} castShadow>
        <boxGeometry args={[0.22, 0.65, 0.22]} />
        <meshStandardMaterial color="#0c0c0e" roughness={0.3} metalness={0.8} />
      </mesh>
      <mesh position={[0.5, 1.4, 0]} castShadow>
        <boxGeometry args={[0.22, 0.65, 0.22]} />
        <meshStandardMaterial color="#0c0c0e" roughness={0.3} metalness={0.8} />
      </mesh>

      {/* Gauntlets */}
      <mesh position={[-0.5, 1.0, 0]} castShadow>
        <boxGeometry args={[0.24, 0.28, 0.24]} />
        <meshStandardMaterial color="#080808" roughness={0.2} metalness={0.95} />
      </mesh>
      <mesh position={[0.5, 1.0, 0]} castShadow>
        <boxGeometry args={[0.24, 0.28, 0.24]} />
        <meshStandardMaterial color="#080808" roughness={0.2} metalness={0.95} />
      </mesh>

      {/* Neck */}
      <mesh position={[0, 2.08, 0]} castShadow>
        <cylinderGeometry args={[0.12, 0.15, 0.25, 8]} />
        <meshStandardMaterial color="#0f0d0b" roughness={0.8} />
      </mesh>

      {/* Head/Helm base */}
      <mesh position={[0, 2.42, 0]} castShadow>
        <boxGeometry args={[0.44, 0.48, 0.42]} />
        <meshStandardMaterial color="#080808" roughness={0.2} metalness={0.9} />
      </mesh>
      {/* Crown spikes on helmet */}
      {[-0.16, -0.05, 0, 0.05, 0.16].map((x, i) => (
        <mesh key={i} position={[x, 2.72, 0]} castShadow>
          <coneGeometry args={[0.04, 0.2 + i * 0.04, 5]} />
          <meshStandardMaterial color="#060606" roughness={0.2} metalness={0.95} />
        </mesh>
      ))}
      {/* Red glowing eyes */}
      <mesh position={[-0.12, 2.44, 0.22]}>
        <boxGeometry args={[0.07, 0.04, 0.02]} />
        <meshStandardMaterial color="#ff2200" emissive="#ff2200" emissiveIntensity={4} />
      </mesh>
      <mesh position={[0.12, 2.44, 0.22]}>
        <boxGeometry args={[0.07, 0.04, 0.02]} />
        <meshStandardMaterial color="#ff2200" emissive="#ff2200" emissiveIntensity={4} />
      </mesh>

      {/* Cape — dark flowing */}
      <mesh position={[0, 1.55, -0.32]} rotation={[0.15, 0, 0]} castShadow>
        <boxGeometry args={[0.65, 1.3, 0.06]} />
        <meshStandardMaterial color="#0f0a08" roughness={1} side={THREE.DoubleSide} />
      </mesh>

      {/* Red glowing cracks on armor */}
      <pointLight color="#ff1100" intensity={1.5} distance={2} position={[0, 1.5, 0.3]} />
    </group>
  );
}

// ── Procedural Sky ───────────────────────────────────────────────
export function DramaticSky({ stormy = false }: { stormy?: boolean }) {
  const skyRef = useRef<THREE.Mesh>(null!);

  const skyMat = useMemo(() => {
    const mat = new THREE.ShaderMaterial({
      side: THREE.BackSide,
      uniforms: {
        topColor:    { value: new THREE.Color(stormy ? "#040810" : "#0d1a2e") },
        midColor:    { value: new THREE.Color(stormy ? "#0a0a14" : "#1a1a3a") },
        bottomColor: { value: new THREE.Color(stormy ? "#050308" : "#0a0510") },
        horizon:     { value: 0.35 },
      },
      vertexShader: `
        varying vec3 vWorldPos;
        void main() {
          vec4 worldPos = modelMatrix * vec4(position, 1.0);
          vWorldPos = worldPos.xyz;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 topColor;
        uniform vec3 midColor;
        uniform vec3 bottomColor;
        uniform float horizon;
        varying vec3 vWorldPos;
        void main() {
          float h = normalize(vWorldPos).y;
          vec3 col = mix(bottomColor, midColor, smoothstep(-0.1, horizon, h));
          col = mix(col, topColor, smoothstep(horizon, 1.0, h));
          gl_FragColor = vec4(col, 1.0);
        }
      `,
    });
    return mat;
  }, [stormy]);

  // Slowly rotate stars
  useFrame((_, dt) => {
    if (skyRef.current) skyRef.current.rotation.y += dt * 0.002;
  });

  return (
    <mesh ref={skyRef}>
      <sphereGeometry args={[280, 32, 32]} />
      <primitive object={skyMat} attach="material" />
    </mesh>
  );
}

// ── Stars ────────────────────────────────────────────────────────
export function Stars() {
  const positions = useMemo(() => {
    const p = new Float32Array(1500 * 3);
    for (let i = 0; i < 1500; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 250 + Math.random() * 20;
      p[i*3]   = r * Math.sin(phi) * Math.cos(theta);
      p[i*3+1] = r * Math.sin(phi) * Math.sin(theta);
      p[i*3+2] = r * Math.cos(phi);
    }
    return p;
  }, []);
  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial color="#ffffff" size={0.4} transparent opacity={0.8} sizeAttenuation />
    </points>
  );
}

// ── Village Scene ────────────────────────────────────────────────
export function VillageScene() {
  return (
    <group>
      <DramaticSky stormy={false} />
      <Stars />

      {/* Moonlight */}
      <directionalLight color="#c8d8ff" intensity={2.5} position={[20, 40, 15]} castShadow
        shadow-mapSize={[2048, 2048]} shadow-camera-far={100}
        shadow-camera-left={-30} shadow-camera-right={30}
        shadow-camera-top={30} shadow-camera-bottom={-30}
      />
      <ambientLight color="#0a0d1a" intensity={0.4} />
      <pointLight color="#ff6600" intensity={3} distance={25} position={[0, 4, -20]} />

      {/* Ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[120, 120]} />
        <meshStandardMaterial color="#0d100a" roughness={1} />
      </mesh>
      {/* Dirt path */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, -10]}>
        <planeGeometry args={[8, 60]} />
        <meshStandardMaterial color="#120e08" roughness={0.9} />
      </mesh>

      {/* Houses */}
      <House position={[-10, 0, -10]} scale={1.1} rotation={0.2} />
      <House position={[11, 0, -14]} scale={1.0} rotation={-0.3} />
      <House position={[-13, 0, -24]} scale={1.3} rotation={0.5} />
      <House position={[12, 0, -28]} scale={0.9} rotation={-0.1} />
      <House position={[-8, 0, -38]} scale={1.2} rotation={0.8} />
      <House position={[10, 0, -40]} scale={1.0} rotation={-0.4} />

      {/* Trees around village */}
      {Array.from({ length: 30 }, (_, i) => {
        const x = (sr(i) > 0.5 ? 1 : -1) * (14 + sr(i+1) * 18);
        const z = -sr(i+2) * 70;
        return (
          <group key={i} position={[x, 0, z]} scale={0.9 + sr(i+3) * 1.4} rotation={[0, sr(i+4) * Math.PI * 2, 0]}>
            <mesh position={[0, 2.5, 0]} castShadow>
              <cylinderGeometry args={[0.2, 0.4, 5, 8]} />
              <meshStandardMaterial color="#1a0d08" roughness={1} />
            </mesh>
            <mesh position={[0, 5.5, 0]} castShadow>
              <sphereGeometry args={[2.2, 10, 10]} />
              <meshStandardMaterial color={["#0d2b0d", "#102e10", "#0a1f0a"][i % 3]} roughness={0.9} flatShading />
            </mesh>
          </group>
        );
      })}

      {/* Cobblestone well */}
      <mesh position={[0, 0.5, -8]} castShadow>
        <cylinderGeometry args={[0.7, 0.8, 1, 12]} />
        <meshStandardMaterial color="#2a2420" roughness={1} />
      </mesh>
    </group>
  );
}

// ── Forest Scene (for scene 2) ───────────────────────────────────
export function DarkForestScene() {
  return (
    <group>
      <DramaticSky stormy />
      {/* No stars in storm */}

      <ambientLight color="#070c14" intensity={0.3} />
      <directionalLight color="#3355aa" intensity={1.5} position={[-10, 25, 5]} castShadow />

      {/* Ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[100, 300]} />
        <meshStandardMaterial color="#040a04" roughness={1} />
      </mesh>

      {/* Dense trees */}
      {Array.from({ length: 100 }, (_, i) => {
        const x = (sr(i) > 0.5 ? 1 : -1) * (5 + sr(i+1) * 22);
        const z = -sr(i+2) * 250;
        return (
          <group key={i} position={[x, 0, z]} scale={1 + sr(i+3) * 1.8} rotation={[0, sr(i+4) * Math.PI * 2, 0]}>
            <mesh position={[0, 2.5, 0]} castShadow>
              <cylinderGeometry args={[0.2, 0.4, 5, 7]} />
              <meshStandardMaterial color="#0d0806" roughness={1} />
            </mesh>
            <mesh position={[0, 5.5, 0]} castShadow>
              <sphereGeometry args={[2.2, 8, 8]} />
              <meshStandardMaterial color="#061006" roughness={0.9} flatShading />
            </mesh>
          </group>
        );
      })}
    </group>
  );
}

// ── Mystical Forest Scene (for scene 3) ─────────────────────────
export function MysticalForestScene() {
  return (
    <group>
      <DramaticSky stormy={false} />
      <Stars />

      <ambientLight color="#000d20" intensity={0.3} />
      <pointLight color="#0033ff" intensity={6} distance={50} position={[0, 3, -5]} />
      <pointLight color="#0055ff" intensity={3} distance={80} position={[0, 15, -20]} />

      {/* Glowing moss ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[150, 150]} />
        <meshStandardMaterial color="#020705" roughness={1} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
        <circleGeometry args={[8, 32]} />
        <meshStandardMaterial color="#003320" emissive="#004433" emissiveIntensity={2} roughness={1} />
      </mesh>

      {/* Ancient massive trees */}
      {Array.from({ length: 120 }, (_, i) => {
        const angle = sr(i) * Math.PI * 2;
        const r = 8 + sr(i+1) * 55;
        const x = Math.cos(angle) * r;
        const z = Math.sin(angle) * r - 20;
        return (
          <group key={i} position={[x, 0, z]} scale={1.2 + sr(i+2) * 2.5} rotation={[0, sr(i+3) * Math.PI * 2, 0]}>
            <mesh position={[0, 3, 0]} castShadow>
              <cylinderGeometry args={[0.3, 0.6, 8, 8]} />
              <meshStandardMaterial color="#080d08" roughness={1} />
            </mesh>
            <mesh position={[0, 7, 0]} castShadow>
              <sphereGeometry args={[2.8, 10, 10]} />
              <meshStandardMaterial color="#040d04" roughness={0.9} flatShading />
            </mesh>
            {/* Blue glow on some trees */}
            {i % 5 === 0 && <pointLight color="#0044ff" intensity={1} distance={6} position={[0, 1, 0]} />}
          </group>
        );
      })}

      {/* Ancient stone ruins */}
      {[[-12, 0, -18], [10, 0, -24], [-8, 0, -35], [14, 0, -12]] .map(([x, y, z], i) => (
        <mesh key={i} position={[x, y + 2, z]} rotation={[0, sr(i) * 0.5, sr(i+1) * 0.2]} castShadow>
          <boxGeometry args={[1.2, 4 + sr(i)*2, 1.2]} />
          <meshStandardMaterial color="#12121e" roughness={1} />
        </mesh>
      ))}
    </group>
  );
}

export { House };
