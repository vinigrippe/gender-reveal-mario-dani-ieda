import { GROUND_Y } from "../game/constants";
import type { Bounds } from "../game/types";

export function Floor({ bounds, cave = false }: { bounds: Bounds; cave?: boolean }) {
  const top = GROUND_Y - 1;
  return (
    <div
      className={cave ? "floor floor--cave" : "floor"}
      style={{
        left: bounds.left - 20,
        width: bounds.right - bounds.left + 40,
        top,
        height: bounds.bottom - top + 60,
      }}
    >
      <div className="floor__grass" />
      <div className="floor__scallop" />
    </div>
  );
}
