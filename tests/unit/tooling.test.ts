import { readFile } from 'node:fs/promises';
import { describe, expect, it } from 'vitest';

interface Lockfile {
  packages: Record<string, { resolved?: string }>;
}

describe('portable dependency installation', () => {
  it('resolves every locked package from the public npm registry', async () => {
    const lockfile = JSON.parse(
      await readFile(new URL('../../package-lock.json', import.meta.url), 'utf8'),
    ) as Lockfile;
    const resolved = Object.values(lockfile.packages)
      .map((entry) => entry.resolved)
      .filter((url): url is string => Boolean(url));

    expect(resolved.length).toBeGreaterThan(0);
    expect(resolved.filter((url) => new URL(url).origin !== 'https://registry.npmjs.org')).toEqual([]);
  });
});
