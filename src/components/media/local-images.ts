import { getImage } from 'astro:assets';

export interface SourceImageReference {
  readonly src: `../assets/${string}`;
  readonly alt: string;
}

const sources = import.meta.glob<ImageMetadata>('../../assets/**/*.{png,jpg,jpeg,webp,avif}', {
  eager: true,
  import: 'default',
  caseSensitive: false,
});

export function resolveSourceImage(record: SourceImageReference): ImageMetadata {
  const image = sources[record.src.replace('../assets/', '../../assets/')];
  if (!image) throw new Error(`Missing reviewed local media: ${record.src}`);
  return image;
}

export async function getFullSizeSourceUrl(record: SourceImageReference): Promise<string> {
  const image = resolveSourceImage(record);
  const fullSize = await getImage({ src: image, width: image.width, format: 'webp' });
  return fullSize.src;
}
