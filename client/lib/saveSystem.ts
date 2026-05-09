/**
 * saveSystem.ts
 * 
 * Pure adapter for LocalStorage persistence in Obsidian Depths.
 * Handles versioning, migrations, and throttled saving.
 */

import { SerializedCombatState } from '@/store/combatStore';
import { SerializedDungeonState } from '@/store/dungeonStore';
import { SerializedEquipmentState } from '@/store/equipmentStore';
import { SerializedLeetCodeState } from '@/store/leetcodeStore';

const SAVE_KEY = 'obsidian_depths_save_v1';
const CURRENT_VERSION = 1;

export interface SaveData {
  version: number;
  timestamp: number;
  combat: SerializedCombatState;
  dungeon: SerializedDungeonState;
  equipment: SerializedEquipmentState;
  leetcode: SerializedLeetCodeState;
}

// --- MIGRATION REGISTRY ---
type MigrationFn = (data: any) => any;
const MIGRATIONS: Record<number, MigrationFn> = {};

function migrate(data: any): SaveData {
  let migratedData = data;
  let version = data.version || 0;
  while (version < CURRENT_VERSION) {
    const nextVersion = version + 1;
    if (MIGRATIONS[nextVersion]) {
      migratedData = MIGRATIONS[nextVersion](migratedData);
      version = nextVersion;
    } else {
      break;
    }
  }
  return migratedData as SaveData;
}

// --- THROTTLE LOGIC ---
let lastSaveTime = 0;
const SAVE_THROTTLE_MS = 1000;

export function saveRun(
  combat: SerializedCombatState, 
  dungeon: SerializedDungeonState,
  equipment: SerializedEquipmentState,
  leetcode: SerializedLeetCodeState
) {
  const now = Date.now();
  if (now - lastSaveTime < SAVE_THROTTLE_MS) return;
  
  try {
    const saveData: SaveData = {
      version: CURRENT_VERSION,
      timestamp: now,
      combat,
      dungeon,
      equipment,
      leetcode
    };
    localStorage.setItem(SAVE_KEY, JSON.stringify(saveData));
    lastSaveTime = now;
    console.log('[SaveSystem] Run saved successfully.');
  } catch (error) {
    console.error('[SaveSystem] Failed to save run:', error);
  }
}

export function loadRun(): SaveData | null {
  try {
    const rawData = localStorage.getItem(SAVE_KEY);
    if (!rawData) return null;
    let data = JSON.parse(rawData);
    if (data.version < CURRENT_VERSION) data = migrate(data);
    else if (data.version > CURRENT_VERSION) {
      clearSave();
      return null;
    }
    if (!data.combat || !data.dungeon || !data.equipment || !data.leetcode) throw new Error('Incomplete save data');
    return data;
  } catch (error) {
    console.error('[SaveSystem] Corrupted save detected. Resetting.', error);
    clearSave();
    return null;
  }
}

export function clearSave() {
  localStorage.removeItem(SAVE_KEY);
}

export function hasValidSave(): boolean {
  return localStorage.getItem(SAVE_KEY) !== null;
}
