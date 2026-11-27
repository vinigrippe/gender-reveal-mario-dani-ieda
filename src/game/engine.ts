import {
	BOX_SIZE,
	BOX_SPACING,
	BOX_START_X,
	BOX_Y,
	FAKE_LETTER,
	FAKE_REVEAL_TICKS,
	GROUND_Y,
	LETTER_COLORS,
	PHYSICS,
	PLAYER_HEIGHT,
	PLAYER_WIDTH,
	SPECIAL_BURST_COLORS,
	SPECIAL_INDEX,
	WORD,
} from "./constants";
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
	};
}

function cloneState(state: GameState): GameState {
	return {
		...state,
		player: { ...state.player },
		boxes: state.boxes.map((box) => ({ ...box })),
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

function celebrate(state: GameState, box: GiftBoxState) {
	state.flash = 1;
	state.spotlight = 200;
	state.shake = 28;
	spawnBurst(state, box.x + BOX_SIZE / 2, 120, 90, SPECIAL_BURST_COLORS, 7);
}

function showRealBox(state: GameState) {
	const box = state.boxes[SPECIAL_INDEX];
	box.opened = false;
	box.bump = 10;
	state.prank = "message";
	state.prankTick = state.tick;
	state.shake = 12;
	spawnBurst(
		state,
		box.x + BOX_SIZE / 2,
		box.y + BOX_SIZE / 2,
		30,
		SPECIAL_BURST_COLORS,
		4,
	);
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
	celebrate(state, realBox);
}

function openBox(state: GameState, box: GiftBoxState) {
	if (box.opened) {
		box.bump = 6;
		return;
	}

	if (box.special && state.prank === "message") {
		revealRealLetter(state, box);
		return;
	}

	const othersClosed = state.boxes.some(
		(other) => !other.special && !other.opened,
	);
	if (box.special && othersClosed) {
		box.shake = 24;
		state.toast = "Malandrinho! Abra todas as outras caixas primeiro!";
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

function movePlayer(state: GameState, input: Input, bounds: Bounds) {
	const p = state.player;

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
	}

	const previousY = p.y;
	p.vy += PHYSICS.gravity;
	p.y += p.vy;

	if (p.vy < 0) {
		for (const box of state.boxes) {
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
}

export function stepGame(
	previous: GameState,
	input: Input,
	bounds: Bounds,
): GameState {
	const state = cloneState(previous);
	state.tick++;

	movePlayer(state, input, bounds);

	for (const box of state.boxes) {
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
		showRealBox(state);
	if (state.shake > 0) state.shake--;

	state.shakeX =
		state.shake > 0 ? (Math.random() - 0.5) * state.shake * 0.4 : 0;
	state.shakeY =
		state.shake > 0 ? (Math.random() - 0.5) * state.shake * 0.4 : 0;

	return state;
}
