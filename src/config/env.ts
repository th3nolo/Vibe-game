/**
 * Environment configuration for the MMO RPG server
 */

interface EnvConfig {
  NODE_ENV: 'development' | 'production' | 'test';
  PORT: number;
  WS_PORT: number;
  MAX_PLAYERS_PER_LOBBY: number;
  TICK_RATE: number;
  LOG_LEVEL: 'debug' | 'info' | 'warn' | 'error';
}

/**
 * Loads and validates environment variables
 */
export function loadEnvConfig(): EnvConfig {
  const config: EnvConfig = {
    NODE_ENV: (process.env.NODE_ENV as EnvConfig['NODE_ENV']) || 'development',
    PORT: parseInt(process.env.PORT || '3000', 10),
    WS_PORT: parseInt(process.env.WS_PORT || '3001', 10),
    MAX_PLAYERS_PER_LOBBY: parseInt(process.env.MAX_PLAYERS_PER_LOBBY || '50', 10),
    TICK_RATE: parseInt(process.env.TICK_RATE || '60', 10),
    LOG_LEVEL: (process.env.LOG_LEVEL as EnvConfig['LOG_LEVEL']) || 'info'
  };

  // Validate configuration
  if (isNaN(config.PORT) || config.PORT < 1) {
    throw new Error('Invalid PORT configuration');
  }
  if (isNaN(config.WS_PORT) || config.WS_PORT < 1) {
    throw new Error('Invalid WS_PORT configuration');
  }
  if (isNaN(config.MAX_PLAYERS_PER_LOBBY) || config.MAX_PLAYERS_PER_LOBBY < 1) {
    throw new Error('Invalid MAX_PLAYERS_PER_LOBBY configuration');
  }
  if (isNaN(config.TICK_RATE) || config.TICK_RATE < 1) {
    throw new Error('Invalid TICK_RATE configuration');
  }

  return config;
}

// Export the configuration
export const env = loadEnvConfig(); 