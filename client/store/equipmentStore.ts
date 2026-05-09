import { create } from 'zustand';
import { ItemInstance, ItemSlot } from '@/lib/lootSystem';

export interface SerializedEquipmentState {
  inventory: ItemInstance[];
  equippedIds: Record<ItemSlot, string | null>;
}

interface EquipmentState {
  inventory: ItemInstance[];
  equippedIds: Record<ItemSlot, string | null>;
  
  // Actions
  addItem: (item: ItemInstance) => void;
  equipItem: (instanceId: string) => void;
  unequipItem: (slot: ItemSlot) => void;
  getEquippedItems: () => ItemInstance[];
  
  // Persistence
  serializeEquipmentState: () => SerializedEquipmentState;
  hydrateEquipmentState: (data: SerializedEquipmentState) => void;
  resetEquipment: () => void;
}

export const useEquipmentStore = create<EquipmentState>((set, get) => ({
  inventory: [],
  equippedIds: {
    CODEX: null,
    FOCUS: null,
    SIGIL: null,
    MANTLE: null
  },

  addItem: (item) => set((state) => ({ 
    inventory: [...state.inventory, item] 
  })),

  equipItem: (instanceId) => {
    const { inventory } = get();
    const item = inventory.find(i => i.instanceId === instanceId);
    if (!item) return;

    // Use registry to find correct slot
    const { ITEM_REGISTRY } = require('@/lib/lootSystem');
    const definition = ITEM_REGISTRY[item.definitionId];
    if (!definition) return;

    set((state) => ({
      equippedIds: {
        ...state.equippedIds,
        [definition.slot]: instanceId
      }
    }));
  },

  unequipItem: (slot) => set((state) => ({
    equippedIds: { ...state.equippedIds, [slot]: null }
  })),

  getEquippedItems: () => {
    const { inventory, equippedIds } = get();
    return Object.values(equippedIds)
      .map(id => inventory.find(i => i.instanceId === id))
      .filter((item): item is ItemInstance => !!item);
  },

  // Persistence
  serializeEquipmentState: () => ({
    inventory: get().inventory,
    equippedIds: get().equippedIds
  }),

  hydrateEquipmentState: (data) => set({
    inventory: data.inventory,
    equippedIds: data.equippedIds
  }),

  resetEquipment: () => set({
    inventory: [],
    equippedIds: { CODEX: null, FOCUS: null, SIGIL: null, MANTLE: null }
  })
}));
