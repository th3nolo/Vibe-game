import fs from 'fs';
import path from 'path';
import { Position } from '../interfaces';

export class ProceduralGenerator {
    private instance: WebAssembly.Instance | null = null;

    async init(): Promise<void> {
        const wasmPath = path.resolve(__dirname, 'lobby_generator.wasm');
        const wasmBuffer = fs.readFileSync(wasmPath);
        const module = await WebAssembly.compile(wasmBuffer);
        this.instance = await WebAssembly.instantiate(module);
    }

    generateSpawnPoints(numPoints: number, seed: number): Position[] {
        if (!this.instance) throw new Error('WASM module not initialized');

        const exports = this.instance.exports;

        // Access specific exports with runtime checks
        const generate_spawn_points = exports.generate_spawn_points;
        if (typeof generate_spawn_points !== 'function') {
            throw new Error('generate_spawn_points is not a function');
        }

        const memory = exports.memory;
        if (!(memory instanceof WebAssembly.Memory)) {
            throw new Error('memory is not a WebAssembly.Memory');
        }

        const offset = 1024; // Temporary fixed offset
        const buffer = new Float32Array(memory.buffer, offset, numPoints * 3);

        // Call the WebAssembly function
        generate_spawn_points(offset, numPoints, seed);

        const positions: Position[] = [];
        for (let i = 0; i < numPoints; i++) {
            positions.push({
                x: buffer[i * 3],
                y: buffer[i * 3 + 1],
                z: buffer[i * 3 + 2]
            });
        }
        return positions;
    }
}