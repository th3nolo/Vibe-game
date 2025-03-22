import { Position } from '../interfaces';

/**
 * Utility functions for the MMO RPG server
 */

/**
 * Generates a unique ID
 */
export function generateId(prefix: string = ''): string {
  return `${prefix}${Date.now()}_${Math.random().toString(36).slice(2)}`;
}

/**
 * Calculates distance between two positions
 */
export function calculateDistance(pos1: Position, pos2: Position): number {
  const dx = pos2.x - pos1.x;
  const dy = pos2.y - pos1.y;
  const dz = pos2.z - pos1.z;
  return Math.sqrt(dx * dx + dy * dy + dz * dz);
}

/**
 * Checks if a position is within a given range of another position
 */
export function isInRange(pos1: Position, pos2: Position, range: number): boolean {
  return calculateDistance(pos1, pos2) <= range;
}

/**
 * Deep clones an object
 */
export function deepClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

/**
 * Debounces a function
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Throttles a function
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  return function executedFunction(...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

/**
 * Validates a position object
 */
export function isValidPosition(pos: Position): boolean {
  if (
    pos != null &&
    typeof pos.x === 'number' && !isNaN(pos.x) &&
    typeof pos.y === 'number' && !isNaN(pos.y) &&
    typeof pos.z === 'number' && !isNaN(pos.z)
  ) {
    // Retain range validation
    return pos.x >= 0 && pos.x <= 100 && 
           pos.y >= 0 && pos.y <= 100 && 
           pos.z >= 0 && pos.z <= 100;
  }
  return false;
}