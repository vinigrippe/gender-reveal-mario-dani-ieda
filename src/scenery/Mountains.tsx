import { useId } from "react";
import { GROUND_Y, WORLD_WIDTH } from "../game/constants";

interface PillarSpec {
  x: number;
  width: number;
  top: number;
  light: string;
  dark: string;
  edge?: string;
}

const PALE = { light: "#c4e6e2", dark: "#9cc9c8" };
const BLUE = { light: "#78aede", dark: "#4f86c2", edge: "#2c568f" };

const PILLARS: PillarSpec[] = [
  { x: 10, width: 110, top: 110, ...PALE },
  { x: 190, width: 100, top: 135, ...PALE },
  { x: 330, width: 110, top: 45, ...PALE },
  { x: 130, width: 150, top: 235, ...BLUE },
  { x: 470, width: 170, top: 215, ...BLUE },
  { x: 680, width: 100, top: 255, ...BLUE },
];

function Pillar({ spec, uid }: { spec: PillarSpec; uid: string }) {
  const { x, width, top, light, dark, edge } = spec;
  const radius = width / 2;
  const outline = `M ${x} ${GROUND_Y} L ${x} ${top + radius} A ${radius} ${radius} 0 0 1 ${x + width} ${top + radius} L ${x + width} ${GROUND_Y} Z`;
  const clipId = `${uid}-clip-${x}`;
  const ditherId = `${uid}-dither-${x}`;
  const shadeX = x + width * 0.74;

  return (
    <g>
      <defs>
        <clipPath id={clipId}>
          <path d={outline} />
        </clipPath>
        <pattern id={ditherId} x={shadeX - 12} y={0} width={4} height={4} patternUnits="userSpaceOnUse">
          <rect width={2} height={2} fill={dark} />
          <rect x={2} y={2} width={2} height={2} fill={dark} />
        </pattern>
      </defs>
      <path d={outline} fill={light} />
      <g clipPath={`url(#${clipId})`}>
        <rect x={shadeX} y={top} width={width * 0.26} height={GROUND_Y - top} fill={dark} />
        <rect x={shadeX - 12} y={top} width={12} height={GROUND_Y - top} fill={`url(#${ditherId})`} />
        <ellipse cx={x + width * 0.28} cy={top + width * 0.5} rx={width * 0.05} ry={width * 0.1} fill="rgba(255,255,255,0.85)" />
        <ellipse cx={x + width * 0.28} cy={top + width * 0.92} rx={width * 0.04} ry={width * 0.07} fill="rgba(255,255,255,0.85)" />
        {edge && <path d={outline} fill="none" stroke={edge} strokeWidth={4} />}
      </g>
    </g>
  );
}

export function Mountains({ tiles }: { tiles: number[] }) {
  const uid = useId().replace(/:/g, "");
  const width = tiles.length * WORLD_WIDTH;

  return (
    <svg
      className="mountains"
      style={{ left: tiles[0] }}
      width={width}
      height={GROUND_Y}
      viewBox={`0 0 ${width} ${GROUND_Y}`}
    >
      <defs>
        <g id={`${uid}-tile`}>
          {PILLARS.map((spec) => (
            <Pillar key={spec.x} spec={spec} uid={uid} />
          ))}
        </g>
      </defs>
      {tiles.map((tileX, index) => (
        <use key={tileX} href={`#${uid}-tile`} x={index * WORLD_WIDTH} />
      ))}
    </svg>
  );
}
