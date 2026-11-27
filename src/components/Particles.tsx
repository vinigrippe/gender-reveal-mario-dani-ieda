import type { ParticleState } from "../game/types";

export function Particles({ particles }: { particles: ParticleState[] }) {
  return (
    <>
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="particle"
          style={{
            width: particle.size,
            height: particle.size,
            background: particle.color,
            opacity: Math.min(1, particle.life / 20),
            transform: `translate(${particle.x}px, ${particle.y}px)`,
          }}
        />
      ))}
    </>
  );
}
