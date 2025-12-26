// bird.ts

import * as ex from "excalibur";
import { Ground } from "./ground";
import { Pipe } from "./pipe";
import { Config } from "./config";
import { Level } from "./level";
import { Resources } from "./resources";

export class Bird extends ex.Actor {
	playing = false;
	jumping = false;
	upAnimation!: ex.Animation;
	downAnimation!: ex.Animation;
	startSprite!: ex.Sprite;

	constructor(private level: Level) {
		super({
			pos: Config.BirdStartPos,
			radius: 8,
			color: ex.Color.Yellow,
		});
	}

	override onInitialize(): void {
		// Slice up image into a sprite sheet
		const spriteSheet = ex.SpriteSheet.fromImageSource({
			image: Resources.BirdImage,
			grid: {
				rows: 1,
				columns: 4,
				spriteWidth: 32,
				spriteHeight: 32,
			},
		});
		// Animation to play going up on tap
		this.upAnimation = ex.Animation.fromSpriteSheet(
			spriteSheet,
			[2, 1, 0], // 3rd frame, then 2nd, then first
			150, // 150ms for each frame
			ex.AnimationStrategy.Freeze,
		);
		// Animation to play going down
		this.downAnimation = ex.Animation.fromSpriteSheet(
			spriteSheet,
			[0, 1, 2],
			150,
			ex.AnimationStrategy.Freeze,
		);
		this.startSprite = spriteSheet.getSprite(1, 0);

		// Register animations by name
		this.graphics.add("down", this.downAnimation);
		this.graphics.add("up", this.upAnimation);
		this.graphics.add("start", this.startSprite);
		// Set the default sprite to use
		this.graphics.use(this.startSprite);
		this.on("exitviewport", () => {
			this.level.triggerGameOver();
		});
	}

	override onCollisionStart(_self: ex.Collider, other: ex.Collider): void {
		if (other.owner instanceof Ground || other.owner instanceof Pipe) {
			this.level.triggerGameOver();
		}
	}

	start() {
		this.playing = true;
		this.pos = Config.BirdStartPos; // starting position
		this.acc = ex.vec(0, Config.BirdAcceleration); // pixels per second per second
	}
	reset() {
		this.pos = Config.BirdStartPos; // starting position
		this.stop();
	}
	stop() {
		this.playing = false;
		this.vel = ex.vec(0, 0);
		this.acc = ex.vec(0, 0);
	}

	private isJumpPressed(engine: ex.Engine) {
		// if the space bar or the first pointer was down
		return (
			engine.input.keyboard.isHeld(ex.Keys.Space) ||
			engine.input.pointers.isDown(0)
		);
	}
	override onPostUpdate(engine: ex.Engine): void {
		if (!this.playing) return;

		if (!this.jumping && this.isJumpPressed(engine)) {
			this.vel.y += -800; // negative is UP
			this.jumping = true;
			this.graphics.use("up");
			// rewind animations that froze
			this.upAnimation.reset();
			this.downAnimation.reset();

			Resources.FlapSound.play();
		}
		if (!this.isJumpPressed(engine)) {
			this.jumping = false;
		}
		// keep velocity from getting too big
		this.vel.y = ex.clamp(this.vel.y, -500, 500);
		// The "speed" the bird will move relative to pipes
		this.rotation = ex.vec(200, this.vel.y).toAngle();
		if (this.vel.y > 0) {
			this.graphics.use("down");
		}
	}
}
