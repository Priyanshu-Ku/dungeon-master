"use client";

import { useState, Suspense, useEffect } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import * as THREE from "three";

import { SceneLighting } from "./SceneLighting";
import { NeonGrid } from "./NeonGrid";
import { DungeonEnvironment } from "./DungeonEnvironment";
import { PlayerCharacter } from "./PlayerCharacter";
import { FloatingDSANodes } from "./FloatingDSANodes";
import { PortalDoor } from "./PortalDoor";
import { DungeonHUD3D } from "./DungeonHUD3D";

// Set scene background color using R3F hook
function SceneSetup() {
  const { scene, gl, camera } = useThree();
  useEffect(() => {
    scene.background = new THREE.Color("#0a0618");
    gl.toneMappingExposure = 2.5;
    // Orient camera to look down the corridor (-Z)
    camera.lookAt(0, 1, -10);
  }, [scene, gl, camera]);
  return null;
}

export function GameScene3D() {
  const [activeChallengeLabel, setActiveChallengeLabel] = useState<string | null>(null);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
      }}
    >
      {/* ── Three.js Canvas — fixed fullscreen ── */}
      <Canvas
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
        shadows={false}
        gl={{
          antialias: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 2.5,
          outputColorSpace: THREE.SRGBColorSpace,
        }}
        camera={{
          fov: 75,
          near: 0.1,
          far: 120,
          position: [0, 2.5, 3],
        }}
      >
        <SceneSetup />

        {/* Atmospheric fog — starts further out so corridor is visible */}
        <fog attach="fog" args={["#0a0618", 20, 70]} />

        {/* Lighting */}
        <SceneLighting />

        {/* Scene content */}
        <Suspense fallback={null}>
          {/* Floor grid */}
          <NeonGrid />

          {/* Dungeon geometry */}
          <DungeonEnvironment />

          {/* Test Red Cube */}
          <mesh position={[0, 2, -2]}>
            <boxGeometry args={[1, 1, 1]} />
            <meshBasicMaterial color="red" />
          </mesh>

          {/* Player character + WASD + Camera */}
          {/* <PlayerCharacter /> */}

          {/* Floating DSA challenge nodes */}
          <FloatingDSANodes
            onChallengeActivate={(label) => setActiveChallengeLabel(label)}
          />

          {/* Portal door at corridor end */}
          <PortalDoor />
        </Suspense>
      </Canvas>

      {/* ── 2D HUD overlay ── */}
      <DungeonHUD3D
        activeChallengeLabel={activeChallengeLabel}
        onClearChallenge={() => setActiveChallengeLabel(null)}
      />

      {/* ── Vignette ── */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          zIndex: 40,
          background:
            "radial-gradient(ellipse at center, transparent 45%, rgba(5,4,10,0.75) 100%)",
        }}
      />
    </div>
  );
}
