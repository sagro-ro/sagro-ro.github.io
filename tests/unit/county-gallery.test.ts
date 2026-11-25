import { describe, expect, it } from 'vitest';
import { countyMedia } from '../../src/data/county-media';
import { nextPhotoIndex } from '../../src/scripts/gallery-state';

describe('county media', () => {
  it('keeps the initial two photographs in the Olt collection only', () => {
    expect(Object.keys(countyMedia)).toEqual(['olt']);
    expect(countyMedia.olt?.map((photo) => photo.src)).toEqual([
      '../assets/projects/olt/olt1.jpeg',
      '../assets/projects/olt/olt2.jpeg',
    ]);
    for (const photo of countyMedia.olt ?? []) {
      expect(photo.alt).toContain('județul Olt');
    }
    expect(JSON.stringify(countyMedia)).not.toMatch(/Corabia|exact installation|sourceUrl/i);
  });

  it('derives previous and next indexes from arbitrary gallery lengths', () => {
    expect(nextPhotoIndex(0, 1, 4)).toBe(1);
    expect(nextPhotoIndex(3, 1, 4)).toBe(0);
    expect(nextPhotoIndex(0, -1, 4)).toBe(3);
    expect(nextPhotoIndex(2, -1, 4)).toBe(1);
    expect(nextPhotoIndex(0, 1, 1)).toBe(0);
  });
});
