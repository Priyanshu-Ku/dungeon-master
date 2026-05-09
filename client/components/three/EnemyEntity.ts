import * as THREE from "three";

export class EnemyEntity {
  public mesh: THREE.Mesh;

  constructor(scene: THREE.Scene) {
    const geometry = new THREE.BoxGeometry(1.5, 1.5, 1.5);
    const material = new THREE.MeshStandardMaterial({ 
      color: "#F87171", 
      emissive: "#F87171", 
      emissiveIntensity: 0.5 
    });
    this.mesh = new THREE.Mesh(geometry, material);
    this.mesh.position.set(5, 0.75, -10);
    this.mesh.castShadow = true;
    scene.add(this.mesh);
  }
}
