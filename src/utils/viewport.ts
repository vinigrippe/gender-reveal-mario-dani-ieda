import { MAX_SCALE, WORLD_HEIGHT, WORLD_WIDTH } from "../game/constants";
import type { Bounds } from "../game/types";

export interface Viewport {
  width: number;
  height: number;
  scale: number;
  offsetX: number;
  offsetY: number;
  /** Visible area expressed in world coordinates. */
  bounds: Bounds;
}

export function computeViewport(width: number, height: number): Viewport {
  const scale = Math.min(width / WORLD_WIDTH, height / WORLD_HEIGHT, MAX_SCALE);
  const offsetX = (width - WORLD_WIDTH * scale) / 2;
  const offsetY = (height - WORLD_HEIGHT * scale) / 2;
  return {
    width,
    height,
    scale,
    offsetX,
    offsetY,
    bounds: {
      left: -offsetX / scale,
      right: (width - offsetX) / scale,
      top: -offsetY / scale,
      bottom: (height - offsetY) / scale,
    },
  };
}

/** X offsets of every 800px-wide scenery tile needed to cover the visible area. */
export function getTileOffsets(bounds: Bounds): number[] {
  const tiles: number[] = [];
  for (let x = Math.floor(bounds.left / WORLD_WIDTH) * WORLD_WIDTH; x < bounds.right; x += WORLD_WIDTH) {
    tiles.push(x);
  }
  return tiles;
}
