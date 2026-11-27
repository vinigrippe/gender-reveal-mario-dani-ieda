import type { CSSProperties } from "react";
import type { GiftBoxState } from "../game/types";

const ORBIT_SPARKS = [
  { x: 40, y: 0 },
  { x: 0, y: 40 },
  { x: -40, y: 0 },
  { x: 0, y: -40 },
];

export function GiftBox({ box }: { box: GiftBoxState }) {
  const offsetY = box.bump > 0 ? -Math.sin((box.bump / 10) * Math.PI) * 10 : 0;
  const offsetX = box.shake > 0 ? Math.sin(box.shake * 2) * 4 : 0;

  const className = [
    "gift-box",
    box.special ? "gift-box--special" : "",
    box.opened ? "gift-box--opened" : "",
  ].join(" ");

  const style: CSSProperties = {
    transform: `translate(${Math.round(box.x + offsetX)}px, ${Math.round(box.y + offsetY)}px)`,
  };

  return (
    <div className={className} style={style}>
      {box.opened && (
        <>
          <span className="gift-box__dot" style={{ left: 5, top: 5 }} />
          <span className="gift-box__dot" style={{ right: 5, top: 5 }} />
          <span className="gift-box__dot" style={{ left: 5, bottom: 5 }} />
          <span className="gift-box__dot" style={{ right: 5, bottom: 5 }} />
        </>
      )}

      {!box.opened && !box.special && (
        <div className="gift-box__eyes" style={{ animationDelay: `${box.id * -0.45}s` }}>
          <span />
          <span />
        </div>
      )}

      {!box.opened && box.special && (
        <>
          <span className="gift-box__question">?</span>
          <div className="gift-box__orbit">
            {ORBIT_SPARKS.map((spark, index) => (
              <span key={index} className="gift-box__spark" style={{ left: 24 + spark.x - 2, top: 24 + spark.y - 2 }} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
