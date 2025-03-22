import { LobbyManager } from '../../src/core/lobby/lobbyManager';
import { Player } from '../../src/core/game/player';
import { Position, LobbyStatus } from '../../src/interfaces';

describe('LobbyManager', () => {
  let lobbyManager: LobbyManager;
  let testPlayer: Player;

  beforeEach(() => {
    lobbyManager = new LobbyManager(2); // Max 2 players per lobby for testing
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
      const testPlayer = { id: 'player1', position: { x: 0, y: 0, z: 0 }, health: 100, level: 1, inventory: [] };
      const lobbyId = lobbyManager.joinLobby(testPlayer);
      lobbyManager.leaveLobby(testPlayer.id, lobbyId);
      const lobby = lobbyManager.getLobbyState(lobbyId);
      expect(lobby?.players.has(testPlayer.id) || false).toBe(false);
    });

    it('should delete empty lobby', () => {
      const lobbyId = lobbyManager.createLobby();
      lobbyManager.joinLobby(testPlayer);
      lobbyManager.leaveLobby(testPlayer.id, lobbyId);

      const lobby = lobbyManager.getLobbyState(lobbyId);
      expect(lobby).toBeUndefined();
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