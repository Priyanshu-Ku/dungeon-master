/**
 * dungeonGraph.ts
 * 
 * Procedural Dungeon Graph Generator (DAG) for Obsidian Depths.
 * Generates a layered directed acyclic graph of rooms with a deterministic seed.
 */

export type RoomType = 'START' | 'COMBAT' | 'ELITE' | 'REST' | 'MYSTERY' | 'BOSS_FINAL';

export interface RoomNode {
  id: string;
  type: RoomType;
  cleared: boolean;
  locked: boolean;
  bossId?: string;
  position: { x: number; y: number };
  connections: string[];
  flavourText: string;
  visitCount: number;
  layer: number;
}

// Simple seeded random generator
class SeededRandom {
  private seed: number;
  constructor(seed: number) {
    this.seed = seed;
  }
  next() {
    this.seed = (this.seed * 1664525 + 1013904223) % 4294967296;
    return this.seed / 4294967296;
  }
  range(min: number, max: number) {
    return Math.floor(this.next() * (max - min + 1)) + min;
  }
  pick<T>(array: T[]): T {
    return array[Math.floor(this.next() * array.length)];
  }
  shuffle<T>(array: T[]): T[] {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(this.next() * (i + 1));
      [arr[i], arr[arr.length - 1]] = [arr[j], arr[i]];
    }
    return arr;
  }
}

const FLAVOUR_TEXTS: Record<RoomType, string[]> = {
  START: ["The air is cold, but the resonance is steady."],
  COMBAT: ["A shadow moves in the corner of your vision.", "The floor vibrates with computational malice."],
  ELITE: ["The concentration of entropy here is suffocating.", "A high-tier entity has claimed this node."],
  REST: ["A rare pocket of stability in the void.", "The code here feels almost... peaceful."],
  MYSTERY: ["The data here is corrupted in strange patterns.", "Something whispers from behind the cache walls."],
  BOSS_FINAL: ["The source of the leak lies ahead.", "End of the line, Codewielder."]
};

export function generateDungeonGraph(level: number): RoomNode[] {
  // Seed based on level + day
  const day = Math.floor(Date.now() / 86400000);
  const rng = new SeededRandom(level + day);

  const rooms: RoomNode[] = [];
  const layers: RoomNode[][] = [];

  // 1. START Room (Layer 0)
  const startRoom: RoomNode = {
    id: 'start-0',
    type: 'START',
    cleared: true,
    locked: false,
    position: { x: 0, y: 0 },
    connections: [],
    flavourText: FLAVOUR_TEXTS.START[0],
    visitCount: 0,
    layer: 0
  };
  rooms.push(startRoom);
  layers[0] = [startRoom];

  // 2. Middle Layers
  const numLayers = rng.range(4, 6);
  let currentId = 1;

  for (let i = 1; i <= numLayers; i++) {
    const numRoomsInLayer = rng.pick([1, 2, 2, 3]); // Weighted 40/40/20 approx
    layers[i] = [];

    for (let j = 0; j < numRoomsInLayer; j++) {
      let type: RoomType = 'COMBAT';
      
      if (i === 1) {
        type = 'COMBAT';
      } else if (i === numLayers) {
        type = 'ELITE';
      } else {
        const roll = rng.next();
        if (roll < 0.5) type = 'COMBAT';
        else if (roll < 0.7) type = 'ELITE';
        else if (roll < 0.85) type = 'REST';
        else type = 'MYSTERY';
      }

      const room: RoomNode = {
        id: `room-${currentId++}`,
        type,
        cleared: false,
        locked: true,
        position: { x: i * 150, y: (j - (numRoomsInLayer - 1) / 2) * 120 },
        connections: [],
        flavourText: rng.pick(FLAVOUR_TEXTS[type]),
        visitCount: 0,
        layer: i
      };
      rooms.push(room);
      layers[i].push(room);
    }
  }

  // 3. BOSS_FINAL Room (Last Layer)
  const bossRoom: RoomNode = {
    id: 'boss-final',
    type: 'BOSS_FINAL',
    cleared: false,
    locked: true,
    position: { x: (numLayers + 1) * 150, y: 0 },
    connections: [],
    flavourText: FLAVOUR_TEXTS.BOSS_FINAL[0],
    visitCount: 0,
    layer: numLayers + 1
  };
  rooms.push(bossRoom);
  layers[numLayers + 1] = [bossRoom];

  // 4. Connect Layers
  for (let i = 0; i < layers.length - 1; i++) {
    const currentLayer = layers[i];
    const nextLayer = layers[i + 1];

    // Ensure every room in current layer has at least one connection
    currentLayer.forEach((room, idx) => {
      // Connect to at least one room in next layer
      const target = nextLayer[idx % nextLayer.length];
      room.connections.push(target.id);
      
      // Potential second connection
      if (nextLayer.length > 1 && rng.next() > 0.6) {
        const otherTarget = nextLayer[(idx + 1) % nextLayer.length];
        if (!room.connections.includes(otherTarget.id)) {
          room.connections.push(otherTarget.id);
        }
      }
    });

    // Ensure every room in next layer has at least one incoming connection
    nextLayer.forEach((nextRoom) => {
      const hasIncoming = currentLayer.some(r => r.connections.includes(nextRoom.id));
      if (!hasIncoming) {
        const source = currentLayer[rng.range(0, currentLayer.length - 1)];
        source.connections.push(nextRoom.id);
      }
    });
  }

  return rooms;
}
