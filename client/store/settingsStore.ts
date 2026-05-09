import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { audioManager } from '@/lib/audioManager';

export type TextSpeed = 'slow' | 'normal' | 'fast' | 'instant';

const SPEED_MAP: Record<TextSpeed, number> = {
  slow: 60,
  normal: 30,
  fast: 15,
  instant: 0
};

export type GraphicsQuality = 'low' | 'medium' | 'high';

interface SettingsState {
  // Gameplay
  textSpeed: TextSpeed;
  textDelay: number;
  
  // Video
  screenShake: boolean;
  bloomIntensity: number;
  graphicsQuality: GraphicsQuality;
  
  // Audio
  masterVolume: number;
  
  // Input
  keybindings: Record<string, string>;

  // Actions
  updateSetting: <T extends keyof SettingsState>(key: T, value: SettingsState[T]) => void;
  updateKeybinding: (action: string, key: string) => void;
  resetSettings: () => void;
}

const DEFAULT_SETTINGS = {
  textSpeed: 'normal' as TextSpeed,
  textDelay: SPEED_MAP.normal,
  screenShake: true,
  bloomIntensity: 1.5,
  graphicsQuality: 'medium' as GraphicsQuality,
  masterVolume: 0.8,
  keybindings: {
    MOVE_FORWARD: 'KeyW',
    MOVE_BACKWARD: 'KeyS',
    MOVE_LEFT: 'KeyA',
    MOVE_RIGHT: 'KeyD',
    INVENTORY: 'KeyI',
    CODEX: 'KeyC',
    INTERACT: 'KeyE'
  }
};

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      ...DEFAULT_SETTINGS,

      updateSetting: (key, value) => {
        if (key === 'textSpeed') {
          set({ 
            textSpeed: value as TextSpeed, 
            textDelay: SPEED_MAP[value as TextSpeed] 
          });
        } else if (key === 'masterVolume') {
          set({ masterVolume: value as number });
          audioManager.setVolume(value as number);
        } else {
          set({ [key]: value } as any);
        }
      },

      updateKeybinding: (action, key) => set((state) => ({
        keybindings: { ...state.keybindings, [action]: key }
      })),

      resetSettings: () => set(DEFAULT_SETTINGS)
    }),
    {
      name: 'obsidian_settings_v1'
    }
  )
);
