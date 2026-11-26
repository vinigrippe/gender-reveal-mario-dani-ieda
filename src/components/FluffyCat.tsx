import { GROUND_Y, CAT_BODY_ROWS, CAT_LEG_FRAMES, CAT_PALETTE, CAT_SPEED } from "../game/constants";
import type { Bounds } from "../game/types";

const PIXEL = 3;
const COLS = CAT_BODY_ROWS[0].length;
const ROWS = CAT_BODY_ROWS.length + CAT_LEG_FRAMES[0].length;
const WIDTH = COLS * PIXEL;
const HEIGHT = ROWS * PIXEL;
const LOOP_GAP = 240;

const FRAMES = CAT_LEG_FRAMES.map((legs) =>
  [...CAT_BODY_ROWS, ...legs].flatMap((line, row) =>
    [...line].flatMap((char, col) => (char === "." ? [] : [{ row, col, color: CAT_PALETTE[char] }]))
  )
);

export function FluffyCat({ tick, bounds }: { tick: number; bounds: Bounds }) {
  const distance = (tick * CAT_SPEED) % (bounds.right - bounds.left + WIDTH + LOOP_GAP);
  const frame = (tick >> 2) & 1;
  const x = Math.round(bounds.left - WIDTH + distance);
  const y = GROUND_Y - HEIGHT - (frame === 0 ? PIXEL : 0);

  return (
    <svg
      className="fluffy-cat"
      width={WIDTH}
      height={HEIGHT}
      viewBox={`0 0 ${COLS} ${ROWS}`}
      shapeRendering="crispEdges"
      style={{ transform: `translate(${x}px, ${y}px)` }}
    >
      {FRAMES[frame].map(({ row, col, color }) => (
        <rect key={`${row}-${col}`} x={col} y={row} width={1} height={1} fill={color} />
      ))}
    </svg>
  );
}
