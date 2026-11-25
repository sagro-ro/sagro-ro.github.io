import { getViteConfig } from 'astro/config';
import { defineConfig } from 'vitest/config';

const astroViteConfig = getViteConfig({});

export default defineConfig(async (environment) => ({
  ...await astroViteConfig(environment),
  test: {
    include: ['tests/data/**/*.test.ts', 'tests/unit/**/*.test.ts'],
  },
}));
