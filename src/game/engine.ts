import {
	BOX_SIZE,
	BOX_SPACING,
	BOX_START_X,
	BOX_Y,
	FAKE_LETTER,
	FADE_TICKS,
	FAKE_REVEAL_TICKS,
	GROUND_Y,
	LETTER_COLORS,
	PHYSICS,
	PIPE_ENTER_TICKS,
	PIPE_HEIGHT,
	PIPE_RISE_TICKS,
	PIPE_WIDTH,
	PIPE_X,
	PLAYER_HEIGHT,
	PLAYER_WIDTH,
	REVEAL_BURST_COLORS,
	SPECIAL_BURST_COLORS,
	SPECIAL_INDEX,
	WORD,
} from "./constants";
import { playSound, stopMusic } from "./sound";
import type { Bounds, GameState, GiftBoxState, Input } from "./types";

export function createInitialState(): GameState {
	return {
		tick: 0,
		nextId: 1,
		player: {
			x: 40,
			y: GROUND_Y - PLAYER_HEIGHT,
			vx: 0,
			vy: 0,
			onGround: true,
			face: 1,
		},
		boxes: WORD.map(
			(letter, index): GiftBoxState => ({
				id: index,
				x: BOX_START_X + index * BOX_SPACING,
				y: BOX_Y,
				letter,
				special: index === SPECIAL_INDEX,
				opened: false,
				bump: 0,
				shake: 0,
			}),
		),
		letters: [],
		particles: [],
		flash: 0,
		spotlight: 0,
		shake: 0,
		shakeX: 0,
		shakeY: 0,
		toast: "",
		toastTicks: 0,
		prank: "none",
		prankTick: 0,
		phase: "overworld",
		pipe: 0,
		transitionTick: null,
		fade: 0,
		caveBox: {
			id: WORD.length,
			x: BOX_START_X + SPECIAL_INDEX * BOX_SPACING,
			y: BOX_Y,
			letter: WORD[SPECIAL_INDEX],
			special: true,
			opened: false,
			bump: 0,
			shake: 0,
		},
	};
}

function cloneState(state: GameState): GameState {
	return {
		...state,
		player: { ...state.player },
		boxes: state.boxes.map((box) => ({ ...box })),
		caveBox: { ...state.caveBox },
		letters: state.letters.map((letter) => ({ ...letter })),
		particles: state.particles.map((particle) => ({ ...particle })),
	};
}

const clamp = (value: number, min: number, max: number) =>
	Math.max(min, Math.min(max, value));

function spawnBurst(
	state: GameState,
	x: number,
	y: number,
	count: number,
	colors: string[],
	speed: number,
) {
	for (let i = 0; i < count; i++) {
		const angle = Math.random() * Math.PI * 2;
		const velocity = Math.random() * speed + 1;
		state.particles.push({
			id: state.nextId++,
			x,
			y,
			vx: Math.cos(angle) * velocity,
			vy: Math.sin(angle) * velocity - 2,
			life: 40 + Math.random() * 40,
			color: colors[i % colors.length],
			size: 3 + Math.random() * 4,
		});
	}
}

function celebrate(
	state: GameState,
	box: GiftBoxState,
	colors = SPECIAL_BURST_COLORS,
) {
	state.flash = 1;
	state.spotlight = 200;
	state.shake = 28;
	spawnBurst(state, box.x + BOX_SIZE / 2, 120, 90, colors, 7);
}

export function activeBoxes(state: GameState): GiftBoxState[] {
	if (state.phase === "cave") return [state.caveBox];
	return state.prank === "none" || state.prank === "fake" ? state.boxes : [];
}

function raisePipe(state: GameState) {
	state.prank = "message";
	state.prankTick = state.tick;
	state.shake = 12;
	for (const box of state.boxes) {
		spawnBurst(state, box.x + BOX_SIZE / 2, box.y + BOX_SIZE / 2, 12, ["#ffffff", "#ffd24a", "#c49a6c"], 3);
	}
}

function enterCave(state: GameState) {
	state.phase = "cave";
	state.particles = [];
	state.player = {
		x: 40,
		y: GROUND_Y - PLAYER_HEIGHT,
		vx: 0,
		vy: 0,
		onGround: true,
		face: 1,
	};
}

function stepTransition(state: GameState) {
	if (state.transitionTick === null) return;
	const t = state.tick - state.transitionTick;
	const fadeStart = PIPE_ENTER_TICKS;
	const fadePeak = fadeStart + FADE_TICKS;

	if (t < fadeStart) state.player.y += PIPE_HEIGHT / PIPE_ENTER_TICKS;
	else if (t < fadePeak) state.fade = (t - fadeStart) / FADE_TICKS;
	else if (t === fadePeak) enterCave(state);
	else if (t < fadePeak + FADE_TICKS) state.fade = 1 - (t - fadePeak) / FADE_TICKS;
	else {
		state.fade = 0;
		state.transitionTick = null;
	}
}

function revealRealLetter(state: GameState, realBox: GiftBoxState) {
	realBox.opened = true;
	realBox.bump = 10;
	const letter = state.letters.find((other) => other.special);
	if (letter) {
		letter.id = state.nextId++;
		letter.char = realBox.letter;
	}
	state.prank = "done";
	state.prankTick = state.tick;
	celebrate(state, realBox, REVEAL_BURST_COLORS);
	stopMusic();
	playSound("victory");
}

function openBox(state: GameState, box: GiftBoxState) {
	const othersClosed = state.boxes.some(
		(other) => !other.special && !other.opened,
	);
	const fakeReveal =
		state.phase === "overworld" && box.special && !box.opened && !othersClosed;
	playSound(fakeReveal ? "death" : "coin");

	if (box.opened) {
		box.bump = 6;
		return;
	}

	if (state.phase === "cave") {
		revealRealLetter(state, box);
		return;
	}

	if (box.special && othersClosed) {
		box.shake = 24;
		state.toast = "Malandrinhos! Abra todas as outras caixas primeiro!";
		state.toastTicks = 120;
		return;
	}

	box.opened = true;
	box.bump = 10;
	state.letters.push({
		id: state.nextId++,
		char: box.special ? FAKE_LETTER : box.letter,
		x: box.x + BOX_SIZE / 2,
		y: box.y,
		color: LETTER_COLORS[box.id],
		special: box.special,
	});

	if (box.special) {
		celebrate(state, box);
		state.prank = "fake";
		state.prankTick = state.tick;
	} else {
		spawnBurst(
			state,
			box.x + BOX_SIZE / 2,
			box.y,
			18,
			["#ffd24a", "#ffffff", LETTER_COLORS[box.id]],
			4,
		);
	}
}

function collidePipe(state: GameState, input: Input, previousY: number) {
	if (state.phase !== "overworld" || state.pipe === 0) return;
	const p = state.player;
	const top = GROUND_Y - PIPE_HEIGHT * state.pipe;
	const overlapsX = p.x + PLAYER_WIDTH > PIPE_X && p.x < PIPE_X + PIPE_WIDTH;
	if (!overlapsX || p.y + PLAYER_HEIGHT <= top) return;

	const cameFromAbove = previousY + PLAYER_HEIGHT <= top + 1;
	if (cameFromAbove || state.pipe < 1) {
		p.y = top - PLAYER_HEIGHT;
		p.vy = 0;
		p.onGround = true;
		if (input.down && state.pipe === 1 && state.transitionTick === null) {
			state.transitionTick = state.tick;
			p.x = PIPE_X + (PIPE_WIDTH - PLAYER_WIDTH) / 2;
			p.vx = 0;
		}
		return;
	}

	const fromLeft = p.x + PLAYER_WIDTH / 2 < PIPE_X + PIPE_WIDTH / 2;
	p.x = fromLeft ? PIPE_X - PLAYER_WIDTH : PIPE_X + PIPE_WIDTH;
	p.vx = 0;
}

function movePlayer(state: GameState, input: Input, bounds: Bounds) {
	const p = state.player;
	if (state.transitionTick !== null && state.phase === "overworld") return;

	if (input.left) {
		p.vx -= PHYSICS.acceleration;
		p.face = -1;
	}
	if (input.right) {
		p.vx += PHYSICS.acceleration;
		p.face = 1;
	}
	p.vx *= PHYSICS.friction;
	p.x = clamp(p.x + p.vx, bounds.left, bounds.right - PLAYER_WIDTH);

	if (input.jump && p.onGround) {
		p.vy = PHYSICS.jumpSpeed;
		p.onGround = false;
		playSound("jump");
	}

	const previousY = p.y;
	p.vy += PHYSICS.gravity;
	p.y += p.vy;
	p.onGround = false;

	if (p.vy < 0) {
		for (const box of activeBoxes(state)) {
			const overlapsX =
				p.x + PLAYER_WIDTH > box.x + 4 && p.x < box.x + BOX_SIZE - 4;
			const boxBottom = box.y + BOX_SIZE;
			if (overlapsX && previousY >= boxBottom - 2 && p.y < boxBottom) {
				p.y = boxBottom;
				p.vy = 1;
				openBox(state, box);
			}
		}
	}

	if (p.y + PLAYER_HEIGHT >= GROUND_Y) {
		p.y = GROUND_Y - PLAYER_HEIGHT;
		p.vy = 0;
		p.onGround = true;
	}

	collidePipe(state, input, previousY);
}

export function stepGame(
	previous: GameState,
	input: Input,
	bounds: Bounds,
): GameState {
	const state = cloneState(previous);
	state.tick++;

	movePlayer(state, input, bounds);
	stepTransition(state);

	for (const box of [...state.boxes, state.caveBox]) {
		if (box.bump > 0) box.bump--;
		if (box.shake > 0) box.shake--;
	}

	for (const particle of state.particles) {
		particle.x += particle.vx;
		particle.y += particle.vy;
		particle.vy += 0.15;
		particle.life--;
	}
	state.particles = state.particles.filter((particle) => particle.life > 0);

	if (state.flash > 0) state.flash -= 0.02;
	if (state.spotlight > 0) state.spotlight--;
	if (state.toastTicks > 0) state.toastTicks--;
	if (
		state.prank === "fake" &&
		state.tick - state.prankTick >= FAKE_REVEAL_TICKS
	)
		raisePipe(state);
	if (state.prank === "message" && state.pipe < 1)
		state.pipe = Math.min(1, state.pipe + 1 / PIPE_RISE_TICKS);
	if (state.shake > 0) state.shake--;

	state.shakeX =
		state.shake > 0 ? (Math.random() - 0.5) * state.shake * 0.4 : 0;
	state.shakeY =
		state.shake > 0 ? (Math.random() - 0.5) * state.shake * 0.4 : 0;

	return state;
}
