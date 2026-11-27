import { useEffect, useRef, type MutableRefObject } from "react";
import type { Input } from "../game/types";

const KEY_MAP: Record<string, keyof Input> = {
  ArrowLeft: "left",
  a: "left",
  ArrowRight: "right",
  d: "right",
  ArrowUp: "jump",
  w: "jump",
  " ": "jump",
  ArrowDown: "down",
  s: "down",
};

export function useKeyboardInput(): MutableRefObject<Input> {
  const input = useRef<Input>({ left: false, right: false, jump: false, down: false });

  useEffect(() => {
    const handle = (pressed: boolean) => (event: KeyboardEvent) => {
      const action = KEY_MAP[event.key];
      if (!action) return;
      input.current[action] = pressed;
      event.preventDefault();
    };
    const onDown = handle(true);
    const onUp = handle(false);
    window.addEventListener("keydown", onDown);
    window.addEventListener("keyup", onUp);
    return () => {
      window.removeEventListener("keydown", onDown);
      window.removeEventListener("keyup", onUp);
    };
  }, []);

  return input;
}
