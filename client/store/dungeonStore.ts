import { create } from 'zustand';
import { RoomNode, generateDungeonGraph } from '@/lib/dungeonGraph';

export type TraversalPhase = 'EXPLORING' | 'TRANSITIONING' | 'LOCKED';

export interface SerializedDungeonState {
  dungeonGraph: RoomNode[];
  currentRoomId: string | null;
  visitedRoomIds: string[];
  clearedRoomIds: string[];
}

interface DungeonState {
  dungeonGraph: RoomNode[]; // Immutable structure (read-only)
  currentRoomId: string | null;
  
  // Runtime State (Mutable Sets)
  visitedRooms: Set<string>;
  clearedRooms: Set<string>;
  unlockedRooms: Set<string>;
  
  traversalPhase: TraversalPhase;
  traversalTargetId: string | null;
  
  // Actions
  initDungeon: (level: number) => void;
  setCurrentRoom: (roomId: string) => void;
  setTraversalPhase: (phase: TraversalPhase) => void;
  initiateTransition: (targetId: string) => void;
  markRoomCleared: (roomId: string) => void;
  getRoomById: (roomId: string) => RoomNode | undefined;
  getConnectedRooms: (roomId: string) => RoomNode[];
  isRoomLocked: (roomId: string) => boolean;
  
  // Persistence
  serializeDungeonState: () => SerializedDungeonState;
  hydrateDungeonState: (data: SerializedDungeonState) => void;
  resetDungeon: () => void;
}

export const useDungeonStore = create<DungeonState>((set, get) => ({
  dungeonGraph: [],
  currentRoomId: null,
  visitedRooms: new Set(),
  clearedRooms: new Set(),
  unlockedRooms: new Set(),
  traversalPhase: 'EXPLORING',
  traversalTargetId: null,

  initDungeon: (level) => {
    const graph = generateDungeonGraph(level);
    set({ 
      dungeonGraph: graph, 
      currentRoomId: graph[0].id,
      visitedRooms: new Set([graph[0].id]),
      unlockedRooms: new Set([graph[0].id, ...graph[0].connections]),
      clearedRooms: new Set([graph[0].id]),
      traversalPhase: 'EXPLORING'
    });
  },

  setCurrentRoom: (roomId) => {
    set((state) => {
      const newVisited = new Set(state.visitedRooms);
      newVisited.add(roomId);
      
      const newUnlocked = new Set(state.unlockedRooms);
      const room = state.dungeonGraph.find(r => r.id === roomId);
      if (room) {
        room.connections.forEach(conn => newUnlocked.add(conn));
      }

      return {
        currentRoomId: roomId,
        visitedRooms: newVisited,
        unlockedRooms: newUnlocked,
        traversalPhase: 'EXPLORING',
        traversalTargetId: null
      };
    });
  },

  setTraversalPhase: (phase) => set({ traversalPhase: phase }),

  initiateTransition: (targetId) => {
    set({ 
      traversalPhase: 'TRANSITIONING',
      traversalTargetId: targetId 
    });
  },

  markRoomCleared: (roomId) => {
    set((state) => {
      const newCleared = new Set(state.clearedRooms);
      newCleared.add(roomId);
      return { clearedRooms: newCleared };
    });
  },

  getRoomById: (roomId) => {
    return get().dungeonGraph.find(r => r.id === roomId);
  },

  getConnectedRooms: (roomId) => {
    const room = get().dungeonGraph.find(r => r.id === roomId);
    if (!room) return [];
    return get().dungeonGraph.filter(r => room.connections.includes(r.id));
  },

  isRoomLocked: (roomId) => {
    const { unlockedRooms, clearedRooms, dungeonGraph } = get();
    if (!unlockedRooms.has(roomId)) return true;
    
    // Additional logic: Boss room is locked until 60% of graph is cleared
    const room = dungeonGraph.find(r => r.id === roomId);
    if (room?.type === 'BOSS_FINAL') {
      const clearRate = clearedRooms.size / dungeonGraph.length;
      return clearRate < 0.6;
    }
    
    return false;
  },

  // Persistence
  serializeDungeonState: () => {
    const state = get();
    return {
      dungeonGraph: state.dungeonGraph,
      currentRoomId: state.currentRoomId,
      visitedRoomIds: Array.from(state.visitedRooms),
      clearedRoomIds: Array.from(state.clearedRooms),
    };
  },

  hydrateDungeonState: (data) => {
    // Re-derive unlocked rooms from cleared rooms and connections
    const newUnlocked = new Set<string>();
    data.clearedRoomIds.forEach(id => {
      newUnlocked.add(id);
      const room = data.dungeonGraph.find(r => r.id === id);
      room?.connections.forEach(conn => newUnlocked.add(conn));
    });

    set({
      dungeonGraph: data.dungeonGraph,
      currentRoomId: data.currentRoomId,
      visitedRooms: new Set(data.visitedRoomIds),
      clearedRooms: new Set(data.clearedRoomIds),
      unlockedRooms: newUnlocked,
      traversalPhase: 'EXPLORING',
      traversalTargetId: null
    });
  },

  resetDungeon: () => set({
    dungeonGraph: [],
    currentRoomId: null,
    visitedRooms: new Set(),
    clearedRooms: new Set(),
    unlockedRooms: new Set(),
    traversalPhase: 'EXPLORING',
    traversalTargetId: null
  }),
}));
