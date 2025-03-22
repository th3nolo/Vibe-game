import { Player } from '../../src/core/game/player';
import { Position, Item, ItemType } from '../../src/interfaces';

describe('Player', () => {
  let player: Player;
  const spawnPoint: Position = { x: 0, y: 0, z: 0 };

  beforeEach(() => {
    player = new Player('test_player', spawnPoint);
  });

  describe('constructor', () => {
    it('should initialize player with correct default values', () => {
      expect(player.id).toBe('test_player');
      expect(player.position).toEqual(spawnPoint);
      expect(player.health).toBe(100);
      expect(player.level).toBe(1);
      expect(player.inventory).toEqual([]);
    });
  });

  describe('move', () => {
    it('should update player position', () => {
      const newPosition: Position = { x: 10, y: 20, z: 30 };
      player.move(newPosition);
      expect(player.position).toEqual(newPosition);
    });
  });

  describe('inventory management', () => {
    const testItem: Item = {
      id: 'test_item',
      name: 'Test Item',
      type: ItemType.WEAPON,
      stats: { damage: 10 }
    };

    it('should add item to inventory', () => {
      player.addItem(testItem);
      expect(player.inventory).toContain(testItem);
    });

    it('should remove item from inventory', () => {
      player.addItem(testItem);
      const removedItem = player.removeItem(testItem.id);
      expect(removedItem).toEqual(testItem);
      expect(player.inventory).not.toContain(testItem);
    });

    it('should return undefined when removing non-existent item', () => {
      const removedItem = player.removeItem('non_existent');
      expect(removedItem).toBeUndefined();
    });
  });

  describe('combat', () => {
    it('should take damage and reduce health', () => {
      player.takeDamage(30);
      expect(player.health).toBe(70);
    });

    it('should not reduce health below 0', () => {
      player.takeDamage(150);
      expect(player.health).toBe(0);
    });

    it('should heal and increase health', () => {
      player.takeDamage(50);
      player.heal(30);
      expect(player.health).toBe(80);
    });

    it('should not increase health above 100', () => {
      player.heal(50);
      expect(player.health).toBe(100);
    });
  });

  describe('leveling', () => {
    it('should increase level', () => {
      player.levelUp();
      expect(player.level).toBe(2);
    });

    it('should reset health on level up', () => {
      player.takeDamage(50);
      player.levelUp();
      expect(player.health).toBe(100);
    });
  });

  describe('isAlive', () => {
    it('should return true when health is above 0', () => {
      expect(player.isAlive()).toBe(true);
    });

    it('should return false when health is 0', () => {
      player.takeDamage(100);
      expect(player.isAlive()).toBe(false);
    });
  });
}); 