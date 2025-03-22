import {
  generateId,
  calculateDistance,
  isInRange,
  deepClone,
  debounce,
  throttle,
  isValidPosition
} from '../../src/utils/helpers';
import { Position } from '../../src/interfaces';

describe('Helper Utilities', () => {
  describe('generateId', () => {
    it('should generate unique IDs', () => {
      const id1 = generateId();
      const id2 = generateId();
      expect(id1).not.toBe(id2);
    });

    it('should include prefix if provided', () => {
      const id = generateId('test_');
      expect(id.startsWith('test_')).toBe(true);
    });
  });

  describe('calculateDistance', () => {
    it('should calculate correct distance between points', () => {
      const pos1: Position = { x: 0, y: 0, z: 0 };
      const pos2: Position = { x: 3, y: 4, z: 0 };
      const distance = calculateDistance(pos1, pos2);
      expect(distance).toBe(5); // 3-4-5 triangle
    });

    it('should handle 3D distances', () => {
      const pos1: Position = { x: 0, y: 0, z: 0 };
      const pos2: Position = { x: 1, y: 1, z: 1 };
      const distance = calculateDistance(pos1, pos2);
      expect(distance).toBe(Math.sqrt(3));
    });
  });

  describe('isInRange', () => {
    it('should return true when point is within range', () => {
      const pos1: Position = { x: 0, y: 0, z: 0 };
      const pos2: Position = { x: 3, y: 4, z: 0 };
      expect(isInRange(pos1, pos2, 5)).toBe(true);
    });

    it('should return false when point is outside range', () => {
      const pos1: Position = { x: 0, y: 0, z: 0 };
      const pos2: Position = { x: 3, y: 4, z: 0 };
      expect(isInRange(pos1, pos2, 4)).toBe(false);
    });
  });

  describe('deepClone', () => {
    it('should create a deep copy of an object', () => {
      const original = {
        a: 1,
        b: { c: 2 },
        d: [1, 2, 3]
      };
      const cloned = deepClone(original);
      expect(cloned).toEqual(original);
      expect(cloned).not.toBe(original);
      expect(cloned.b).not.toBe(original.b);
      expect(cloned.d).not.toBe(original.d);
    });
  });

  describe('debounce', () => {
    it('should debounce function calls', (done) => {
      let callCount = 0;
      const debouncedFn = debounce(() => {
        callCount++;
      }, 100);

      debouncedFn();
      debouncedFn();
      debouncedFn();

      expect(callCount).toBe(0);

      setTimeout(() => {
        expect(callCount).toBe(1);
        done();
      }, 150);
    });
  });

  describe('throttle', () => {
    it('should throttle function calls', (done) => {
      let callCount = 0;
      const throttledFn = throttle(() => {
        callCount++;
      }, 100);

      throttledFn();
      throttledFn();
      throttledFn();

      expect(callCount).toBe(1);

      setTimeout(() => {
        throttledFn();
        expect(callCount).toBe(2);
        done();
      }, 150);
    });
  });

  describe('isValidPosition', () => {
    it('should reject invalid position objects', () => {
      const invalidPositions = [
        { x: 1, y: 2 }, // Missing z
        { x: '1', y: 2, z: 3 }, // x is string
        { x: 1, y: null, z: 3 }, // y is null
        null, // Null object
        { x: NaN, y: 2, z: 3 }, // x is NaN (if required)
      ];
      invalidPositions.forEach(pos => {
        expect(isValidPosition(pos as Position)).toBe(false);
      });
    });
  });
}); 