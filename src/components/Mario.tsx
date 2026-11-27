import { PLAYER_HEIGHT, PLAYER_WIDTH, SPRITE_PALETTE, SPRITE_ROWS } from "../game/constants";
import type { Player } from "../game/types";

interface Pixel {
  row: number;
  col: number;
  color: string;
}

const PIXELS: Pixel[] = SPRITE_ROWS.flatMap((line, row) =>
  line
    .split("")
    .map((char, col) => ({ row, col, char }))
    .filter(({ char }) => char !== ".")
    .map(({ row, col, char }) => ({ row, col, color: SPRITE_PALETTE[char] }))
);

const FOOT_ROW_START = 14;

export function Mario({ player, tick }: { player: Player; tick: number }) {
  const walking = player.onGround && Math.abs(player.vx) > 0.6;
  const stride = walking ? (((tick >> 3) & 1) === 1 ? 1 : -1) : 0;

  return (
    <svg
      className="mario"
      width={PLAYER_WIDTH}
      height={PLAYER_HEIGHT}
      viewBox="0 0 14 16"
      shapeRendering="crispEdges"
      style={{ transform: `translate(${Math.round(player.x)}px, ${Math.round(player.y)}px) scaleX(${player.face})` }}
    >
      {PIXELS.map(({ row, col, color }) => {
        const footShift = row >= FOOT_ROW_START ? (col < 7 ? stride : -stride) : 0;
        return <rect key={`${row}-${col}`} x={col + footShift} y={row} width={1} height={1} fill={color} />;
      })}
    </svg>
  );
}
