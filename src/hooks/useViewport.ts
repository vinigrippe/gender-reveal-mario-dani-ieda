import { useEffect, useMemo, useState } from "react";
import { computeViewport, type Viewport } from "../utils/viewport";

export function useViewport(): Viewport {
  const [size, setSize] = useState({ width: window.innerWidth, height: window.innerHeight });

  useEffect(() => {
    const onResize = () => setSize({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return useMemo(() => computeViewport(size.width, size.height), [size]);
}
