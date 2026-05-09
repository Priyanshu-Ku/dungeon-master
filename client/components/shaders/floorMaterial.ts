import * as THREE from 'three';

// ─────────────────────────────────────────────────────────────────────────────
// Floor Shader Material
// Uniforms:
//   u_time — elapsed time in seconds (driven each frame by SceneContents)
//   u_hit  — triggered on successful player attack (0 → 1 → 0 pulse)
//   u_miss — triggered on missed timing window  (0 → 1 → 0 pulse)
// Visual logic (ripple fx, colour tint) added in Phase 3.
// ─────────────────────────────────────────────────────────────────────────────

const vertexShader = /* glsl */ `
  varying vec2 vUv;

  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = /* glsl */ `
  uniform float u_time;
  uniform float u_hit;
  uniform float u_miss;
  varying vec2 vUv;

  void main() {
    // Placeholder: dark stone base — Phase 3 adds ripple & colour pulse
    // u_time is declared here so the Phase 3 ripple shader can be dropped in.
    vec3 base  = vec3(0.06, 0.06, 0.10);
    vec3 hit   = mix(base, vec3(0.2, 0.8, 0.4), u_hit);
    vec3 final = mix(hit,  vec3(0.8, 0.2, 0.2), u_miss);
    gl_FragColor = vec4(final, 1.0);
  }
`;

export function createFloorMaterial(): THREE.ShaderMaterial {
  return new THREE.ShaderMaterial({
    uniforms: {
      u_time: { value: 0.0 },
      u_hit:  { value: 0.0 },
      u_miss: { value: 0.0 },
    } as { [key: string]: THREE.IUniform },
    vertexShader,
    fragmentShader,
    side: THREE.FrontSide,
  });
}
