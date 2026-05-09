import * as THREE from "three";
import { DungeonScene } from "./DungeonScene";
import { PlayerController } from "./PlayerController";
import { EnemyEntity } from "./EnemyEntity";

export class SceneManager {
  private renderer: THREE.WebGLRenderer;
  private camera: THREE.PerspectiveCamera;
  private dungeon: DungeonScene;
  private player: PlayerController;
  private enemy: EnemyEntity;
  private timer: THREE.Timer;

  constructor(container: HTMLElement) {
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setSize(container.clientWidth, container.clientHeight);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.shadowMap.enabled = true;
    container.appendChild(this.renderer.domElement);

    this.camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
    this.camera.position.set(0, 5, 10);
    this.camera.lookAt(0, 0, 0);

    this.dungeon = new DungeonScene();
    this.player = new PlayerController(this.dungeon.scene, this.camera);
    this.enemy = new EnemyEntity(this.dungeon.scene);
    this.timer = new THREE.Timer();

    this.animate();
  }

  private animate = () => {
    requestAnimationFrame(this.animate);
    this.timer.update();
    const delta = this.timer.getDelta();
    this.player.update(delta);
    this.renderer.render(this.dungeon.scene, this.camera);
  };

  public dispose() {
    this.renderer.dispose();
  }
}
