/**
 * audioManager.ts
 * 
 * Centralized service for managing sound effects and ambient music.
 * Uses Vanilla Web Audio API for playback.
 */

class AudioManager {
  private static instance: AudioManager;
  private music: HTMLAudioElement | null = null;
  private volume: number = 0.5;
  private sfxCache: Map<string, HTMLAudioElement> = new Map();

  private constructor() {}

  public static getInstance(): AudioManager {
    if (!AudioManager.instance) {
      AudioManager.instance = new AudioManager();
    }
    return AudioManager.instance;
  }

  /**
   * Updates the global volume for all active and future sounds.
   */
  public setVolume(v: number) {
    this.volume = Math.max(0, Math.min(1, v));
    if (this.music) this.music.volume = this.volume;
  }

  /**
   * Plays a background music track (loops by default).
   * Cross-fading logic can be added here if needed.
   */
  public playMusic(url: string) {
    if (this.music) {
      this.music.pause();
    }

    this.music = new Audio(url);
    this.music.loop = true;
    this.music.volume = this.volume;
    
    // Auto-play might be blocked by browsers until first interaction
    this.music.play().catch(e => console.warn('Music playback blocked:', e));
  }

  /**
   * Stops the current background music.
   */
  public stopMusic() {
    if (this.music) {
      this.music.pause();
      this.music = null;
    }
  }

  /**
   * Plays a one-shot sound effect.
   */
  public playSFX(url: string) {
    let sfx = this.sfxCache.get(url);
    if (!sfx) {
      sfx = new Audio(url);
      this.sfxCache.set(url, sfx);
    }
    
    // Clone node to allow overlapping playback of the same SFX
    const instance = sfx.cloneNode() as HTMLAudioElement;
    instance.volume = this.volume;
    instance.play().catch(e => console.warn('SFX playback blocked:', e));
  }
}

export const audioManager = AudioManager.getInstance();
