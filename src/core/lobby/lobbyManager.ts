import { Worker } from 'worker_threads';
import path from 'path';
import { IProceduralGenerator, Lobby, LobbyStatus } from '../../interfaces';
import { World } from '../game/world';
import { Player } from '../game/player';

/**
 * Manages game lobbies and player assignments
 */
export class LobbyManager {
  private readonly lobbies: Map<string, Lobby>;
  private readonly maxPlayersPerLobby: number;
  private readonly proceduralGenerator: IProceduralGenerator;
  private readonly cleanupTimeouts: Map<string, NodeJS.Timeout>;

  constructor(maxPlayersPerLobby: number = 50, proceduralGenerator: IProceduralGenerator) {
    this.lobbies = new Map();
    this.maxPlayersPerLobby = maxPlayersPerLobby;
    this.proceduralGenerator = proceduralGenerator; 
    this.cleanupTimeouts = new Map();
  }

  /**
   * Creates a new lobby
   */
  createLobby(): string {
    const id = `lobby_${Date.now()}_${Math.random().toString(36).slice(2)}`;
    const spawnPoints = this.proceduralGenerator.generateSpawnPoints(10, Date.now());
    const world = new World(id, `World for ${id}`, spawnPoints);
    const sharedBuffer = new SharedArrayBuffer(this.maxPlayersPerLobby * 3 * 4);
    const playerPositions = new Float32Array(sharedBuffer);
    const worker = new Worker(path.resolve(__dirname, 'lobbyWorker.ts'), {
      workerData: { lobbyId: id, sharedBuffer }
    });
    
    this.lobbies.set(id, {
      id,
      world,
      players: new Map(),
      maxPlayers: this.maxPlayersPerLobby,
      status: LobbyStatus.WAITING,
      worker,
      playerPositions,
      playerIndex: new Map(),
      nextPlayerIndex: 0
    });
    return id;
  }

  /**
   * Assigns a player to an available lobby
   */
  joinLobby(player: Player): string {
    let lobby: Lobby | undefined;
    for (const [, l] of this.lobbies) {
      if (l.players.size < this.maxPlayersPerLobby && l.status === LobbyStatus.WAITING) {
        lobby = l;
        break;
      }
    }
    if (!lobby) {
      const newLobbyId = this.createLobby();
      lobby = this.lobbies.get(newLobbyId)!;
    }
    const index = lobby.nextPlayerIndex++;
    lobby.players.set(player.id, player);
    lobby.playerIndex.set(player.id, index);
    const spawnPoint = lobby.world.getRandomSpawnPoint();
    player.move(spawnPoint);
    lobby.playerPositions[3*index] = spawnPoint.x;
    lobby.playerPositions[3*index+1] = spawnPoint.y;
    lobby.playerPositions[3*index+2] = spawnPoint.z;
  
    // Cancel cleanup timeout if it exists
    const timeout = this.cleanupTimeouts.get(lobby.id);
    if (timeout) {
      clearTimeout(timeout);
      this.cleanupTimeouts.delete(lobby.id);
    }
  
    return lobby.id;
  }

  /**
   * Removes a player from their lobby
   */
  leaveLobby(playerId: string, lobbyId: string): void {
    const lobby = this.lobbies.get(lobbyId);
    if (lobby) {
      lobby.players.delete(playerId);
      lobby.playerIndex.delete(playerId);
      if (lobby.players.size === 0) {
        const timeout = setTimeout(() => {
          lobby.worker.terminate();
          this.lobbies.delete(lobbyId);
          this.cleanupTimeouts.delete(lobbyId);
        }, 5 * 60 * 1000); // 5 minutes
        this.cleanupTimeouts.set(lobbyId, timeout);
      }
    }
  }

  /**
   * Gets the current state of a lobby
   */
  getLobbyState(lobbyId: string): Lobby | undefined {
    return this.lobbies.get(lobbyId);
  }

  /**
   * Updates the status of a lobby
   */
  updateLobbyStatus(lobbyId: string, status: LobbyStatus): void {
    const lobby = this.lobbies.get(lobbyId);
    if (lobby) {
      lobby.status = status;
    }
  }

  /**
   * Gets all active lobbies
   */
  getActiveLobbies(): Lobby[] {
    return Array.from(this.lobbies.values());
  }
} 