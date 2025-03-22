import { jest } from '@jest/globals';
import { LobbyManager } from '../../src/core/lobby/lobbyManager';
import { Player } from '../../src/core/game/player';
import { Position, LobbyStatus, IProceduralGenerator } from '../../src/interfaces';

jest.mock('worker_threads', () => ({
  Worker: jest.fn().mockImplementation(() => ({
    postMessage: jest.fn(),
    on: jest.fn(),
    terminate: jest.fn(),
  })),
}));

class MockProceduralGenerator implements IProceduralGenerator {
  async init(): Promise<void> {}
  generateSpawnPoints(numPoints: number, seed: number): Position[] {
    return Array.from({ length: numPoints }, (_, i) => ({
      x: (i * 10) % 100,
      y: 0,
      z: 0,
    }));
  }
}

describe('LobbyManager', () => {
  let lobbyManager: LobbyManager;
  let testPlayer: Player;

  beforeEach(async () => {
    const mockGenerator = new MockProceduralGenerator();
    await mockGenerator.init();
    lobbyManager = new LobbyManager(2, mockGenerator);
    const spawnPoint: Position = { x: 0, y: 0, z: 0 };
    testPlayer = new Player('test_player', spawnPoint);
  });

  describe('createLobby', () => {
    it('should create a new lobby with correct initial state', () => {
      const lobbyId = lobbyManager.createLobby();
      const lobby = lobbyManager.getLobbyState(lobbyId);
      expect(lobby).toBeDefined();
      expect(lobby?.id).toBe(lobbyId);
      expect(lobby?.players.size).toBe(0);
      expect(lobby?.maxPlayers).toBe(2);
    });
  });

  describe('joinLobby', () => {
    it('should add player to an existing lobby if space available', () => {
      const lobbyId = lobbyManager.createLobby();
      const result = lobbyManager.joinLobby(testPlayer);
      expect(result).toBe(lobbyId);
      const lobby = lobbyManager.getLobbyState(lobbyId);
      expect(lobby?.players.get(testPlayer.id)).toBe(testPlayer);
    });

    it('should create new lobby if no space in existing lobbies', () => {
      const lobbyId = lobbyManager.createLobby();
      const player1 = new Player('player1', { x: 0, y: 0, z: 0 });
      const player2 = new Player('player2', { x: 0, y: 0, z: 0 });
      const player3 = new Player('player3', { x: 0, y: 0, z: 0 });
      lobbyManager.joinLobby(player1);
      lobbyManager.joinLobby(player2);
      const newLobbyId = lobbyManager.joinLobby(player3);
      expect(newLobbyId).not.toBe(lobbyId);
      const newLobby = lobbyManager.getLobbyState(newLobbyId);
      expect(newLobby?.players.get(player3.id)).toBe(player3);
    });
  });

  describe('leaveLobby', () => {
    it('should remove player from lobby', () => {
      const player = new Player('player1', { x: 0, y: 0, z: 0 });
      const extraPlayer = new Player('extra', { x: 0, y: 0, z: 0 });
      const lobbyId = lobbyManager.joinLobby(player);
      lobbyManager.joinLobby(extraPlayer);
      lobbyManager.leaveLobby(player.id, lobbyId);
      const lobby = lobbyManager.getLobbyState(lobbyId);
      expect(lobby).toBeDefined();
      expect(lobby!.players.has(player.id)).toBe(false);
      expect(lobby!.players.has(extraPlayer.id)).toBe(true);
    });

    it('should keep empty lobby alive temporarily', () => {
      const lobbyId = lobbyManager.joinLobby(testPlayer); // Use joinLobby’s return value
      lobbyManager.leaveLobby(testPlayer.id, lobbyId);
      const lobby = lobbyManager.getLobbyState(lobbyId);
      expect(lobby).toBeDefined();
      expect(lobby!.players.size).toBe(0);
    });
  });

  describe('updateLobbyStatus', () => {
    it('should update lobby status', () => {
      const lobbyId = lobbyManager.createLobby();
      lobbyManager.updateLobbyStatus(lobbyId, LobbyStatus.IN_PROGRESS);
      const lobby = lobbyManager.getLobbyState(lobbyId);
      expect(lobby?.status).toBe(LobbyStatus.IN_PROGRESS);
    });
  });

  describe('getActiveLobbies', () => {
    it('should return all active lobbies', () => {
      const lobby1Id = lobbyManager.createLobby();
      const lobby2Id = lobbyManager.createLobby();
      const activeLobbies = lobbyManager.getActiveLobbies();
      expect(activeLobbies.length).toBe(2);
      expect(activeLobbies.map(l => l.id)).toContain(lobby1Id);
      expect(activeLobbies.map(l => l.id)).toContain(lobby2Id);
    });
  });
});