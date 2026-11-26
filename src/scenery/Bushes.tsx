import { GROUND_Y } from "../game/constants";

const BUSH_X = [40, 750];
const BLOBS = [
  { cx: 0, r: 22 },
  { cx: 24, r: 16 },
  { cx: -22, r: 14 },
];

function Bush({ x }: { x: number }) {
  return (
    <svg className="bush" style={{ left: x - 50, top: GROUND_Y - 30 }} width={100} height={34} viewBox="-50 -30 100 34">
      {BLOBS.map((blob) => (
        <path
          key={blob.cx}
          d={`M ${blob.cx - blob.r} 0 A ${blob.r} ${blob.r} 0 0 1 ${blob.cx + blob.r} 0 Z`}
          fill="#2f9e35"
          stroke="#12561a"
          strokeWidth={3}
        />
      ))}
      <rect x={-4} y={-20} width={6} height={3} fill="#8be88b" />
    </svg>
  );
}

export function Bushes({ tiles }: { tiles: number[] }) {
  return (
    <>
      {tiles.flatMap((tileX) => BUSH_X.map((x) => <Bush key={`${tileX}-${x}`} x={tileX + x} />))}
    </>
  );
}
