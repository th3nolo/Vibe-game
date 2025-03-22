/**
 * Core interfaces for the MMO RPG server
 */

export interface Position {
  x: number;
  y: number;
  z: number;
}

export interface Player {
  id: string;
  position: Position;
  health: number;
  level: number;
  inventory: Item[];
}

export interface Item {
  id: string;
  name: string;
  type: ItemType;
  stats: ItemStats;
}

export enum ItemType {
  WEAPON = 'WEAPON',
  ARMOR = 'ARMOR',
  CONSUMABLE = 'CONSUMABLE',
  MATERIAL = 'MATERIAL'
}

export interface ItemStats {
  damage?: number;
  defense?: number;
  durability?: number;
  [key: string]: number | undefined;
}

export interface Lobby {
  id: string;
  players: Map<string, Player>;
  maxPlayers: number;
  status: LobbyStatus;
}

export enum LobbyStatus {
  WAITING = 'WAITING',
  STARTING = 'STARTING',
  IN_PROGRESS = 'IN_PROGRESS',
  ENDED = 'ENDED'
}

export interface World {
  id: string;
  name: string;
  regions: Region[];
  spawnPoints: Position[];
}

export interface Region {
  id: string;
  name: string;
  bounds: RegionBounds;
  entities: Entity[];
}

export interface RegionBounds {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
  minZ: number;
  maxZ: number;
}

export interface Entity {
  id: string;
  type: EntityType;
  position: Position;
  health: number;
}

export enum EntityType {
  PLAYER = 'PLAYER',
  NPC = 'NPC',
  MONSTER = 'MONSTER',
  ITEM = 'ITEM'
}

export interface GameState {
  players: Map<string, Player>;
  world: World;
  time: number;
  events: GameEvent[];
}

export interface GameEvent {
  id: string;
  type: GameEventType;
  timestamp: number;
  data: unknown;
}

export enum GameEventType {
  PLAYER_JOIN = 'PLAYER_JOIN',
  PLAYER_LEAVE = 'PLAYER_LEAVE',
  PLAYER_MOVE = 'PLAYER_MOVE',
  PLAYER_ATTACK = 'PLAYER_ATTACK',
  PLAYER_DAMAGE = 'PLAYER_DAMAGE',
  ITEM_PICKUP = 'ITEM_PICKUP',
  ITEM_DROP = 'ITEM_DROP'
} 