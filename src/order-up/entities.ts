import { SCREEN } from "../shared/constants";
import { getHorizontalInput } from "../shared/input";
import type { Vec2, Entity } from "../shared/types";
import { PLAYER } from "./constants";

const MAX_PLAYER_POS = SCREEN.WIDTH - PLAYER.WIDTH;

export class Player implements Entity {
  pos: Vec2;
  size: Vec2;
  vel: number;
  color: string;
  dishes: number = 0;
  invincibleUntil: number = 0;
  playerIndex: number;

  constructor(playerIndex: number, isSolo: boolean) {
    this.playerIndex = playerIndex;
    this.pos = isSolo
      ? { x: SCREEN.WIDTH / 2, y: PLAYER.Y_POSITION }
      : { x: (playerIndex * SCREEN.WIDTH) / 3, y: PLAYER.Y_POSITION };
    this.size = { x: PLAYER.WIDTH, y: PLAYER.HEIGHT };
    this.vel = 0;
    this.color = playerIndex === 1 ? "red" : "blue";
  }

  update(dt: number): void {
    // add new input to existing velocity
    const input = getHorizontalInput(this.playerIndex);
    this.vel += input;

    // less friction while accelerating, more friction when coasting
    const isAccelerating = input !== 0 && Math.sign(input) === Math.sign(this.vel);
    const friction = isAccelerating ? PLAYER.FRICTION_ACCEL : PLAYER.FRICTION_DECEL;
    this.vel *= friction;
    this.vel = Math.max(-PLAYER.MAX_SPEED, Math.min(PLAYER.MAX_SPEED, this.vel));

    // update pos.x += vel.x * dt, clamp to screen bounds
    this.pos.x += this.vel * dt;
    this.pos.x = Math.max(0, Math.min(MAX_PLAYER_POS, this.pos.x));
  }

  draw(ctx: CanvasRenderingContext2D): void {
    // blink while invincible (skip every other 100ms frame)
    if (performance.now() < this.invincibleUntil) {
      if (Math.floor(performance.now() / 100) % 2 === 0) return;
    }
    ctx.fillStyle = this.color;
    ctx.fillRect(this.pos.x, this.pos.y, this.size.x, this.size.y);
  }
}

export { Obstacle, type ObstacleType } from "./obstacle";
