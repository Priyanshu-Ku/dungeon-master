import * as THREE from "three";
import { GLTFLoader } from "three-stdlib";

export class PlayerController {
  private scene: THREE.Scene;
  private camera: THREE.Camera;
  private model: THREE.Group | null = null;
  private mixer: THREE.AnimationMixer | null = null;
  private animations: { [key: string]: THREE.AnimationAction } = {};
  private currentAction: THREE.AnimationAction | null = null;
  
  private moveSpeed = 5;
  private rotationSpeed = 3;
  private keys: { [key: string]: boolean } = {};
  
  // Camera settings
  private cameraOffset = new THREE.Vector3(0, 3, 6);
  private cameraTarget = new THREE.Vector3();
  private lerpFactor = 0.1;

  constructor(scene: THREE.Scene, camera: THREE.Camera) {
    this.scene = scene;
    this.camera = camera;
    this.setupInput();
    this.loadModel();
  }

  private setupInput() {
    window.addEventListener("keydown", (e) => (this.keys[e.code] = true));
    window.addEventListener("keyup", (e) => (this.keys[e.code] = false));
  }

  private loadModel() {
    const loader = new GLTFLoader();
    // Assuming the player model is at /models/player.glb as identified in previous analysis
    loader.load("/models/player.glb", (gltf) => {
      this.model = gltf.scene;
      this.model.scale.setScalar(1.0); // Adjust based on model scale
      this.model.traverse((child) => {
        if ((child as THREE.Mesh).isMesh) {
          child.castShadow = true;
        }
      });
      this.scene.add(this.model);

      this.mixer = new THREE.AnimationMixer(this.model);
      
      // Map animations - assuming standard Mixamo names or similar in GLB
      gltf.animations.forEach((clip) => {
        const action = this.mixer!.clipAction(clip);
        this.animations[clip.name.toLowerCase()] = action;
      });

      // Default state
      this.fadeToAction("idle", 0);
    }, undefined, (error) => {
      console.error("Error loading player model:", error);
      // Fallback: Create a box if model fails (though requested no placeholders, safety first)
      const geo = new THREE.BoxGeometry(1, 2, 1);
      const mat = new THREE.MeshStandardMaterial({ color: 0x7c3aed });
      this.model = new THREE.Group();
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.y = 1;
      this.model.add(mesh);
      this.scene.add(this.model);
    });
  }

  private fadeToAction(name: string, duration: number = 0.3) {
    const nextAction = this.animations[name];
    if (nextAction && nextAction !== this.currentAction) {
      if (this.currentAction) {
        this.currentAction.fadeOut(duration);
      }
      nextAction.reset().fadeIn(duration).play();
      this.currentAction = nextAction;
    }
  }

  public update(delta: number) {
    if (!this.model) return;

    let moving = false;
    const direction = new THREE.Vector3();

    if (this.keys["KeyW"]) {
      direction.z -= 1;
      moving = true;
    }
    if (this.keys["KeyS"]) {
      direction.z += 1;
      moving = true;
    }
    if (this.keys["KeyA"]) {
      direction.x -= 1;
      moving = true;
    }
    if (this.keys["KeyD"]) {
      direction.x += 1;
      moving = true;
    }

    if (moving) {
      direction.normalize();
      
      // Move player
      const moveVec = direction.applyQuaternion(this.model.quaternion).multiplyScalar(this.moveSpeed * delta);
      this.model.position.add(moveVec);
      
      // Constrain to floor (50x50)
      this.model.position.x = THREE.MathUtils.clamp(this.model.position.x, -24, 24);
      this.model.position.z = THREE.MathUtils.clamp(this.model.position.z, -24, 24);

      // Animation
      this.fadeToAction("walk");
      
      // Rotate model to face direction (optional, if using free movement)
      // For standard tank controls or direct forward/back:
      // this.model.rotation.y += (this.keys["KeyA"] ? 1 : this.keys["KeyD"] ? -1 : 0) * this.rotationSpeed * delta;
    } else {
      this.fadeToAction("idle");
    }

    if (this.mixer) {
      this.mixer.update(delta);
    }

    this.updateCamera();
  }

  private updateCamera() {
    if (!this.model) return;

    // Calculate desired camera position
    const relativeOffset = this.cameraOffset.clone().applyQuaternion(this.model.quaternion);
    const targetPos = this.model.position.clone().add(relativeOffset);
    
    // Lerp camera position
    this.camera.position.lerp(targetPos, this.lerpFactor);
    
    // Lock Y height at 3
    this.camera.position.y = 3;

    // Look at player chest/head level
    this.cameraTarget.copy(this.model.position).y += 1.5;
    this.camera.lookAt(this.cameraTarget);
  }
}
