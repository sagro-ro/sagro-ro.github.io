export function nextPhotoIndex(current: number, direction: number, photoCount: number): number {
  return (current + direction + photoCount) % photoCount;
}
