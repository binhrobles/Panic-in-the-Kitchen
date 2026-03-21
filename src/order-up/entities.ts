import { SCREEN } from "../shared/constants";
import type { Vec2, Entity } from "../shared/types";
import { PLAYER, type Grade } from "./constants";

export class Player implements Entity {
  pos: Vec2;
  size: Vec2;
  vel: number;
  color: string;
  grade: Grade = "A+";
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

  update(_dt: number): void {
    // TODO: call getHorizontalInput(this.playerIndex), apply to vel.x
    // apply friction (vel.x *= FRICTION), clamp to MAX_SPEED
    // update pos.x += vel.x * dt, clamp to screen bounds
  }

  draw(ctx: CanvasRenderingContext2D): void {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.pos.x, this.pos.y, this.size.x, this.size.y);
  }
}

export type ObstacleType = "static" | "moving" | "chokepoint";

export class Obstacle implements Entity {
  pos: Vec2;
  size: Vec2;
  vel: number;
  color: string;
  type: ObstacleType;

  constructor(type: ObstacleType, pos: Vec2, size: Vec2) {
    this.type = type;
    this.pos = { ...pos };
    this.size = { ...size };
    this.vel = 0;
    this.color = "";
    // TODO: set color based on type (COLORS.OBSTACLE_*)
    // set vel.x for moving obstacles (oscillation speed)
  }

  update(_dt: number): void {
    // TODO: handle independent movement only (moving type oscillates pos.x)
    // Y movement is driven by RunningState (scrollSpeed varies during slowdown)
  }

  draw(_ctx: CanvasRenderingContext2D): void {
    // TODO: ctx.fillStyle = this.color; ctx.fillRect(...)
  }
}
