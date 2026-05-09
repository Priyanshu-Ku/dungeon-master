import * as THREE from 'three';
import { useGLTF, useTexture } from '@react-three/drei';

/**
 * assetLoader.ts
 * 
 * Centralized infrastructure for asset preloading and runtime caching.
 * Ensures that heavy textures and models are warmed before they are needed in the scene.
 */

// Enable global three.js cache
THREE.Cache.enabled = true;

interface AssetManifest {
  models: string[];
  textures: string[];
  audio: string[];
}

export const ASSET_MANIFEST: AssetManifest = {
  models: [
    '/models/dungeon_core.glb',
    '/models/boss_architect.glb',
    '/models/player_rig.glb'
  ],
  textures: [
    '/textures/obsidian_base.jpg',
    '/textures/obsidian_normal.jpg',
    '/textures/neon_emissive.jpg'
  ],
  audio: [
    '/audio/music/dungeon_ambient.mp3',
    '/audio/sfx/victory_fanfare.mp3',
    '/audio/sfx/click.mp3'
  ]
};

class AssetLoader {
  private static instance: AssetLoader;
  private progress: number = 0;
  private totalAssets: number = 0;
  private loadedAssets: number = 0;
  private onProgressListeners: ((progress: number) => void)[] = [];

  private constructor() {
    this.totalAssets = ASSET_MANIFEST.models.length + ASSET_MANIFEST.textures.length + ASSET_MANIFEST.audio.length;
  }

  public static getInstance(): AssetLoader {
    if (!AssetLoader.instance) {
      AssetLoader.instance = new AssetLoader();
    }
    return AssetLoader.instance;
  }

  public addOnProgressListener(callback: (progress: number) => void) {
    this.onProgressListeners.push(callback);
  }

  private notifyListeners() {
    this.progress = this.totalAssets > 0 ? (this.loadedAssets / this.totalAssets) * 100 : 100;
    this.onProgressListeners.forEach(cb => cb(this.progress));
  }

  /**
   * Preloads all assets defined in the manifest.
   */
  public async preloadAll() {
    console.log('Starting Asset Preload...');
    
    // Preload Models (using Drei's helper to warm the hook cache)
    ASSET_MANIFEST.models.forEach(url => {
      try {
        useGLTF.preload(url);
        this.loadedAssets++;
        this.notifyListeners();
      } catch (e) {
        console.warn(`Failed to preload model: ${url}`, e);
      }
    });

    // Preload Textures
    ASSET_MANIFEST.textures.forEach(url => {
      try {
        useTexture.preload(url);
        this.loadedAssets++;
        this.notifyListeners();
      } catch (e) {
        console.warn(`Failed to preload texture: ${url}`, e);
      }
    });

    // Preload Audio (Browser Audio objects)
    ASSET_MANIFEST.audio.forEach(url => {
      const audio = new Audio();
      audio.src = url;
      audio.oncanplaythrough = () => {
        this.loadedAssets++;
        this.notifyListeners();
        audio.oncanplaythrough = null;
      };
    });

    return new Promise<void>((resolve) => {
      const checkInterval = setInterval(() => {
        if (this.loadedAssets >= this.totalAssets) {
          clearInterval(checkInterval);
          resolve();
        }
      }, 100);
      
      // Safety timeout
      setTimeout(() => {
        clearInterval(checkInterval);
        resolve();
      }, 10000);
    });
  }

  /**
   * Cleans up memory by clearing the Three.js cache.
   * Call this on major scene swaps or unmounts.
   */
  public dispose() {
    THREE.Cache.clear();
  }
}

export const assetLoader = AssetLoader.getInstance();
