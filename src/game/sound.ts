const FILES = {
	background: "/sounds/background.mp3",
	jump: "/sounds/jump.mp3",
	coin: "/sounds/coin.mp3",
	victory: "/sounds/victory.mp3",
	death: "/sounds/death.mp3",
	phase2: "/sounds/phase2.mp3",
};

type Sound = keyof typeof FILES;

const ctx = new AudioContext();
const buffers: Partial<Record<Sound, AudioBuffer>> = {};
const musicGain = ctx.createGain();
const MUSIC_VOLUME = 0.5;
musicGain.gain.value = MUSIC_VOLUME;
musicGain.connect(ctx.destination);

const VOLUME: Partial<Record<Sound, number>> = { jump: 0.4, coin: 0.4 };
const gains: Partial<Record<Sound, GainNode>> = {};
for (const [name, volume] of Object.entries(VOLUME) as [Sound, number][]) {
	const gain = ctx.createGain();
	gain.gain.value = volume;
	gain.connect(ctx.destination);
	gains[name] = gain;
}

let music: AudioBufferSourceNode | null = null;
let musicTrack: Sound = "background";
let musicState: "idle" | "wanted" | "stopped" = "idle";

function play(name: Sound, output: AudioNode = ctx.destination, loop = false) {
	const buffer = buffers[name];
	if (!buffer) return null;
	const source = ctx.createBufferSource();
	source.buffer = buffer;
	source.loop = loop;
	source.connect(output);
	source.start();
	return source;
}

function fadeMusic(volume: number, seconds: number) {
	const now = ctx.currentTime;
	musicGain.gain.cancelScheduledValues(now);
	musicGain.gain.setValueAtTime(musicGain.gain.value, now);
	musicGain.gain.linearRampToValueAtTime(volume, now + seconds);
}

function tryStartMusic() {
	if (musicState === "wanted" && !music) music = play(musicTrack, musicGain, true);
}

for (const [name, url] of Object.entries(FILES) as [Sound, string][]) {
	fetch(url)
		.then((response) => response.arrayBuffer())
		.then((data) => ctx.decodeAudioData(data))
		.then((buffer) => {
			buffers[name] = buffer;
			if (name === musicTrack) tryStartMusic();
		})
		.catch(() => {});
}

/** Must be called from a user gesture so browsers allow audio. */
export function startMusic() {
	ctx.resume();
	if (musicState === "idle") musicState = "wanted";
	tryStartMusic();
}

export function stopMusic() {
	musicState = "stopped";
	music?.stop();
	music = null;
}

export function playSound(name: Exclude<Sound, "background">) {
	const source = play(name, gains[name] ?? ctx.destination);
	if (source && name === "death") switchMusic("phase2", source.buffer?.duration ?? 0);
}

function switchMusic(track: Sound, delaySeconds: number) {
	fadeMusic(0, 0.3);
	music?.stop(ctx.currentTime + 0.3);
	music = null;
	musicTrack = track;
	setTimeout(() => {
		fadeMusic(MUSIC_VOLUME, 0.05);
		tryStartMusic();
	}, delaySeconds * 1000);
}
