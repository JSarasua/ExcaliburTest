// resources.ts
import * as ex from "excalibur";
const isLocal = import.meta.env.DEV;
const baseUrl = isLocal ? "/" : import.meta.env.BASE_URL;

export const Resources = {
	// Relative to /public in vite
	PipeImage: new ex.ImageSource(`${baseUrl}images/pipe.png`, {
		wrapping: ex.ImageWrapping.Clamp,
	}),
	BirdImage: new ex.ImageSource(`${baseUrl}images/bird.png`),
	GroundImage: new ex.ImageSource(`${baseUrl}images/ground.png`, {
		wrapping: ex.ImageWrapping.Repeat,
	}),
	// Sounds
	FlapSound: new ex.Sound(`${baseUrl}sounds/flap.wav`),
	FailSound: new ex.Sound(`${baseUrl}sounds/fail.wav`),
	ScoreSound: new ex.Sound(`${baseUrl}sounds/score.wav`),
	// Music
	BackgroundMusic: new ex.Sound(`${baseUrl}sounds/two_left_socks.ogg`),
} as const;
