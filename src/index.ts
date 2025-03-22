import { GameServer } from './server/server';

const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
const server = new GameServer(port);

server.start(); 