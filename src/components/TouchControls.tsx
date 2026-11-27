import { type MutableRefObject, type PointerEvent, useRef, useState } from "react";
import type { Input } from "../game/types";

const DEAD_ZONE = 8;

type InputRef = MutableRefObject<Input>;
type Direction = "left" | "right" | "down" | null;

function DPad({ input }: { input: InputRef }) {
	const [pressed, setPressed] = useState<Direction>(null);
	const center = useRef<{ x: number; y: number } | null>(null);

	const update = (direction: Direction) => {
		setPressed(direction);
		input.current.left = direction === "left";
		input.current.right = direction === "right";
		input.current.down = direction === "down";
	};

	const move = (event: PointerEvent) => {
		if (!center.current) return;
		const dx = event.clientX - center.current.x;
		const dy = event.clientY - center.current.y;
		if (dy > DEAD_ZONE && dy > Math.abs(dx)) update("down");
		else update(dx < -DEAD_ZONE ? "left" : dx > DEAD_ZONE ? "right" : null);
	};

	const start = (event: PointerEvent<HTMLDivElement>) => {
		event.preventDefault();
		event.currentTarget.setPointerCapture(event.pointerId);
		const rect = event.currentTarget.getBoundingClientRect();
		center.current = { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
		move(event);
	};

	const end = () => {
		center.current = null;
		update(null);
	};

	return (
		<div
			className={`snes-dpad${pressed ? ` snes-dpad--${pressed}` : ""}`}
			onPointerDown={start}
			onPointerMove={move}
			onPointerUp={end}
			onPointerCancel={end}
			onLostPointerCapture={end}
		>
			<div className="snes-dpad__bar snes-dpad__bar--h" />
			<div className="snes-dpad__bar snes-dpad__bar--v" />
			<div className="snes-dpad__center" />
		</div>
	);
}

export function TouchControls({ input }: { input: InputRef }) {
	const jump = (pressed: boolean) => (event: PointerEvent) => {
		event.preventDefault();
		input.current.jump = pressed;
	};

	return (
		<fieldset
			className="touch-controls"
			aria-label="controls"
			onContextMenu={(event) => event.preventDefault()}
		>
			<div className="snes-pad">
				<div className="snes-pad__well">
					<DPad input={input} />
				</div>
				<div className="snes-pad__menu">
					<span className="snes-pill">
						<i>SELECT</i>
					</span>
					<span className="snes-pill">
						<i>START</i>
					</span>
				</div>
				<div className="snes-face">
					<div className="snes-face__groove snes-face__groove--top" />
					<div className="snes-face__groove snes-face__groove--bottom" />
					{["X", "Y", "A", "B"].map((label) => (
						<button
							key={label}
							type="button"
							aria-label={`jump ${label}`}
							className={`snes-btn snes-btn--${label.toLowerCase()}`}
							onPointerDown={jump(true)}
							onPointerUp={jump(false)}
							onPointerCancel={jump(false)}
							onLostPointerCapture={jump(false)}
						>
							<span className="snes-btn__label">{label}</span>
						</button>
					))}
				</div>
			</div>
		</fieldset>
	);
}
