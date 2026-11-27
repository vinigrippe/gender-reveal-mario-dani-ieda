import type { CSSProperties } from "react";
import type { Bounds } from "../game/types";

interface CloudSpec {
  y: number;
  width: number;
  height: number;
  duration: number;
  phase: number;
}

const CLOUDS: CloudSpec[] = [
  { y: 60, width: 150, height: 22, duration: 120, phase: 0.0 },
  { y: 120, width: 170, height: 22, duration: 140, phase: 0.33 },
  { y: 70, width: 150, height: 20, duration: 110, phase: 0.62 },
  { y: 170, width: 190, height: 24, duration: 150, phase: 0.85 },
  { y: -40, width: 170, height: 22, duration: 130, phase: 0.15 },
  { y: -90, width: 150, height: 20, duration: 160, phase: 0.5 },
  { y: -30, width: 160, height: 22, duration: 125, phase: 0.75 },
];

export function Clouds({ bounds }: { bounds: Bounds }) {
  return (
    <>
      {CLOUDS.map((cloud, index) => {
        const style = {
          top: cloud.y,
          width: cloud.width,
          height: cloud.height,
          borderRadius: cloud.height / 2,
          animationDuration: `${cloud.duration}s`,
          animationDelay: `${-cloud.duration * cloud.phase}s`,
          "--from": `${bounds.left - cloud.width}px`,
          "--to": `${bounds.right}px`,
        } as CSSProperties;
        return <div key={index} className="cloud" style={style} />;
      })}
    </>
  );
}
