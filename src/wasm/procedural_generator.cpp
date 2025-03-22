#include <cstdlib>

// Simple heightmap generator for lobby layouts
extern "C"
{
    void generate_heightmap(int *buffer, int size, int seed)
    {
        for (int i = 0; i < size; i++)
        {
            buffer[i] = (i * seed) % 256; // Placeholder for Perlin noise or similar
        }
    }

    void generate_spawn_points(float *buffer, int num_points, int seed)
    {
        srand(seed);
        for (int i = 0; i < num_points; i++)
        {
            buffer[3 * i] = static_cast<float>(rand() % 100);     // x: 0-99
            buffer[3 * i + 1] = static_cast<float>(rand() % 100); // y: 0-99
            buffer[3 * i + 2] = 0.0f;                             // z: 0 (2D plane)
        }
    }
}
