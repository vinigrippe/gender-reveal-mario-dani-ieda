import { GROUND_Y, PIPE_HEIGHT, PIPE_WIDTH, PIPE_X } from "../game/constants";

export function Pipe({ rise, hint }: { rise: number; hint: boolean }) {
  return (
    <>
      {hint && (
        <div className="pipe-hint" style={{ left: PIPE_X, top: GROUND_Y - PIPE_HEIGHT - 110, width: PIPE_WIDTH }}>
          ▼
        </div>
      )}
      <div className="pipe" style={{ left: PIPE_X, top: GROUND_Y - PIPE_HEIGHT, width: PIPE_WIDTH, height: PIPE_HEIGHT }}>
        <div className="pipe__body" style={{ transform: `translateY(${(1 - rise) * PIPE_HEIGHT}px)` }}>
          <div className="pipe__lip" />
          <div className="pipe__shaft" />
        </div>
      </div>
    </>
  );
}
