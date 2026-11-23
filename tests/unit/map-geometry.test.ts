import romania from '@svg-maps/romania';
import { describe, expect, it } from 'vitest';
import { getMarkerPosition } from '../../src/lib/map-geometry';

describe('Romania map geometry', () => {
  it('converts a county box center to map percentages', () => {
    const position = getMarkerPosition({ x: 100, y: 50, width: 100, height: 50 }, 613, 433);
    expect(position).not.toBeNull();
    expect(position?.leftPercent).toBeCloseTo((150 / 613) * 100, 8);
    expect(position?.topPercent).toBeCloseTo((75 / 433) * 100, 8);
  });

  it('allows marker centers on the 0% and 100% edges', () => {
    expect(getMarkerPosition({ x: -10, y: -5, width: 20, height: 10 }, 613, 433)).toEqual({ leftPercent: 0, topPercent: 0 });
    expect(getMarkerPosition({ x: 603, y: 423, width: 20, height: 20 }, 613, 433)).toEqual({ leftPercent: 100, topPercent: 100 });
  });

  it.each([
    { x: 0, y: 0, width: 0, height: 10 },
    { x: 0, y: 0, width: 10, height: 0 },
    { x: 0, y: 0, width: -1, height: 10 },
    { x: 0, y: 0, width: 10, height: -1 },
    { x: NaN, y: 0, width: 10, height: 10 },
    { x: 0, y: NaN, width: 10, height: 10 },
    { x: 0, y: 0, width: NaN, height: 10 },
    { x: 0, y: 0, width: Infinity, height: 10 },
  ])('rejects invalid dimensions: %j', (box) => {
    expect(getMarkerPosition(box, 613, 433)).toBeNull();
  });

  it('uses the verified Romanian county ids and viewBox', () => {
    expect(romania.viewBox).toBe('0 0 613 433');
    expect(romania.locations.map((location) => location.id)).toEqual(expect.arrayContaining(['ro-cl', 'ro-il', 'ro-ct']));
    for (const id of ['ro-cl', 'ro-il', 'ro-ct']) {
      expect(romania.locations.find((location) => location.id === id)?.path.length).toBeGreaterThan(20);
    }
  });
});
