import express from 'express';
import { WebSocketServer, WebSocket } from 'ws';
import { LobbyManager } from '../core/lobby/lobbyManager';
import { Player } from '../core/game/player';
import { Position } from '../interfaces';
import { ProceduralGenerator } from '../wasm/proceduralGenerator';

/**
 * Main server class handling HTTP and WebSocket connections
 */
export class GameServer {
  private readonly app: express.Application;
  private readonly wss: WebSocketServer;
  private readonly lobbyManager: LobbyManager;
  private readonly proceduralGenerator: ProceduralGenerator;
  private readonly port: number;
  private readonly connections: Map<WebSocket, { playerId: string; lobbyId: string }> = new Map();

  constructor(port: number = 3000) {
    this.app = express();
    this.port = port;
    this.proceduralGenerator = new ProceduralGenerator();
    this.lobbyManager = new LobbyManager(50, this.proceduralGenerator);
    this.wss = new WebSocketServer({ port: port + 1 });
    this.setupWebSocket();
  }

  /**
   * Sets up WebSocket connection handling
   */
  private setupWebSocket(): void {
    this.wss.on('connection', (ws: WebSocket) => {
      const playerId = `player_${Date.now()}_${Math.random().toString(36).slice(2)}`;
      const dummyPosition: Position = { x: 0, y: 0, z: 0 };
      const player = new Player(playerId, dummyPosition);
      const lobbyId = this.lobbyManager.joinLobby(player);
      this.connections.set(ws, { playerId, lobbyId });
      ws.send(JSON.stringify({ type: 'CONNECTED', playerId, lobbyId, position: player.position }));

      ws.on('message', (message: string) => {
        try {
          const data = JSON.parse(message);
          this.handleMessage(ws, data);
        } catch (error) {
          console.error('Error handling message:', error);
          ws.send(JSON.stringify({ type: 'ERROR', message: 'Invalid message format' }));
        }
      });

      ws.on('close', () => {
        const conn = this.connections.get(ws);
        if (conn) {
          this.lobbyManager.leaveLobby(conn.playerId, conn.lobbyId);
          this.connections.delete(ws);
        }
      });
    });
  }

  /**
   * Handles incoming WebSocket messages
   */
  private handleMessage(ws: WebSocket, data: any): void {
    const conn = this.connections.get(ws);
    if (!conn) return;
    const { playerId, lobbyId } = conn;
    const lobby = this.lobbyManager.getLobbyState(lobbyId);
    if (!lobby || !lobby.worker) return;
    const index = lobby.playerIndex.get(playerId);
    if (index === undefined) return;

    if (data.type === 'MOVE') {
      lobby.worker.postMessage({
        type: 'MOVE',
        index,
        data: { direction: data.direction }
      });
    }
  }

  private startUpdateLoop(): void {
    setInterval(() => {
      for (const lobby of this.lobbyManager.getActiveLobbies()) {
        const positions = Array.from(lobby.players.keys()).map(pid => {
          const idx = lobby.playerIndex.get(pid);
          if (idx !== undefined) {
            return {
              playerId: pid,
              position: {
                x: lobby.playerPositions[3*idx],
                y: lobby.playerPositions[3*idx+1],
                z: lobby.playerPositions[3*idx+2]
              }
            };
          }
          return null;
        }).filter(p => p !== null);
        const msg = JSON.stringify({ type: 'UPDATE', positions });
        for (const [ws, conn] of this.connections) {
          if (conn.lobbyId === lobby.id) ws.send(msg);
        }
      }
    }, 100);
  }

  /**
   * Starts the server
   */
  public async start(): Promise<void> {
    await this.proceduralGenerator.init();
    this.startUpdateLoop();
    this.app.listen(this.port, () => {
      console.log(`HTTP server running on port ${this.port}`);
      console.log(`WebSocket server running on port ${this.port + 1}`);
    });
  }
} 