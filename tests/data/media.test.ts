import { existsSync, statSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { media } from '../../src/data/media';

describe('source-reviewed local media', () => {
  it('stores a provenance record for every nonempty local image', () => {
    expect(Object.keys(media).length).toBeGreaterThanOrEqual(9);
    for (const record of Object.values(media)) {
      const path = resolve('src/data', record.src);
      expect(record.src.startsWith('../assets/')).toBe(true);
      expect(existsSync(path), record.src).toBe(true);
      expect(statSync(path).size, record.src).toBeGreaterThan(100);
      if (record.role !== 'partner') expect(record.alt.length).toBeGreaterThan(8);
      expect(record.sourceUrl).toMatch(/^https:\/\/(?:sagro\.ro|cdn\.shopify\.com)\//);
      expect(record.role).toMatch(/^(brand|editorial|partner)$/);
      expect(record).not.toHaveProperty('projectSlug');
    }
  });

  it('limits partner records to the three evidenced relationships', () => {
    const partners = Object.entries(media).filter(([, record]) => record.role === 'partner');
    expect(partners.map(([name]) => name).sort()).toEqual(['greenPower', 'idrofoglia', 'zimmatic']);
    expect(Object.fromEntries(partners.map(([name, record]) => [name, record.alt]))).toEqual({
      greenPower: 'Green Power',
      idrofoglia: 'Idrofoglia',
      zimmatic: 'Zimmatic',
    });
  });
});
