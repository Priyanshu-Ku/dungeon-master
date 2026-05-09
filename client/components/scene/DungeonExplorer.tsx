'use client';

import React, { useRef, useEffect, useState, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Stars, Html } from '@react-three/drei';
import { useDungeonStore } from '@/store/dungeonStore';
import { useCombatStore } from '@/store/combatStore';
import * as THREE from 'three';
import { PlayerCharacter } from './PlayerCharacter';
import { Wizard } from './Wizard';

// --- GEOMETRY UTILS ---
function createForestFloorGeo() {
  const geo = new THREE.PlaneGeometry(80, 80, 16, 16);
  geo.rotateX(-Math.PI / 2);
  // Subtle vertex displacement for organic feel
  const posArr = geo.attributes.position.array as Float32Array;
  for (let i = 0; i < posArr.length; i += 3) {
    const x = posArr[i];
    const z = posArr[i + 2];
    posArr[i + 1] = Math.sin(x * 0.3) * 0.08 + Math.cos(z * 0.4) * 0.06;
  }
  geo.computeVertexNormals();
  return geo;
}

function createTrunkGeo() {
  return new THREE.CylinderGeometry(0.22, 0.35, 5, 10);
}
function createCanopyGeo(r: number) {
  return new THREE.SphereGeometry(r, 10, 8);
}

// Single procedural tree component
function ForestTree({ position, scale = 1 }: { position: [number, number, number]; scale?: number }) {
  const trunkGeo = useMemo(createTrunkGeo, []);
  const canopy1 = useMemo(() => createCanopyGeo(1.8 * scale), [scale]);
  const canopy2 = useMemo(() => createCanopyGeo(1.4 * scale), [scale]);
  const canopy3 = useMemo(() => createCanopyGeo(1.1 * scale), [scale]);

  const trunkColor = '#4A2E10';
  const foliageBase = '#1A5C1A';
  const foliageMid = '#237523';
  const foliageTip = '#2E9E2E';

  return (
    <group position={position} scale={[scale, scale, scale]}>
      {/* Trunk */}
      <mesh geometry={trunkGeo} castShadow receiveShadow position={[0, 2.5, 0]}>
        <meshStandardMaterial color={trunkColor} roughness={0.95} metalness={0} />
      </mesh>

      {/* Root buttresses */}
      {[0, Math.PI / 2, Math.PI, (3 * Math.PI) / 2].map((angle, i) => (
        <mesh key={i} position={[Math.sin(angle) * 0.4, 0.3, Math.cos(angle) * 0.4]} castShadow>
          <cylinderGeometry args={[0.12, 0.28, 0.8, 6]} />
          <meshStandardMaterial color={trunkColor} roughness={0.95} metalness={0} />
        </mesh>
      ))}

      {/* Canopy — layered spheres */}
      <mesh geometry={canopy1} castShadow position={[0, 5.5, 0]}>
        <meshStandardMaterial color={foliageBase} roughness={0.85} metalness={0} />
      </mesh>
      <mesh geometry={canopy2} castShadow position={[0.4, 7, 0.3]}>
        <meshStandardMaterial color={foliageMid} roughness={0.8} metalness={0} />
      </mesh>
      <mesh geometry={canopy3} castShadow position={[-0.3, 8.2, -0.2]}>
        <meshStandardMaterial color={foliageTip} roughness={0.75} metalness={0} />
      </mesh>

      {/* Firefly glow at canopy */}
      <pointLight position={[0, 6, 0]} intensity={0.6} color="#A8FF78" distance={8} decay={2} />
    </group>
  );
}

// Main trees with glowing node
function ForestTreeWithNode({ position, scale = 1 }: { position: [number, number, number]; scale?: number }) {
  return (
    <group>
      <ForestTree position={position} scale={scale} />
    </group>
  );
}

// Magic Circle under the Wizard
function MagicCircle({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      {/* Outer Glow Ring */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
        <ringGeometry args={[0.6, 0.7, 64]} />
        <meshStandardMaterial color="#FFD700" emissive="#FFD700" emissiveIntensity={4} transparent opacity={0.8} />
      </mesh>

      {/* Inner Decorative Circle */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.03, 0]}>
        <ringGeometry args={[0.3, 0.4, 32]} />
        <meshStandardMaterial color="#FFA500" emissive="#FFA500" emissiveIntensity={2} transparent opacity={0.5} />
      </mesh>

      {/* Vertical Light Beam (The "Line") */}
      <mesh position={[0, 1, 0]}>
        <cylinderGeometry args={[0.02, 0.02, 2, 16]} />
        <meshStandardMaterial color="#FFD700" emissive="#FFD700" emissiveIntensity={10} transparent opacity={0.2} />
      </mesh>
    </group>
  );
}

// Guiding Firefly that leads the player to the wizard
function GuidingFirefly({ playerPos }: { playerPos: React.MutableRefObject<THREE.Vector3> }) {
  const fireflyRef = useRef<THREE.Group>(null);
  const wizardPos = useMemo(() => new THREE.Vector3(-10, 1.2, -10), []);

  useFrame((state, delta) => {
    if (!fireflyRef.current) return;

    // Distance to wizard
    const dist = playerPos.current.distanceTo(wizardPos);

    let targetPos = new THREE.Vector3();

    if (dist < 4) {
      // If close to wizard, flutter around the wizard
      targetPos.copy(wizardPos);
      targetPos.y += 1 + Math.sin(state.clock.elapsedTime * 2) * 0.5;
      targetPos.x += Math.cos(state.clock.elapsedTime * 1.5) * 1.5;
      targetPos.z += Math.sin(state.clock.elapsedTime * 1.5) * 1.5;
    } else {
      // Vector from player to wizard
      const dirToWizard = new THREE.Vector3().subVectors(wizardPos, playerPos.current).normalize();

      // Base center is slightly shifted towards the wizard so it favors that direction
      targetPos.copy(playerPos.current).add(dirToWizard.multiplyScalar(1.5));

      // Add a large sweeping orbit so it flies in circles completely around the player
      const orbitRadius = 2.5;
      const orbitSpeed = 2;
      targetPos.x += Math.cos(state.clock.elapsedTime * orbitSpeed) * orbitRadius;
      targetPos.z += Math.sin(state.clock.elapsedTime * orbitSpeed) * orbitRadius;

      // Add height so it hovers at chest/eye level with smooth bobbing
      targetPos.y = 1.2 + Math.sin(state.clock.elapsedTime * 3) * 0.5;
    }

    // Smoothly interpolate to target position
    fireflyRef.current.position.lerp(targetPos, 3 * delta);
  });

  return (
    <group ref={fireflyRef}>
      <mesh>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshStandardMaterial color="#FFD700" emissive="#FFEA00" emissiveIntensity={5} toneMapped={false} />
      </mesh>
      <pointLight color="#FFEA00" intensity={1.5} distance={6} decay={2} />
    </group>
  );
}

// Perimeter trees for forest density
const PERIMETER_TREES: Array<{ pos: [number, number, number]; s: number }> = [
  { pos: [-18, 0, -18], s: 1.3 }, { pos: [18, 0, -18], s: 1.1 },
  { pos: [-18, 0, 18], s: 1.2 }, { pos: [18, 0, 18], s: 1.4 },
  { pos: [0, 0, -22], s: 1.0 }, { pos: [-22, 0, 0], s: 1.2 },
  { pos: [22, 0, 0], s: 1.1 }, { pos: [0, 0, 22], s: 0.9 },
  { pos: [-12, 0, -20], s: 0.85 }, { pos: [12, 0, -20], s: 0.9 },
  { pos: [-20, 0, -10], s: 1.0 }, { pos: [20, 0, 10], s: 1.05 },
  { pos: [15, 0, -14], s: 0.8 }, { pos: [-15, 0, 14], s: 0.95 },
];

// Main feature trees (replacing pillars)
const FEATURE_TREES: Array<[number, number, number]> = [
  [-8, 0, -8], [8, 0, -8], [-8, 0, 8], [8, 0, 8], [0, 0, -15],
];

export function DungeonExplorer() {
  const { camera, gl } = useThree();
  const { currentRoomId, getConnectedRooms, initiateTransition } = useDungeonStore();
  const { setCombatPhase } = useCombatStore();

  const [isMoving, setIsMoving] = useState(false);
  const [checkpointReached, setCheckpointReached] = useState(false);
  const [inMagicCircle, setInMagicCircle] = useState(false);
  const [showCheckpointMessage, setShowCheckpointMessage] = useState(false);
  const [dialogue, setDialogue] = useState("");

  // Camera Orbit State (Smooth Interpolation)
  const targetCameraAngle = useRef({ yaw: 0, pitch: 0.3 });
  const currentCameraAngle = useRef({ yaw: 0, pitch: 0.3 });
  const cameraDistance = 6.5;
  const playerPos = useRef(new THREE.Vector3(0, 0, 5));
  const playerRot = useRef(new THREE.Euler(0, 0, 0));
  const velocity = useRef(new THREE.Vector3());
  const moveState = useRef({ forward: false, backward: false, left: false, right: false, sprint: false });

  // Mouse handling
  useEffect(() => {
    const handleLockChange = () => setIsLocked(document.pointerLockElement === gl.domElement);
    const handleCanvasClick = () => {
      if (document.pointerLockElement !== gl.domElement) {
        gl.domElement.requestPointerLock();
      }
    };

    gl.domElement.requestPointerLock();

    const handleMouseMove = (e: MouseEvent) => {
      if (!document.pointerLockElement) return;
      const sensitivity = 0.002;
      targetCameraAngle.current.yaw -= e.movementX * sensitivity;
      targetCameraAngle.current.pitch -= e.movementY * sensitivity;
      targetCameraAngle.current.pitch = Math.max(-Math.PI / 2.1, Math.min(Math.PI / 2.1, targetCameraAngle.current.pitch));
    };

    document.addEventListener('pointerlockchange', handleLockChange);
    document.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('click', handleCanvasClick);

    return () => {
      document.removeEventListener('pointerlockchange', handleLockChange);
      document.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('click', handleCanvasClick);
    };
  }, [gl]);

  // Keyboard listeners
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.code) {
        case 'KeyW': moveState.current.forward = true; break;
        case 'KeyS': moveState.current.backward = true; break;
        case 'KeyA': moveState.current.left = true; break;
        case 'KeyD': moveState.current.right = true; break;
        case 'ShiftLeft': moveState.current.sprint = true; break;
        case 'KeyE': handleInteraction(); break;
      }
      setIsMoving(
        moveState.current.forward ||
        moveState.current.backward ||
        moveState.current.left ||
        moveState.current.right
      );
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      switch (e.code) {
        case 'KeyW': moveState.current.forward = false; break;
        case 'KeyS': moveState.current.backward = false; break;
        case 'KeyA': moveState.current.left = false; break;
        case 'KeyD': moveState.current.right = false; break;
        case 'ShiftLeft': moveState.current.sprint = false; break;
      }
      setIsMoving(
        moveState.current.forward ||
        moveState.current.backward ||
        moveState.current.left ||
        moveState.current.right
      );
    };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  const handleInteraction = () => {
    // Check if in magic circle for checkpoint
    if (inMagicCircle && !checkpointReached) {
      setShowCheckpointMessage(true);
      setTimeout(() => {
        setShowCheckpointMessage(false);
        setCheckpointReached(true);
        setDialogue("Greetings, traveler. You have found me in the depths of the ancient woods. I have been waiting for you...");
      }, 2000);
      return;
    }

    const connected = getConnectedRooms(currentRoomId || '');
    const nearest = connected[0];
    if (nearest) {
      if (['COMBAT', 'ELITE', 'BOSS_FINAL'].includes(nearest.type)) {
        setCombatPhase('BOSS_CINEMATIC');
      } else {
        initiateTransition(nearest.id);
      }
    }
  };

  useFrame((state, delta) => {
    const speed = moveState.current.sprint ? 12 : 6;
    const damping = 10;

    velocity.current.x -= velocity.current.x * damping * delta;
    velocity.current.z -= velocity.current.z * damping * delta;

    const inputX = Number(moveState.current.right) - Number(moveState.current.left);
    const inputZ = Number(moveState.current.forward) - Number(moveState.current.backward);

    if (inputX !== 0 || inputZ !== 0) {
      const forward = new THREE.Vector3(0, 0, -1);
      forward.applyEuler(new THREE.Euler(0, targetCameraAngle.current.yaw, 0));

      const side = new THREE.Vector3().crossVectors(new THREE.Vector3(0, 1, 0), forward).normalize();

      const moveDir = new THREE.Vector3()
        .addScaledVector(forward, inputZ)
        .addScaledVector(side, inputX)
        .normalize();

      velocity.current.addScaledVector(moveDir, speed * 20 * delta);

      const targetAngle = Math.atan2(moveDir.x, moveDir.z);
      let angleDiff = targetAngle - playerRot.current.y;
      while (angleDiff > Math.PI) angleDiff -= Math.PI * 2;
      while (angleDiff < -Math.PI) angleDiff += Math.PI * 2;
      playerRot.current.y += angleDiff * 0.15;
    }

    playerPos.current.addScaledVector(velocity.current, delta);

    currentCameraAngle.current.yaw = THREE.MathUtils.lerp(currentCameraAngle.current.yaw, targetCameraAngle.current.yaw, 0.1);
    currentCameraAngle.current.pitch = THREE.MathUtils.lerp(currentCameraAngle.current.pitch, targetCameraAngle.current.pitch, 0.1);

    const targetCamPos = new THREE.Vector3(
      playerPos.current.x + cameraDistance * Math.sin(currentCameraAngle.current.yaw) * Math.cos(currentCameraAngle.current.pitch),
      playerPos.current.y + 2.8 + cameraDistance * Math.sin(currentCameraAngle.current.pitch),
      playerPos.current.z + cameraDistance * Math.cos(currentCameraAngle.current.yaw) * Math.cos(currentCameraAngle.current.pitch)
    );

    if (targetCamPos.y < 0.5) targetCamPos.y = 0.5;

    camera.position.lerp(targetCamPos, 0.2);
    camera.lookAt(playerPos.current.x, playerPos.current.y + 1.5, playerPos.current.z);

    // Checkpoint detection logic
    const circlePos = new THREE.Vector3(-9, 0, -11);
    const distToCircle = playerPos.current.distanceTo(circlePos);
    setInMagicCircle(distToCircle < 1.0);
  });

  const floorGeo = useMemo(createForestFloorGeo, []);

  return (
    <group>
      {/* Forest Atmosphere Fog — deep woodland green */}
      <fog attach="fog" args={['#0D1A0A', 8, 40]} />

      {/* Forest Floor — mossy organic ground */}
      <mesh receiveShadow geometry={floorGeo}>
        <meshStandardMaterial color="#1C3A12" roughness={0.95} metalness={0} />
      </mesh>

      {/* Grass tufts scattered on floor */}
      {Array.from({ length: 60 }).map((_, i) => {
        const angle = (i / 60) * Math.PI * 2;
        const r = 3 + Math.random() * 16;
        const x = Math.cos(angle + i * 0.7) * r;
        const z = Math.sin(angle + i * 1.1) * r;
        return (
          <mesh key={i} position={[x, 0.15, z]} rotation={[0, Math.random() * Math.PI, 0]}>
            <coneGeometry args={[0.08, 0.4, 4]} />
            <meshStandardMaterial color="#2A5C18" roughness={0.9} />
          </mesh>
        );
      })}

      {/* Player Model */}
      <PlayerCharacter
        position={[playerPos.current.x, 0, playerPos.current.z]}
        rotation={[0, playerRot.current.y, 0]}
        moving={isMoving}
      />

      {/* Wizard NPC - Suspended at player height, hidden behind a tree */}
      <Wizard position={[-10, 1.2, -10]} scale={[2.5, 2.5, 2.5]} rotation={[0, Math.PI / 4, 0]} />

      {/* Magic Circle under the Wizard */}
      <MagicCircle position={[-9, 0, -11]} />

      {/* Guiding Firefly */}
      <GuidingFirefly playerPos={playerPos} />


      {/* ── INTERACTION PROMPT ── */}
      {inMagicCircle && !checkpointReached && !showCheckpointMessage && (
        <Html center>
          <div style={{
            background: 'rgba(0,0,0,0.7)',
            color: 'white',
            padding: '10px 20px',
            borderRadius: '5px',
            border: '1px solid gold',
            fontSize: '14px',
            fontWeight: 'bold',
            transform: 'translateY(-100px)'
          }}>
            Press [E] to Interact
          </div>
        </Html>
      )}

      {/* ── CHECKPOINT MESSAGE ── */}
      {showCheckpointMessage && (
        <Html center>
          <div style={{
            background: 'rgba(0, 100, 0, 0.8)',
            color: 'white',
            padding: '20px 40px',
            borderRadius: '10px',
            border: '3px solid #00FF00',
            fontSize: '24px',
            fontWeight: 'bold',
            textAlign: 'center',
            boxShadow: '0 0 30px rgba(0, 255, 0, 0.5)',
            animation: 'checkpointPop 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
          }}>
            <span style={{ fontSize: '32px', display: 'block' }}>✨ CHECKPOINT ✨</span>
            UNLOCKED
          </div>
          <style>{`
            @keyframes checkpointPop {
              0% { transform: scale(0.5) translateY(50px); opacity: 0; }
              100% { transform: scale(1) translateY(0); opacity: 1; }
            }
          `}</style>
        </Html>
      )}

      {/* ── DIALOGUE UI ── */}
      {checkpointReached && dialogue && !showCheckpointMessage && (
        <Html center>
          <div style={{
            background: 'rgba(0, 0, 0, 0.8)',
            color: 'gold',
            padding: '20px',
            borderRadius: '10px',
            border: '2px solid gold',
            width: '350px',
            textAlign: 'center',
            fontFamily: 'serif',
            fontSize: '18px',
            boxShadow: '0 0 20px rgba(255, 215, 0, 0.3)',
            animation: 'fadeIn 0.5s ease-out'
          }}>
            <h3 style={{ margin: '0 0 10px 0', borderBottom: '1px solid gold', paddingBottom: '5px' }}>The Ancient Wizard</h3>
            <p style={{ margin: 0, fontStyle: 'italic', lineHeight: '1.4' }}>"{dialogue}"</p>
            <button
              onClick={() => setDialogue("")}
              style={{
                marginTop: '15px',
                background: 'gold',
                border: 'none',
                padding: '8px 20px',
                borderRadius: '5px',
                cursor: 'pointer',
                fontWeight: 'bold',
                transition: 'transform 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              Continue
            </button>
          </div>
          <style>{`
            @keyframes fadeIn {
              from { opacity: 0; transform: translateY(20px); }
              to { opacity: 1; transform: translateY(0); }
            }
          `}</style>
        </Html>
      )}


      {/* ── FEATURE TREES (replacing pillars) ── */}
      {FEATURE_TREES.map((pos, i) => (
        <ForestTreeWithNode key={i} position={pos} scale={1.1} />
      ))}

      {/* ── PERIMETER TREES for forest density ── */}
      {PERIMETER_TREES.map(({ pos, s }, i) => (
        <ForestTree key={`p${i}`} position={pos} scale={s} />
      ))}

      {/* Fallen log accent */}
      <mesh position={[3, 0.2, 3]} rotation={[0, 0.6, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.25, 0.3, 3.5, 8]} />
        <meshStandardMaterial color="#3B1F0A" roughness={0.98} metalness={0} />
      </mesh>
      <mesh position={[-5, 0.15, 1]} rotation={[0, -0.8, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.2, 0.28, 2.8, 8]} />
        <meshStandardMaterial color="#3B1F0A" roughness={0.98} metalness={0} />
      </mesh>

      {/* Stars visible through canopy */}
      <Stars radius={60} depth={20} count={800} factor={3} saturation={0.3} fade speed={0.5} />

      {/* ── LIGHTING ── */}
      {/* Ambient — soft moonlit forest */}
      <ambientLight intensity={0.35} color="#2A4A1A" />
      {/* Primary sun shaft — warm golden */}
      <directionalLight
        position={[15, 30, 10]}
        intensity={1.2}
        color="#FFD580"
        castShadow
      />
      {/* Secondary moon fill — cool blue */}
      <directionalLight position={[-10, 20, -15]} intensity={0.4} color="#A0C8FF" />
      {/* Ground bounce — subtle green */}
      <hemisphereLight args={['#A8FF78', '#1C3A12', 0.3]} />
    </group>
  );
}
