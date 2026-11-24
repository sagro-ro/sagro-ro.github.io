const projectHashPrefix = '#proiect-';

export function getProjectSlugFromHash(hash: string, availableSlugs: readonly string[]): string | null {
  if (!hash.startsWith(projectHashPrefix)) return null;

  const encodedSlug = hash.slice(projectHashPrefix.length);
  if (!encodedSlug) return null;

  try {
    const slug = decodeURIComponent(encodedSlug);
    return slug && availableSlugs.includes(slug) ? slug : null;
  } catch {
    return null;
  }
}
