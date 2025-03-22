import { parentPort, workerData } from 'worker_threads';

/**
 * Worker thread for managing lobby game logic
 */
const { lobbyId, sharedBuffer } = workerData;
const playerPositions = new Float32Array(sharedBuffer);

if (!parentPort) throw new Error('This module must be run as a worker thread');

parentPort.on('message', (msg) => {
    if (msg.type === 'MOVE') {
        const { index, data: { direction } } = msg;
        playerPositions[3*index] += direction.dx;
        playerPositions[3*index+1] += direction.dy;
        playerPositions[3*index+2] += direction.dz;

        // Ensure positions stay within bounds (0-99)
        playerPositions[3*index] = Math.max(0, Math.min(99, playerPositions[3*index]));
        playerPositions[3*index+1] = Math.max(0, Math.min(99, playerPositions[3*index+1]));
        playerPositions[3*index+2] = Math.max(0, Math.min(99, playerPositions[3*index+2]));
    }
}); 