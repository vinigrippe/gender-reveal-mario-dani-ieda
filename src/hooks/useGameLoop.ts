import { useEffect, useRef, useState, type MutableRefObject } from "react";
import { createInitialState, stepGame } from "../game/engine";
import type { Bounds, GameState, Input } from "../game/types";

export function useGameLoop(input: MutableRefObject<Input>, bounds: Bounds): GameState {
  const [state, setState] = useState<GameState>(createInitialState);
  const stateRef = useRef(state);
  const boundsRef = useRef(bounds);

  useEffect(() => {
    boundsRef.current = bounds;
  }, [bounds]);

  useEffect(() => {
    let frame = 0;
    const loop = () => {
      stateRef.current = stepGame(stateRef.current, input.current, boundsRef.current);
      setState(stateRef.current);
      frame = requestAnimationFrame(loop);
    };
    frame = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(frame);
  }, [input]);

  return state;
}
