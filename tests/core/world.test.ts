import { World } from '../../src/core/game/world';
import { Position, Region, Entity, EntityType } from '../../src/interfaces';

describe('World', () => {
  let world: World;
  const spawnPoints: Position[] = [
    { x: 0, y: 0, z: 0 },
    { x: 100, y: 100, z: 0 }
  ];

  beforeEach(() => {
    world = new World('test_world', 'Test World', spawnPoints);
  });

  describe('constructor', () => {
    it('should initialize world with correct values', () => {
      expect(world.id).toBe('test_world');
      expect(world.name).toBe('Test World');
      expect(world.regions).toEqual([]);
      expect(world.spawnPoints).toEqual(spawnPoints);
    });
  });

  describe('getRandomSpawnPoint', () => {
    it('should return a valid spawn point', () => {
      const spawnPoint = world.getRandomSpawnPoint();
      expect(spawnPoints).toContainEqual(spawnPoint);
    });
  });

  describe('region management', () => {
    const testRegion: Region = {
      id: 'test_region',
      name: 'Test Region',
      bounds: {
        minX: 0,
        maxX: 100,
        minY: 0,
        maxY: 100,
        minZ: 0,
        maxZ: 100
      },
      entities: []
    };

    it('should add region to world', () => {
      world.addRegion(testRegion);
      expect(world.regions).toContain(testRegion);
    });

    it('should find region containing position', () => {
      world.addRegion(testRegion);
      const position: Position = { x: 50, y: 50, z: 50 };
      const foundRegion = world.getRegionAtPosition(position);
      expect(foundRegion).toEqual(testRegion);
    });

    it('should return undefined for position outside all regions', () => {
      world.addRegion(testRegion);
      const position: Position = { x: 200, y: 200, z: 200 };
      const foundRegion = world.getRegionAtPosition(position);
      expect(foundRegion).toBeUndefined();
    });
  });

  describe('entity management', () => {
    let world: World;
    let testEntity: Entity;

    beforeEach(() => {
      world = new World('world1', 'Test World', []);
      // Region 1: 0-49
      world.addRegion({
        id: 'region1',
        name: 'Region 1',
        bounds: { minX: 0, maxX: 49, minY: 0, maxY: 49, minZ: 0, maxZ: 49 },
        entities: [],
      });
      // Region 2: 50-99
      world.addRegion({
        id: 'region2',
        name: 'Region 2',
        bounds: { minX: 50, maxX: 99, minY: 50, maxY: 99, minZ: 50, maxZ: 99 },
        entities: [],
      });
      testEntity = {
        id: 'test_entity',
        position: { x: 25, y: 25, z: 25 }, // Clearly in region1
        type: EntityType.PLAYER,
        health: 100,
      };
    });

    it('should remove entity from region', () => {
      world.addEntity(testEntity);
      world.removeEntity(testEntity.id);
      const region = world.getRegionAtPosition(testEntity.position);
      expect(region?.entities).not.toContain(testEntity);
    });

    it('should update entity position and move between regions', () => {
      world.addEntity(testEntity);
      const oldRegion = world.getRegionAtPosition({ x: 25, y: 25, z: 25 }); // region1
      world.updateEntityPosition(testEntity.id, { x: 75, y: 75, z: 75 }); // Moves to region2
      const newRegion = world.getRegionAtPosition({ x: 75, y: 75, z: 75 }); // region2
      expect(oldRegion?.entities).not.toContain(testEntity);
      expect(newRegion?.entities).toContain(testEntity);
      expect(testEntity.position).toEqual({ x: 75, y: 75, z: 75 });
    });
  });
}); 