/**
 * Game constants and configuration values
 */

export const GAME_CONSTANTS = {
  // Player settings
  PLAYER: {
    MAX_HEALTH: 100,
    BASE_MOVE_SPEED: 5,
    BASE_ATTACK_DAMAGE: 10,
    MAX_LEVEL: 100,
    EXPERIENCE_MULTIPLIER: 1.5
  },

  // World settings
  WORLD: {
    MAX_REGIONS: 100,
    REGION_SIZE: 1000,
    SPAWN_PROTECTION_RADIUS: 50,
    MAX_ENTITIES_PER_REGION: 1000
  },

  // Combat settings
  COMBAT: {
    ATTACK_COOLDOWN: 1000, // ms
    MAX_ATTACK_RANGE: 5,
    CRITICAL_HIT_MULTIPLIER: 1.5,
    CRITICAL_HIT_CHANCE: 0.1
  },

  // Item settings
  ITEM: {
    MAX_STACK_SIZE: 99,
    MAX_DURABILITY: 100,
    REPAIR_COST_MULTIPLIER: 0.5
  },

  // Network settings
  NETWORK: {
    MAX_PACKET_SIZE: 1024 * 64, // 64KB
    PING_TIMEOUT: 5000, // ms
    RECONNECT_TIMEOUT: 30000, // ms
    MAX_RECONNECT_ATTEMPTS: 3
  },

  // Game loop settings
  GAME_LOOP: {
    TICK_RATE: 60,
    PHYSICS_UPDATE_RATE: 120,
    NETWORK_UPDATE_RATE: 30
  }
} as const;

// Type-safe access to constants
export type GameConstants = typeof GAME_CONSTANTS;

// Helper function to get nested constant values
export function getConstant<T extends keyof GameConstants, K extends keyof GameConstants[T]>(
  category: T,
  key: K
): GameConstants[T][K] {
  return GAME_CONSTANTS[category][key];
} 