export interface Input {
  left: boolean;
  right: boolean;
  jump: boolean;
}

export interface Bounds {
  left: number;
  right: number;
  top: number;
  bottom: number;
}

export interface Player {
  x: number;
  y: number;
  vx: number;
  vy: number;
  onGround: boolean;
  face: 1 | -1;
}

export interface GiftBoxState {
  id: number;
  x: number;
  y: number;
  letter: string;
  special: boolean;
  opened: boolean;
  bump: number;
  shake: number;
}

export interface FloatingLetterState {
  id: number;
  char: string;
  x: number;
  y: number;
  color: string;
  special: boolean;
}

export interface ParticleState {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  color: string;
  size: number;
}

export interface GameState {
  tick: number;
  nextId: number;
  player: Player;
  boxes: GiftBoxState[];
  letters: FloatingLetterState[];
  particles: ParticleState[];
  flash: number;
  spotlight: number;
  shake: number;
  shakeX: number;
  shakeY: number;
  toast: string;
  toastTicks: number;
  prank: "none" | "fake" | "message" | "done";
  prankTick: number;
}
