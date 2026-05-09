import * as THREE from 'three';

/**
 * BossMaterial
 * High-fidelity obsidian skin with rim sweep (Phase 1) and death dissolve (Phase 3).
 */

const vertexShader = /* glsl */ `
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vViewPosition;
  varying float vWorldY;

  void main() {
    vUv = uv;
    vNormal = normalize(normalMatrix * normal);
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    vViewPosition = -mvPosition.xyz;
    
    vec4 worldPos = modelMatrix * vec4(position, 1.0);
    vWorldY = worldPos.y;
    
    gl_Position = projectionMatrix * mvPosition;
  }
`;

const fragmentShader = /* glsl */ `
  uniform float u_time;
  uniform float u_hitFlash;
  uniform float u_hitIntensity;
  uniform float u_dissolveAmount;
  uniform float u_rimProgress;
  uniform float u_rimActive;
  uniform float u_bossHeight;

  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vViewPosition;
  varying float vWorldY;

  // Simple noise for dissolve
  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    float a = hash(i);
    float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0));
    float d = hash(i + vec2(1.0, 1.0));
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
  }

  void main() {
    // 0. Dissolve Logic
    float n = noise(vUv * 10.0 + u_time * 0.05);
    if (n < u_dissolveAmount) discard;
    
    // Dissolve edge glow (Accent Orange #FF6B35 fallback for boss death)
    float border = smoothstep(u_dissolveAmount, u_dissolveAmount + 0.04, n);
    vec3 edgeColor = vec3(1.0, 0.42, 0.21); // #FF6B35
    vec3 dissolveEdge = edgeColor * (1.0 - border) * 4.0;

    // 1. Base Obsidian Skin
    vec3 baseColor = vec3(0.04, 0.04, 0.06); // Deep Obsidian #0A0A0F approx
    
    // Lambert + Rim
    vec3 viewDir = normalize(vViewPosition);
    float rim = 1.0 - max(dot(viewDir, normalize(vNormal)), 0.0);
    rim = pow(rim, 4.0);
    vec3 color = mix(baseColor, vec3(0.1, 0.15, 0.3), rim); // Subtle blue rim for obsidian

    // 2. Hit Flash
    color = mix(color, vec3(1.0), u_hitFlash * u_hitIntensity);

    // 3. Phase 1: Rim Sweep (Accent Cyan #00E5FF)
    if (u_rimActive > 0.5) {
      float safeHeight = max(u_bossHeight, 0.001);
      float normalizedY = clamp(vWorldY / safeHeight, 0.0, 1.0);
      float sweepWidth = 0.15;
      float sweep = smoothstep(u_rimProgress - sweepWidth, u_rimProgress, normalizedY) - 
                    smoothstep(u_rimProgress, u_rimProgress + 0.05, normalizedY);
      
      color += vec3(0.0, 0.9, 1.0) * sweep * 2.0; // #00E5FF approx
    }

    gl_FragColor = vec4(color + dissolveEdge, 1.0);
  }
`;

export function createBossMaterial(): THREE.ShaderMaterial {
  return new THREE.ShaderMaterial({
    uniforms: {
      u_time:           { value: 0.0 },
      u_hitFlash:       { value: 0.0 },
      u_hitIntensity:   { value: 0.0 },
      u_dissolveAmount: { value: 0.0 },
      u_rimProgress:    { value: 0.0 },
      u_rimActive:      { value: 0.0 },
      u_bossHeight:     { value: 2.0 },
    } as { [key: string]: THREE.IUniform },
    vertexShader,
    fragmentShader,
    transparent: true,
    side: THREE.FrontSide,
  });
}
