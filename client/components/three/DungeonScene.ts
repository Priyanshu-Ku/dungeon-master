import * as THREE from "three";

export class DungeonScene {
  public scene: THREE.Scene;
  public floor: THREE.Mesh;

  constructor() {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color("#05040A");
    this.scene.fog = new THREE.FogExp2("#05040A", 0.08);

    // Floor
    const floorGeo = new THREE.PlaneGeometry(50, 50);
    const floorMat = new THREE.MeshStandardMaterial({ 
      color: "#1E1A35",
      roughness: 0.8,
      metalness: 0.2
    });
    this.floor = new THREE.Mesh(floorGeo, floorMat);
    this.floor.rotation.x = -Math.PI / 2;
    this.floor.receiveShadow = true;
    this.scene.add(this.floor);

    // Lighting
    const ambient = new THREE.AmbientLight("#7C3AED", 0.2);
    this.scene.add(ambient);

    const point = new THREE.PointLight("#F0A500", 2, 20);
    point.position.set(2, 5, 2);
    point.castShadow = true;
    this.scene.add(point);
  }
}
