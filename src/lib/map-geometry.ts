export interface Box {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface MarkerPosition {
  leftPercent: number;
  topPercent: number;
}

export function getMarkerPosition(
  box: Box,
  viewBoxWidth: 613,
  viewBoxHeight: 433,
): MarkerPosition | null {
  if (
    !Number.isFinite(box.x) || !Number.isFinite(box.y) ||
    !Number.isFinite(box.width) || !Number.isFinite(box.height) ||
    box.width <= 0 || box.height <= 0
  ) {
    return null;
  }

  return {
    leftPercent: ((box.x + box.width / 2) / viewBoxWidth) * 100,
    topPercent: ((box.y + box.height / 2) / viewBoxHeight) * 100,
  };
}
