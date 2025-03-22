#!/bin/bash
emcc src/wasm/procedural_generator.cpp \
    -s EXPORTED_FUNCTIONS='["_generate_spawn_points"]' \
    --no-entry \
    -o src/wasm/lobby_generator.wasm