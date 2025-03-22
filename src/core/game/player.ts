import { Player as IPlayer, Position, Item } from '../../interfaces';

/**
 * Represents a player in the game
 */
export class Player implements IPlayer {
  public readonly id: string;
  public position: Position;
  public health: number;
  public level: number;
  public inventory: Item[];

  constructor(id: string, position: Position) {
    this.id = id;
    this.position = position;
    this.health = 100;
    this.level = 1;
    this.inventory = [];
  }

  /**
   * Moves the player to a new position
   */
  move(newPosition: Position): void {
    this.position = newPosition;
  }

  /**
   * Adds an item to the player's inventory
   */
  addItem(item: Item): void {
    this.inventory.push(item);
  }

  /**
   * Removes an item from the player's inventory
   */
  removeItem(itemId: string): Item | undefined {
    const index = this.inventory.findIndex(item => item.id === itemId);
    if (index !== -1) {
      return this.inventory.splice(index, 1)[0];
    }
    return undefined;
  }

  /**
   * Applies damage to the player
   */
  takeDamage(amount: number): void {
    this.health = Math.max(0, this.health - amount);
  }

  /**
   * Heals the player
   */
  heal(amount: number): void {
    this.health = Math.min(100, this.health + amount);
  }

  /**
   * Levels up the player
   */
  levelUp(): void {
    this.level++;
    this.health = 100; // Reset health on level up
  }

  /**
   * Checks if the player is alive
   */
  isAlive(): boolean {
    return this.health > 0;
  }
} 