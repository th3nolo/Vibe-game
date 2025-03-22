import { World as IWorld, Region, Position, Entity, EntityType } from '../../interfaces';

/**
 * Represents the game world with regions and entities
 */
export class World implements IWorld {
  public readonly id: string;
  public readonly name: string;
  public readonly regions: Region[];
  public readonly spawnPoints: Position[];

  constructor(id: string, name: string, spawnPoints: Position[]) {
    this.id = id;
    this.name = name;
    this.regions = [];
    this.spawnPoints = spawnPoints;
  }

  /**
   * Adds a new region to the world
   */
  addRegion(region: Region): void {
    this.regions.push(region);
  }

  /**
   * Gets a random spawn point
   */
  getRandomSpawnPoint(): Position {
    const index = Math.floor(Math.random() * this.spawnPoints.length);
    return this.spawnPoints[index];
  }

  /**
   * Finds the region containing a given position
   */
  getRegionAtPosition(position: Position): Region | undefined {
    return this.regions.find(region => this.isPositionInRegion(position, region));
  }

  /**
   * Checks if a position is within a region's bounds
   */
  private isPositionInRegion(position: Position, region: Region): boolean {
    const { bounds } = region;
    return (
      position.x >= bounds.minX &&
      position.x <= bounds.maxX &&
      position.y >= bounds.minY &&
      position.y <= bounds.maxY &&
      position.z >= bounds.minZ &&
      position.z <= bounds.maxZ
    );
  }

  /**
   * Adds an entity to the appropriate region
   */
  addEntity(entity: Entity): void {
    const region = this.getRegionAtPosition(entity.position);
    if (region) {
      region.entities.push(entity);
    }
  }

  /**
   * Removes an entity from its region
   */
  removeEntity(entityId: string): void {
    for (const region of this.regions) {
      const index = region.entities.findIndex((e: Entity) => e.id === entityId);
      if (index !== -1) {
        region.entities.splice(index, 1);
        break;
      }
    }
  }

  /**
   * Gets all entities of a specific type in a region
   */
  getEntitiesByType(regionId: string, type: EntityType): Entity[] {
    const region = this.regions.find((r: Region) => r.id === regionId);
    return region ? region.entities.filter((e: Entity) => e.type === type) : [];
  }

  /**
   * Updates an entity's position and moves it to the appropriate region if needed
   */
  updateEntityPosition(entityId: string, newPosition: Position): void {
    const oldRegion = this.regions.find((region: Region) =>
      region.entities.some((e: Entity) => e.id === entityId)
    );

    if (oldRegion) {
      const entity = oldRegion.entities.find((e: Entity) => e.id === entityId);
      if (entity) {
        entity.position = newPosition;
        const newRegion = this.getRegionAtPosition(newPosition);
        if (newRegion && newRegion.id !== oldRegion.id) {
          // Move entity to new region
          oldRegion.entities = oldRegion.entities.filter((e: Entity) => e.id !== entityId);
          newRegion.entities.push(entity);
        }
      }
    }
  }
} 