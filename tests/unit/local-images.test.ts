import { describe, expect, it } from 'vitest';
import { resolveSourceImage, type SourceImageReference } from '../../src/components/media/local-images';

// Generated solid-color inputs exercise discovery only; they are not public county media.
const supportedPhotoPaths = [
  '../assets/__tests__/county-gallery/fixture.webp',
  '../assets/__tests__/county-gallery/fixture.avif',
  '../assets/__tests__/county-gallery/fixture.JPG',
] as const;

describe('local source-image discovery', () => {
  it.each(supportedPhotoPaths)('resolves a future supplied photo at %s without viewer changes', (src) => {
    const record: SourceImageReference = { src, alt: 'Fixtură locală pentru testarea formatului.' };

    expect(resolveSourceImage(record)).toMatchObject({ width: 8, height: 6 });
  });
});
