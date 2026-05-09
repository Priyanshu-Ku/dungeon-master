'use client';

import React, { useRef, useEffect, useState, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Stars, Html } from '@react-three/drei';
import { useDungeonStore } from '@/store/dungeonStore';
import { useCombatStore } from '@/store/combatStore';
import * as THREE from 'three';
import { PlayerCharacter } from './PlayerCharacter';
import { Wizard } from './Wizard';
import { useDialogueStore } from '@/store/dialogueStore';
import { prefetchAllDialogue, playPreloadedAudio } from '@/utils/voice';
import { useProblemStore, Problem } from '@/store/problemStore';
import { useProgressionStore } from '@/store/progressionStore';
import { EnemyNPC } from './EnemyNPC';

// Two Sum problem presented by the Wizard
const TWO_SUM_PROBLEM: Problem = {
  id: 'wizard_challenge_two_sum',
  title: 'Two Sum',
  difficulty: 'Easy',
  fnName: 'twoSum',
  timeLimit: 300,
  description: `Given an array of integers nums and a target integer target, return the indices of the two numbers that add up to target.

• Each input has exactly one solution
• You may not use the same element twice
• Return indices in any order

---

EXAMPLE 1
Input:  nums = [2, 7, 11, 15], target = 9
Output: [0, 1]
Because nums[0] + nums[1] = 2 + 7 = 9

EXAMPLE 2
Input:  nums = [3, 2, 4], target = 6
Output: [1, 2]

---

CONSTRAINTS
2 ≤ nums.length ≤ 10⁴
-10⁹ ≤ nums[i] ≤ 10⁹
-10⁹ ≤ target ≤ 10⁹`,
  starterCode: `/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
function twoSum(nums, target) {
  // Write your solution here
  
};`,
  testCases: [
    { input: '[2,7,11,15], 9',  expected: '[0,1]',  status: 'pending' },
    { input: '[3,2,4], 6',      expected: '[1,2]',  status: 'pending' },
    { input: '[3,3], 6',        expected: '[0,1]',  status: 'pending' },
  ],
};

// --- DIALOGUE SEQUENCE ---
const DIALOGUE_SEQUENCE = [
  { speaker: "Wizard", text: "Halt, traveler. You seek the echoes of the lost?" },
  { speaker: "Player", text: "I seek my daughter. Are you the keeper of this realm?" },
  { speaker: "Wizard", text: "A heavy burden indeed. The fragments of truth are scattered. But a cipher guards the next path. Prove your worth." },
  { speaker: "Player", text: "A cipher? Show it to me." },
  { speaker: "Wizard", text: "Very well. Align the resonance." }
];

const POST_SOLVE_DIALOGUE_SEQUENCE = [
  { speaker: "Wizard", text: "Brilliant. You have unraveled the cipher with flawless logic." },
  { speaker: "Player", text: "The resonance is stable. Now, honor our bargain. Where is she?" },
  { speaker: "Wizard", text: "Patience. Drink from this well of knowledge. Your strength grows." },
  { speaker: "Player", text: "I feel the surge... But my daughter. Which way?" },
  { speaker: "Wizard", text: "Venture deeper into the Obsidian Depths. The shadowed path to the North-East holds the echoes you seek. Go." }
];

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

// Simple procedural stone component
function ForestStone({ position, scale = 1, rotation = 0 }: { position: [number, number, number]; scale?: number; rotation?: number }) {
  return (
    <mesh position={position} rotation={[0, rotation, 0]} scale={[scale, scale, scale]} castShadow receiveShadow>
      <dodecahedronGeometry args={[0.5, 1]} />
      <meshStandardMaterial color="#555" roughness={0.9} metalness={0.1} />
    </mesh>
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

// Bonfire component with fire effect
function Bonfire({ position }: { position: [number, number, number] }) {
  const lightRef = useRef<THREE.PointLight>(null);
  
  useFrame((state) => {
    if (lightRef.current) {
      // Flickering effect
      lightRef.current.intensity = 2 + Math.sin(state.clock.elapsedTime * 10) * 0.5;
    }
  });

  return (
    <group position={position}>
      {/* Logs */}
      <mesh position={[0, 0.1, 0]} rotation={[Math.PI / 2, 0, 0.5]}>
        <cylinderGeometry args={[0.05, 0.05, 0.8, 6]} />
        <meshStandardMaterial color="#3d2b1f" />
      </mesh>
      <mesh position={[0, 0.1, 0]} rotation={[Math.PI / 2, 0, -0.5]}>
        <cylinderGeometry args={[0.05, 0.05, 0.8, 6]} />
        <meshStandardMaterial color="#3d2b1f" />
      </mesh>
      
      {/* Flames (stylized) */}
      <mesh position={[0, 0.3, 0]}>
        <coneGeometry args={[0.2, 0.6, 8]} />
        <meshStandardMaterial color="#ff4500" emissive="#ff4500" emissiveIntensity={5} transparent opacity={0.8} />
      </mesh>
      
      {/* Light Source */}
      <pointLight ref={lightRef} color="#ff8c00" intensity={2} distance={8} decay={2} castShadow />
      
      {/* Emissive glow at base */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
        <circleGeometry args={[1, 32]} />
        <meshStandardMaterial color="#ff4500" transparent opacity={0.1} />
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

const STONE_DATA: Array<{ pos: [number, number, number]; s: number; r: number }> = [
  { pos: [-12, 0, -5], s: 0.9, r: 0.4 }, { pos: [5, 0, 12], s: 1.1, r: 1.2 },
  { pos: [-5, 0, -15], s: 0.8, r: 2.1 }, { pos: [14, 0, 6], s: 1.2, r: 0.8 },
  { pos: [-10, 0, 14], s: 0.95, r: 3.1 }, { pos: [12, 0, -12], s: 1.1, r: 1.5 },
  { pos: [-15, 0, -2], s: 1.3, r: 0.2 }, { pos: [3, 0, -8], s: 0.85, r: 2.7 }
];

const DAUGHTER_CAMP_POS: [number, number, number] = [25, 0, -25];

export function DungeonExplorer() {
  const { camera, gl } = useThree();
  const { currentRoomId, getConnectedRooms, initiateTransition } = useDungeonStore();
  
  const setActiveDialogue = useCombatStore(state => state.setActiveDialogue);
  const isDialogueActive = useCombatStore(state => !!state.activeDialogueLine);
  const isCodingChallengeOpen = useCombatStore(state => state.showCodingChallenge);
  const triggerPostSolveDialogue = useCombatStore(state => state.triggerPostSolveDialogue);
  const setShowCheckpointNotif = useCombatStore(state => state.setShowCheckpointNotif);
  const setPlayerMapPos = useCombatStore(state => state.setPlayerMapPos);
  const showDaughterLocation = useCombatStore(state => state.showDaughterLocation);
  const setShowDaughterLocation = useCombatStore(state => state.setShowDaughterLocation);
  const { setCombatPhase } = useCombatStore();
  
  const { wizardCheckpointReached, setWizardCheckpointReached, hasHydrated } = useProgressionStore();
  const { setProblem } = useProblemStore();
  const { startDialogue } = useDialogueStore();

  const [isMoving, setIsMoving] = useState(false);
  const [inMagicCircle, setInMagicCircle] = useState(false);
  
  const introPlayedRef = useRef(false);
  const inMagicCircleRef = useRef(false);
  const checkpointReachedRef = useRef(false);

  // Initialize from persistent checkpoint
  useEffect(() => {
    if (wizardCheckpointReached) {
      // Spawn near Wizard instead of start
      playerPos.current.set(-5, 0, -5);
      setShowDaughterLocation(true);
    }
  }, [wizardCheckpointReached, setShowDaughterLocation]);

  // Initial player thought
  useEffect(() => {
    if (introPlayedRef.current || wizardCheckpointReached) {
      console.log("[Intro] Skipping intro audio. introPlayed:", introPlayedRef.current, "checkpointReached:", wizardCheckpointReached);
      return;
    }
    introPlayedRef.current = true;

    const playIntro = async () => {
      console.log("[Intro] Starting player monologue...");
      try {
        const mod = await import('@/utils/voice');
        await mod.playDialogueVoice(
          "Where am I... what is this insect moving around me?",
          "Player"
        );
        
        console.log("[Intro] Part 1 complete. Waiting 3s...");
        await new Promise(resolve => setTimeout(resolve, 3000));
        
        await mod.playDialogueVoice(
          "Is it guiding me?",
          "Player"
        );
        console.log("[Intro] Player monologue complete.");
      } catch (err) {
        console.error("[Intro] Failed to play intro audio:", err);
      }
    };
    playIntro();
  }, [wizardCheckpointReached]);

  // Keep refs in sync with state
  useEffect(() => { inMagicCircleRef.current = inMagicCircle; }, [inMagicCircle]);
  useEffect(() => { checkpointReachedRef.current = wizardCheckpointReached; }, [wizardCheckpointReached]);

  const grassTufts = useMemo(() => {
    return Array.from({ length: 60 }).map((_, i) => {
      const angle = (i / 60) * Math.PI * 2;
      const r = 3 + Math.random() * 16;
      const x = Math.cos(angle + i * 0.7) * r;
      const z = Math.sin(angle + i * 1.1) * r;
      return { x, z, rotation: Math.random() * Math.PI };
    });
  }, []);

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
    const handleLockChange = () => {};
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
      if (isDialogueActive) return; // Prevent state changes during dialogue
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

  // Handle POST-SOLVE Dialogue Sequence
  useEffect(() => {
    if (triggerPostSolveDialogue) {
      console.log("[Interaction] Post-solve triggered. Starting post-solve conversation...");
      useCombatStore.getState().setTriggerPostSolveDialogue(false); // consume flag

      const runPostSolve = async () => {
        try {
          const audioCache = await prefetchAllDialogue(POST_SOLVE_DIALOGUE_SEQUENCE);
          moveState.current = { forward: false, backward: false, left: false, right: false, sprint: false };
          setIsMoving(false);
          
          for (let i = 0; i < POST_SOLVE_DIALOGUE_SEQUENCE.length; i++) {
            const line = POST_SOLVE_DIALOGUE_SEQUENCE[i];
            const audio = audioCache[i];
            setActiveDialogue(line.text, line.speaker);
            await playPreloadedAudio(audio);
            await new Promise(resolve => setTimeout(resolve, 400));
          }
          console.log("[Conversation] Post-solve sequence complete.");
          setWizardCheckpointReached(true);
          setShowDaughterLocation(true);
        } catch (error) {
          console.error("[Conversation] Error in post-solve:", error);
        } finally {
          setActiveDialogue(null, null);
        }
      };

      runPostSolve();
    }
  }, [triggerPostSolveDialogue, setActiveDialogue, setWizardCheckpointReached, setShowDaughterLocation]);

  const handleInteraction = async () => {
    console.log("[Interaction] Key E pressed. inMagicCircle:", inMagicCircleRef.current, "checkpointReached:", checkpointReachedRef.current);
    
    if (inMagicCircleRef.current && !checkpointReachedRef.current) {
      console.log("[Interaction] Checkpoint reached — showing notification...");
      setWizardCheckpointReached(true);
      checkpointReachedRef.current = true;

      // Show checkpoint toast + prefetch audio in parallel (no wasted time)
      setShowCheckpointNotif(true);
      const prefetchPromise = prefetchAllDialogue(DIALOGUE_SEQUENCE);

      // Wait for the notification to be seen (2.5s), then start
      await new Promise(resolve => setTimeout(resolve, 2500));
      setShowCheckpointNotif(false);

      // Audio should be ready by now (prefetch ran during the 2.5s)
      const audioCache = await prefetchPromise;
      startConversationWithCache(audioCache).catch(console.error);
    }
  };

  const startConversationWithCache = async (audioCache: Array<HTMLAudioElement | null>) => {
    console.log("[Conversation] Starting playback...");
    try {
      moveState.current = { forward: false, backward: false, left: false, right: false, sprint: false };
      setIsMoving(false);

      for (let i = 0; i < DIALOGUE_SEQUENCE.length; i++) {
        const line = DIALOGUE_SEQUENCE[i];
        const audio = audioCache[i];
        console.log(`[Conversation] Line ${i}: ${line.speaker}`);
        setActiveDialogue(line.text, line.speaker);
        await playPreloadedAudio(audio);
        await new Promise(resolve => setTimeout(resolve, 400));
      }
      console.log("[Conversation] Sequence complete.");
    } catch (error) {
      console.error("[Conversation] Error:", error);
    } finally {
      setActiveDialogue(null, null);
      // Load problem and open the coding challenge overlay
      setProblem(TWO_SUM_PROBLEM);
      useCombatStore.getState().setShowCodingChallenge(true);

      // Play background voiceover for the problem
      import('@/utils/voice').then(mod => {
        mod.playDialogueVoice(
          "Two ancient runes are hidden across this wall of stones. Their combined power must equal the sacred number I seek. Return to me the positions of those two runes — and the passage shall open.",
          "Wizard"
        );
      });
    }
  };

  // Keep old function name for any catch reference
  const startBackgroundConversation = async () => {
    const audioCache = await prefetchAllDialogue(DIALOGUE_SEQUENCE);
    await startConversationWithCache(audioCache);
  };

  useFrame((state, delta) => {
    // Freeze movement during dialogue OR coding challenge
    if (isDialogueActive || isCodingChallengeOpen) {
      // Still update camera to maintain focus, but no movement
      camera.position.lerp(
        new THREE.Vector3(
          playerPos.current.x + Math.sin(currentCameraAngle.current.yaw) * cameraDistance * Math.cos(currentCameraAngle.current.pitch),
          playerPos.current.y + Math.sin(currentCameraAngle.current.pitch) * cameraDistance + 1.2,
          playerPos.current.z + Math.cos(currentCameraAngle.current.yaw) * cameraDistance * Math.cos(currentCameraAngle.current.pitch)
        ),
        0.1
      );
      camera.lookAt(playerPos.current.x, playerPos.current.y + 1.2, playerPos.current.z);
      return;
    }

    const speed = moveState.current.sprint ? 12 : 6;
    const damping = 10;

    velocity.current.x -= velocity.current.x * damping * delta;
    velocity.current.z -= velocity.current.z * damping * delta;

    const inputX = Number(moveState.current.right) - Number(moveState.current.left);
    const inputZ = Number(moveState.current.forward) - Number(moveState.current.backward);

    // Update player position for minimap
    setPlayerMapPos({ x: playerPos.current.x, z: playerPos.current.z });

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
    setInMagicCircle(distToCircle < 2.5); // Very generous radius for easier interaction
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
      {grassTufts.map((tuft, i) => (
        <mesh key={i} position={[tuft.x, 0.15, tuft.z]} rotation={[0, tuft.rotation, 0]}>
          <coneGeometry args={[0.08, 0.4, 4]} />
          <meshStandardMaterial color="#2A5C18" roughness={0.9} />
        </mesh>
      ))}

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

      {/* Guiding Firefly - only show while exploring and before checkpoint (wait for hydration to avoid flicker) */}
      {!isDialogueActive && !isCodingChallengeOpen && hasHydrated && !wizardCheckpointReached && (
        <GuidingFirefly playerPos={playerPos} />
      )}






      {/* Interaction prompt */}
      {inMagicCircle && !wizardCheckpointReached && (
        <Html center position={[0, 2, 0]}>
          <div style={{ 
            color: 'white', 
            background: 'rgba(0,0,0,0.8)', 
            padding: '8px 16px', 
            borderRadius: '4px',
            border: '1px solid gold',
            whiteSpace: 'nowrap'
          }}>
            Press [E] to Talk
          </div>
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

      {/* ── STONES ── */}
      {STONE_DATA.map((stone, i) => (
        <ForestStone key={`s${i}`} position={stone.pos} scale={stone.s} rotation={stone.r} />
      ))}

      {/* ── ENEMY CAMP (Daughter's Location) ── */}
      {showDaughterLocation && (
        <group position={DAUGHTER_CAMP_POS}>
          <Bonfire position={[0, 0, 0]} />
          {/* Sleeping Enemy */}
          <EnemyNPC 
            position={[2, 0, 1]} 
            rotation={[0, Math.PI / 3, 0]} 
            scale={[1.5, 1.5, 1.5]} 
          />
          {/* Dense forest cluster around camp */}
          <ForestTree position={[-4, 0, -3]} scale={1.2} />
          <ForestTree position={[4, 0, -4]} scale={0.9} />
          <ForestTree position={[1, 0, 5]} scale={1.1} />
          <ForestTree position={[-5, 0, 3]} scale={0.8} />
          
          <ForestStone position={[-1.5, 0, -1.5]} scale={0.6} r={0} />
          <ForestStone position={[1.8, 0, -2]} scale={0.5} r={1} />
          <ForestStone position={[3, 0, 2]} scale={0.7} r={2} />
          <ForestStone position={[-3, 0, 4]} scale={0.4} r={3} />
        </group>
      )}

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
