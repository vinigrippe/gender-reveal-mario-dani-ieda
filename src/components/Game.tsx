import { useGameLoop } from "../hooks/useGameLoop";
import { useKeyboardInput } from "../hooks/useKeyboardInput";
import { useViewport } from "../hooks/useViewport";
import { WORLD_HEIGHT, WORLD_WIDTH } from "../game/constants";
import { getTileOffsets } from "../utils/viewport";
import { Bushes } from "../scenery/Bushes";
import { Clouds } from "../scenery/Clouds";
import { Floor } from "../scenery/Floor";
import { Mountains } from "../scenery/Mountains";
import { FloatingLetter } from "./FloatingLetter";
import { GiftBox } from "./GiftBox";
import { Mario } from "./Mario";
import { Overlays } from "./Overlays";
import { Particles } from "./Particles";
import { FluffyCat } from "./FluffyCat";
import { TouchControls } from "./TouchControls";

export function Game() {
  const viewport = useViewport();
  const input = useKeyboardInput();
  const state = useGameLoop(input, viewport.bounds);
  const tiles = getTileOffsets(viewport.bounds);

  return (
    <div className="stage">
      <div className="camera" style={{ transform: `translate(${state.shakeX}px, ${state.shakeY}px)` }}>
        <div
          className="world"
          style={{
            width: WORLD_WIDTH,
            height: WORLD_HEIGHT,
            left: viewport.offsetX,
            top: viewport.offsetY,
            transform: `scale(${viewport.scale})`,
          }}
        >
          <Mountains tiles={tiles} />
          <Clouds bounds={viewport.bounds} />
          {state.prank === "done" && <FluffyCat tick={state.tick - state.prankTick} bounds={viewport.bounds} />}
          <Bushes tiles={tiles} />
          <Floor bounds={viewport.bounds} />

          {state.boxes.map((box) => (
            <GiftBox key={box.id} box={box} />
          ))}
          <Mario player={state.player} tick={state.tick} />
          {state.letters.map((letter) => (
            <FloatingLetter key={letter.id} letter={letter} />
          ))}
          <Particles particles={state.particles} />
          <Overlays state={state} bounds={viewport.bounds} />
        </div>
      </div>
      <TouchControls input={input} />
    </div>
  );
}
