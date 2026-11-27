import {
	BOX_SIZE,
	PRANK_MESSAGE,
	SPECIAL_INDEX,
	WORLD_WIDTH,
} from "../game/constants";
import type { Bounds, GameState } from "../game/types";

const MARGIN = 120;

export function Overlays({
	state,
	bounds,
}: {
	state: GameState;
	bounds: Bounds;
}) {
	const cover = {
		left: bounds.left - MARGIN,
		top: bounds.top - MARGIN,
		width: bounds.right - bounds.left + MARGIN * 2,
		height: bounds.bottom - bounds.top + MARGIN * 2,
	};

	const specialBox = state.boxes[SPECIAL_INDEX];
	const spot = state.spotlight;
	const alpha =
		Math.min(0.75, spot / 60) * (spot > 170 ? (200 - spot) / 30 : 1);
	const spotX = specialBox.x + BOX_SIZE / 2 - cover.left;
	const spotY = 90 - cover.top;

	return (
		<>
			{spot > 0 && (
				<div
					className="overlay"
					style={{
						...cover,
						background: `radial-gradient(circle 280px at ${spotX}px ${spotY}px, rgba(40,0,70,0) 30px, rgba(20,0,40,${alpha}) 280px)`,
					}}
				/>
			)}

			{state.prank === "done" ? (
				<div className="surprise" style={{ width: WORLD_WIDTH }}>
					Parabéns Ieda & Dani
				</div>
			) : (
				spot > 20 && (
					<div
						className="surprise"
						style={{ width: WORLD_WIDTH, opacity: alpha }}
					>
						✨ Surpresa! ✨
					</div>
				)
			)}

			{state.flash > 0 && (
				<div
					className="overlay"
					style={{ ...cover, background: `rgba(255,255,255,${state.flash})` }}
				/>
			)}

			<Messages state={state} />

			{state.fade > 0 && (
				<div className="overlay" style={{ ...cover, background: `rgba(0,0,0,${state.fade})` }} />
			)}
		</>
	);
}

/** On touch devices the `screen` copy is shown at the top of the page instead of inside the scaled world. */
export function Messages({
	state,
	screen = false,
}: {
	state: GameState;
	screen?: boolean;
}) {
	const className = screen ? "message-box message-box--screen" : "message-box message-box--world";
	const typed = Math.floor((state.tick - state.prankTick) / 2);
	let lineStart = 0;

	return (
		<>
			{state.toastTicks > 0 && <div className={className}>{state.toast}</div>}

			{state.prank === "message" && state.phase === "overworld" && (
				<div className={className}>
					{PRANK_MESSAGE.map((line) => {
						const shown = Math.max(0, Math.min(line.length, typed - lineStart));
						lineStart += line.length;
						return (
							<div key={line}>
								{line.slice(0, shown)}
								<span className="message-box__hidden">
									{line.slice(shown)}
								</span>
							</div>
						);
					})}
				</div>
			)}
		</>
	);
}
