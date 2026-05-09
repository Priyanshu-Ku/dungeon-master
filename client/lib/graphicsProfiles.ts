/**
 * graphicsProfiles.ts
 * 
 * Defines standard quality profiles for Three.js rendering and post-processing.
 */

export type GraphicsQuality = 'low' | 'medium' | 'high';

export interface GraphicsProfile {
  dpr: [number, number];       // Min/Max device pixel ratio
  shadows: boolean;            // Enable directional shadows
  bloom: boolean;              // Enable post-processing bloom
  bloomResolutionScale: number; // Downsample bloom for performance
  ambientOcclusion: boolean;   // Enable SSAO
  fogDensity: number;          // Adjust visual depth
}

export const GRAPHICS_PROFILES: Record<GraphicsQuality, GraphicsProfile> = {
  low: {
    dpr: [1, 1],
    shadows: false,
    bloom: false,
    bloomResolutionScale: 0.5,
    ambientOcclusion: false,
    fogDensity: 0.08
  },
  medium: {
    dpr: [1, 1.5],
    shadows: true,
    bloom: true,
    bloomResolutionScale: 0.75,
    ambientOcclusion: false,
    fogDensity: 0.05
  },
  high: {
    dpr: [1, 2],
    shadows: true,
    bloom: true,
    bloomResolutionScale: 1.0,
    ambientOcclusion: true,
    fogDensity: 0.03
  }
};
