import * as THREE from 'three';

/**
 * DungeonWallMaterial
 * Deep obsidian with procedural pulsing cracks.
 */

const vertexShader = /* glsl */ `
  varying vec2 vUv;
  varying vec3 vPosition;

  void main() {
    vUv = uv;
    vPosition = position;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = /* glsl */ `
  uniform float u_time;
  uniform float u_hit;
  uniform float u_miss;
  uniform float u_hitFlash;
  uniform float u_hitIntensity;
  uniform float u_dissolveAmount;

  varying vec2 vUv;
  varying vec3 vPosition;

  // Simple noise
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

  // Procedural cracks using fract
  float cracks(vec2 p) {
    p *= 3.0;
    float n = noise(p);
    vec2 g = fract(p + n * 0.5) - 0.5;
    return smoothstep(0.02, 0.0, length(g) - 0.45);
  }

  void main() {
    // 1. Base colour: deep obsidian #0A0A0F
    vec3 baseColor = vec3(0.04, 0.04, 0.06);
    
    // Noise grain
    float grain = hash(vUv + u_time) * 0.05;
    baseColor += grain;

    // 2. Procedural Cracks
    float c = cracks(vUv * 2.0 + noise(vUv * 5.0) * 0.1);
    
    // Light up with u_hit (cyan) or u_miss (red-orange)
    vec3 hitColor = vec3(0.0, 0.9, 1.0) * u_hit;
    vec3 missColor = vec3(1.0, 0.4, 0.1) * u_miss;
    
    // 3. Animated ember glow along crack edges
    float flicker = sin(u_time * 10.0) * 0.2 + 0.8;
    vec3 ember = (hitColor + missColor) * c * flicker;

    vec3 finalColor = baseColor + ember;

    // Hit Flash
    finalColor = mix(finalColor, vec3(1.0), u_hitFlash * u_hitIntensity);

    // 4. Dissolve Amount (Threshold discard)
    // Note: Usually for boss death, but included per spec
    float dNoise = noise(vUv * 15.0);
    if (dNoise < u_dissolveAmount) discard;

    gl_FragColor = vec4(finalColor, 1.0);
  }
`;

export function createDungeonWallMaterial(): THREE.ShaderMaterial {
  return new THREE.ShaderMaterial({
    uniforms: {
      u_time:           { value: 0.0 },
      u_hit:            { value: 0.0 },
      u_miss:           { value: 0.0 },
      u_hitFlash:       { value: 0.0 },
      u_hitIntensity:   { value: 0.0 },
      u_dissolveAmount: { value: 0.0 },
    } as { [key: string]: THREE.IUniform },
    vertexShader,
    fragmentShader,
    side: THREE.DoubleSide,
  });
}
