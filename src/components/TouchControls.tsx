import type { MutableRefObject, PointerEvent } from "react";
import type { Input } from "../game/types";

const BUTTONS: { action: keyof Input; label: string; className: string }[] = [
	{ action: "left", label: "◀", className: "touch-btn--left" },
	{ action: "right", label: "▶", className: "touch-btn--right" },
	{ action: "jump", label: "▲", className: "touch-btn--jump" },
];

export function TouchControls({ input }: { input: MutableRefObject<Input> }) {
	const set =
		(action: keyof Input, pressed: boolean) => (event: PointerEvent) => {
			event.preventDefault();
			input.current[action] = pressed;
		};

	return (
		<div
			className="touch-controls"
			onContextMenu={(event) => event.preventDefault()}
		>
			{BUTTONS.map(({ action, label, className }) => (
				<button
					key={action}
					type="button"
					aria-label={action}
					className={`touch-btn ${className}`}
					onPointerDown={set(action, true)}
					onPointerUp={set(action, false)}
					onPointerCancel={set(action, false)}
					onLostPointerCapture={set(action, false)}
				>
					{label}
				</button>
			))}
		</div>
	);
}
