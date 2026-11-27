export const WORLD_WIDTH = 800;
export const WORLD_HEIGHT = 400;
export const GROUND_Y = 340;

export const PLAYER_WIDTH = 42;
export const PLAYER_HEIGHT = 48;

export const BOX_SIZE = 48;
export const BOX_Y = 205;
export const BOX_START_X = 88;
export const BOX_SPACING = 115;

export const MAX_SCALE = 1.05;

export const WORD = ["M", "E", "N", "I", "N", "O"] as const;
export const SPECIAL_INDEX = WORD.length - 1;

export const FAKE_LETTER = "E";
export const FAKE_REVEAL_TICKS = 240;
export const PRANK_MESSAGE = [
	"Mamma mia... é um menine!",
	"Brincadeiras a parte, vamos de novo!",
];

export const LETTER_COLORS = [
	"#ff5a5a",
	"#ff9f1c",
	"#2ec4b6",
	"#4d96ff",
	"#ff6bcb",
	"#b24bff",
];

export const PHYSICS = {
	gravity: 0.65,
	jumpSpeed: -12.5,
	acceleration: 0.7,
	friction: 0.84,
} as const;

export const SPRITE_PALETTE: Record<string, string> = {
	r: "#e8281c",
	s: "#f8b878",
	b: "#6a3a10",
	o: "#2840d8",
	y: "#f8d820",
	w: "#ffffff",
};

export const SPRITE_ROWS: string[] = [
	"....rrrrrr....",
	"...rrrrrrrrr..",
	"...bbbssbs....",
	"..bsbsssbsss..",
	"..bsbbsssbsss.",
	"..bbsssssbbbb.",
	"....sssssss...",
	"...rrorrrr....",
	"..rrrorrorrr..",
	".rrrroooorrrr.",
	".wwroyooyorww.",
	"..wwoooooooww.",
	"...oooooooooo.",
	"...ooo....ooo.",
	"..bbbb....bbbb",
	".bbbbb...bbbbb",
];

export const CAT_SPEED = 3;

export const CAT_PALETTE: Record<string, string> = {
	k: "#2b2b36",
	g: "#9b9ba8",
	l: "#d9d9e2",
	w: "#ffffff",
	p: "#ff9fb8",
	e: "#5ad15a",
};

export const CAT_BODY_ROWS: string[] = [
	"..k.k.k.......k.......k....",
	".kgkgkgk.....kpk..k..kpk...",
	"kgglggggk...kgpgkkkkkgpgk..",
	"kglggglggk..kgggggggggggk..",
	".kgglggggk..kggekgggekggk..",
	"..kggglgkk.kggllllpllllggkw",
	"...kggggkgkgglllllllllllggk",
	"....kgggggggglllllllllllkkk",
	"...kgggggggggglllllllllk...",
	"....kggggggggglllllllk.....",
	"...kggllllllllllllllk......",
	"....kggllllllllllggk.......",
	"....kgggklklklkgggk........",
];

export const CAT_LEG_FRAMES: string[][] = [
	[
		"...kgggk.k.k.k..kgggk......",
		"..kgggk..........kgggk.....",
		".kkkk.............kkkk.....",
	],
	[
		"....kgggkk.k.k.kgggk.......",
		"......kgggk..kgggk.........",
		".......kkkk..kkkk..........",
	],
];

export const SPECIAL_BURST_COLORS = [
	"#b24bff",
	"#ffd24a",
	"#ffffff",
	"#7df9ff",
];
