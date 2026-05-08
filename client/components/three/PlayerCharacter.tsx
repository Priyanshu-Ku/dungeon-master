"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { useGLTF, useAnimations, useFBX } from "@react-three/drei";
import * as THREE from "three";

const MODEL_PATH = "/models/player.glb";
const ANIM_IDLE = "/animations/idle.fbx";
const ANIM_WALK = "/animations/walk.fbx";

const MOVE_SPEED = 5;
const ROTATION_SPEED = 2.5;
const CAMERA_DISTANCE = 5;
const CAMERA_HEIGHT = 2.5;
const CAMERA_LERP = 0.1;

// Global key state — no re-renders on keypress
const keys: Record<string, boolean> = {};

export function PlayerCharacter({
  onPositionChange,
}: {
  onPositionChange?: (pos: THREE.Vector3) => void;
}) {
  const groupRef = useRef<THREE.Group>(null!);
  const { camera } = useThree();

  // ── Load GLB model
  const { scene: model, animations: glbAnims } = useGLTF(MODEL_PATH);

  // ── Load FBX animations separately
  const idleFbx = useFBX(ANIM_IDLE);
  const walkFbx = useFBX(ANIM_WALK);

  // ── Rename and merge animations
  const allAnims = [...glbAnims];
  if (idleFbx.animations[0]) {
    idleFbx.animations[0].name = "Idle";
    allAnims.push(idleFbx.animations[0]);
  }
  if (walkFbx.animations[0]) {
    walkFbx.animations[0].name = "Walk";
    allAnims.push(walkFbx.animations[0]);
  }

  const { actions } = useAnimations(allAnims, groupRef);

  const [currentAnim, setCurrentAnim] = useState("Idle");
  const isMovingRef = useRef(false);
  const yawRef = useRef(0);

  // ── Scale model to look right (Mixamo ~1.8m = 1.8 units target)
  useEffect(() => {
    if (model) {
      // Auto-compute bounding box to set correct scale
      const box = new THREE.Box3().setFromObject(model);
      const height = box.max.y - box.min.y;
      if (height > 0) {
        const targetHeight = 1.8;
        const scaleFactor = targetHeight / height;
        model.scale.setScalar(scaleFactor);
      }

      // Enable shadows on all meshes
      model.traverse((child) => {
        if ((child as THREE.Mesh).isMesh) {
          child.castShadow = true;
        }
      });
    }
  }, [model]);

  // ── Keyboard listeners
  useEffect(() => {
    const onDown = (e: KeyboardEvent) => {
      keys[e.code] = true;
      e.preventDefault(); // prevent page scroll on WASD
    };
    const onUp = (e: KeyboardEvent) => { keys[e.code] = false; };
    window.addEventListener("keydown", onDown, { passive: false });
    window.addEventListener("keyup", onUp);
    return () => {
      window.removeEventListener("keydown", onDown);
      window.removeEventListener("keyup", onUp);
    };
  }, []);

  // ── Play initial animation
  useEffect(() => {
    const idle = actions["Idle"] ?? actions[Object.keys(actions)[0]];
    if (idle) {
      idle.reset().fadeIn(0.3).play();
    }
  }, [actions]);

  // ── Switch animation helper
  const switchAnim = useCallback(
    (name: string) => {
      if (currentAnim === name) return;
      const next = actions[name];
      const current = actions[currentAnim];
      if (!next) return;
      current?.fadeOut(0.2);
      next.reset().fadeIn(0.2).play();
      setCurrentAnim(name);
    },
    [actions, currentAnim]
  );

  // ── Camera smoothing state — initialized BEHIND player looking into corridor
  const camPos = useRef(new THREE.Vector3(0.5, 2.5, 3));
  const camLookAt = useRef(new THREE.Vector3(0, 1.2, -5));

  useFrame((_, delta) => {
    if (!groupRef.current) return;

    const player = groupRef.current;
    let moving = false;

    // A/D — rotate (yaw)
    if (keys["KeyA"] || keys["ArrowLeft"]) {
      yawRef.current += ROTATION_SPEED * delta;
      moving = true;
    }
    if (keys["KeyD"] || keys["ArrowRight"]) {
      yawRef.current -= ROTATION_SPEED * delta;
      moving = true;
    }

    // Apply rotation
    player.rotation.y = yawRef.current;

    // W/S — move along facing direction
    if (keys["KeyW"] || keys["ArrowUp"]) {
      const forward = new THREE.Vector3(
        -Math.sin(yawRef.current),
        0,
        -Math.cos(yawRef.current)
      ).multiplyScalar(MOVE_SPEED * delta);

      const next = player.position.clone().add(forward);
      next.x = THREE.MathUtils.clamp(next.x, -4, 4);
      next.z = THREE.MathUtils.clamp(next.z, -47, 1);
      player.position.copy(next);
      moving = true;
    }
    if (keys["KeyS"] || keys["ArrowDown"]) {
      const backward = new THREE.Vector3(
        Math.sin(yawRef.current),
        0,
        Math.cos(yawRef.current)
      ).multiplyScalar(MOVE_SPEED * delta);

      const next = player.position.clone().add(backward);
      next.x = THREE.MathUtils.clamp(next.x, -4, 4);
      next.z = THREE.MathUtils.clamp(next.z, -47, 1);
      player.position.copy(next);
      moving = true;
    }

    // ── Animation switch
    if (moving !== isMovingRef.current) {
      isMovingRef.current = moving;
      switchAnim(moving ? "Walk" : "Idle");
    }

    // ── Dark Souls over-shoulder camera
    const px = player.position.x;
    const py = player.position.y;
    const pz = player.position.z;
    const yaw = yawRef.current;

    const desiredX = px + Math.sin(yaw) * CAMERA_DISTANCE + 0.5;
    const desiredY = py + CAMERA_HEIGHT;
    const desiredZ = pz + Math.cos(yaw) * CAMERA_DISTANCE;

    camPos.current.lerp(
      new THREE.Vector3(desiredX, desiredY, desiredZ),
      CAMERA_LERP
    );
    camera.position.copy(camPos.current);

    // Look at player chest level
    camLookAt.current.lerp(
      new THREE.Vector3(px, py + 1.2, pz),
      CAMERA_LERP * 1.5
    );
    camera.lookAt(camLookAt.current);

    onPositionChange?.(player.position.clone());
  });

  return (
    <group ref={groupRef} position={[0, 0, -2]}>
      <primitive
        object={model}
        rotation={[0, Math.PI, 0]}
        castShadow
      />
    </group>
  );
}

// Preload assets
useGLTF.preload(MODEL_PATH);
