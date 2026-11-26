import type { CSSProperties } from "react";
import type { FloatingLetterState } from "../game/types";

export function FloatingLetter({ letter }: { letter: FloatingLetterState }) {
  const style = {
    left: letter.x,
    top: letter.y - 10,
    "--letter-color": letter.color,
  } as CSSProperties;

  return (
    <div className={`floating-letter ${letter.special ? "floating-letter--special" : ""}`} style={style}>
      <div className="floating-letter__rise">
        {letter.special && <div className="floating-letter__rays" />}
        <div className="floating-letter__sway">
          <div className="floating-letter__bob">
            <span className="floating-letter__glyph">{letter.char}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
