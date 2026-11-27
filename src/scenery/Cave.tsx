import { useId } from "react";
import { GROUND_Y, WORLD_WIDTH } from "../game/constants";
import type { Bounds } from "../game/types";

interface Rock {
  x: number;
  width: number;
  /** Stalagmites: top of the rock. Stalactites: bottom tip. */
  y: number;
}

const BACK = { fill: "#2c2f4a", edge: "#1d1f33" };
const FRONT = { fill: "#6b5852", shade: "#54433e", edge: "#3a2d29" };

const BACK_STALACTITES: Rock[] = [
  { x: 20, width: 70, y: 120 },
  { x: 250, width: 60, y: 70 },
  { x: 430, width: 80, y: 140 },
  { x: 640, width: 70, y: 90 },
];
const BACK_STALAGMITES: Rock[] = [
  { x: 110, width: 60, y: 150 },
  { x: 330, width: 50, y: 190 },
  { x: 560, width: 60, y: 140 },
  { x: 730, width: 50, y: 180 },
];
const FRONT_STALACTITES: Rock[] = [
  { x: 150, width: 46, y: 160 },
  { x: 540, width: 40, y: 130 },
];
const FRONT_STALAGMITES: Rock[] = [
  { x: 20, width: 56, y: 120 },
  { x: 200, width: 44, y: 70 },
  { x: 390, width: 52, y: 110 },
  { x: 600, width: 46, y: 60 },
];
const SPARKLES = [
  { x: 70, y: 70 },
  { x: 190, y: 30 },
  { x: 300, y: 120 },
  { x: 470, y: 20 },
  { x: 520, y: 170 },
  { x: 690, y: 90 },
  { x: 760, y: 200 },
  { x: 360, y: 260 },
  { x: 120, y: 250 },
];

function stalagmite({ x, width, y }: Rock) {
  const r = width / 2;
  return `M ${x} ${GROUND_Y} L ${x} ${y + r} A ${r} ${r} 0 0 1 ${x + width} ${y + r} L ${x + width} ${GROUND_Y} Z`;
}

function stalactite({ x, width, y }: Rock, ceiling: number) {
  const r = width / 2;
  return `M ${x} ${ceiling} L ${x} ${y - r} A ${r} ${r} 0 0 0 ${x + width} ${y - r} L ${x + width} ${ceiling} Z`;
}

export function Cave({ tiles, bounds, leaving }: { tiles: number[]; bounds: Bounds; leaving: boolean }) {
  const ceiling = Math.min(0, bounds.top) - 20;
  const height = GROUND_Y - ceiling;
  const width = tiles.length * WORLD_WIDTH;
  const shadeId = `${useId().replace(/:/g, "")}-shade`;
  const front = { fill: `url(#${shadeId})`, stroke: FRONT.edge, strokeWidth: 3 };

  return (
    <svg
      className={leaving ? "cave cave--leaving" : "cave"}
      style={{ left: tiles[0], top: ceiling }}
      width={width}
      height={height}
      viewBox={`0 ${ceiling} ${width} ${height}`}
    >
      <defs>
        <linearGradient id={shadeId}>
          <stop offset="0.65" stopColor={FRONT.fill} />
          <stop offset="0.65" stopColor={FRONT.shade} />
        </linearGradient>
      </defs>
      {tiles.map((_, index) => (
        <g key={index} transform={`translate(${index * WORLD_WIDTH} 0)`}>
          {BACK_STALACTITES.map((rock) => (
            <path key={`bt${rock.x}`} d={stalactite(rock, ceiling)} fill={BACK.fill} stroke={BACK.edge} strokeWidth={3} />
          ))}
          {BACK_STALAGMITES.map((rock) => (
            <path key={`bm${rock.x}`} d={stalagmite(rock)} fill={BACK.fill} stroke={BACK.edge} strokeWidth={3} />
          ))}
          {FRONT_STALACTITES.map((rock) => (
            <path key={`ft${rock.x}`} d={stalactite(rock, ceiling)} {...front} />
          ))}
          {FRONT_STALAGMITES.map((rock) => (
            <path key={`fm${rock.x}`} d={stalagmite(rock)} {...front} />
          ))}
          {SPARKLES.map((s, i) => (
            <path
              key={`s${s.x}`}
              className="cave__sparkle"
              style={{ animationDelay: `${i * -0.37}s` }}
              d={`M ${s.x} ${s.y - 4} L ${s.x + 2} ${s.y} L ${s.x} ${s.y + 4} L ${s.x - 2} ${s.y} Z`}
              fill="#fff"
            />
          ))}
        </g>
      ))}
    </svg>
  );
}
