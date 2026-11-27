import { useEffect } from "react";
import { startMusic } from "../game/sound";
import { useGameLoop } from "../hooks/useGameLoop";
import { useKeyboardInput } from "../hooks/useKeyboardInput";
import { useViewport } from "../hooks/useViewport";
import { WORLD_HEIGHT, WORLD_WIDTH } from "../game/constants";
import { activeBoxes } from "../game/engine";
import { getTileOffsets } from "../utils/viewport";
import { Bushes } from "../scenery/Bushes";
import { Cave } from "../scenery/Cave";
import { Clouds } from "../scenery/Clouds";
import { Floor } from "../scenery/Floor";
import { Mountains } from "../scenery/Mountains";
import { FloatingLetter } from "./FloatingLetter";
import { GiftBox } from "./GiftBox";
import { Mario } from "./Mario";
import { Messages, Overlays } from "./Overlays";
import { Particles } from "./Particles";
import { Pipe } from "./Pipe";
import { FluffyCat } from "./FluffyCat";
import { TouchControls } from "./TouchControls";

export function Game() {
  const viewport = useViewport();
  const input = useKeyboardInput();
  const state = useGameLoop(input, viewport.bounds);
  const tiles = getTileOffsets(viewport.bounds);
  const cave = state.phase === "cave";
  const showCave = cave && state.prank !== "done";
  const sceneryClass = cave ? "scenery scenery--fade-in" : "scenery";

  useEffect(() => {
    const events = ["keydown", "pointerdown", "touchend"];
    for (const event of events) window.addEventListener(event, startMusic);
    return () => {
      for (const event of events) window.removeEventListener(event, startMusic);
    };
  }, []);

  return (
    <div className={showCave ? "stage stage--cave" : "stage"}>
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
          {cave && <Cave tiles={tiles} bounds={viewport.bounds} leaving={!showCave} />}
          {!showCave && (
            <div className={sceneryClass}>
              <Mountains tiles={tiles} />
              <Clouds bounds={viewport.bounds} />
            </div>
          )}
          {state.prank === "done" && <FluffyCat tick={state.tick - state.prankTick} bounds={viewport.bounds} />}
          {cave && <Floor bounds={viewport.bounds} cave />}
          {!showCave && (
            <div className={sceneryClass}>
              <Bushes tiles={tiles} />
              <Floor bounds={viewport.bounds} />
            </div>
          )}

          {activeBoxes(state).map((box) => (
            <GiftBox key={box.id} box={box} reveal={box === state.caveBox} />
          ))}
          <Mario player={state.player} tick={state.tick} />
          {!cave && state.pipe > 0 && (
            <Pipe rise={state.pipe} hint={state.pipe === 1 && state.transitionTick === null} />
          )}
          {state.letters.map((letter) => (
            <FloatingLetter key={letter.id} letter={letter} />
          ))}
          <Particles particles={state.particles} />
          <Overlays state={state} bounds={viewport.bounds} />
        </div>
      </div>
      <Messages state={state} screen />
      <TouchControls input={input} />
    </div>
  );
}
