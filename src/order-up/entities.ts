import type { Vec2, Entity } from '../shared/types';
import type { Grade } from './constants';

export class Player implements Entity {
  pos: Vec2;
  size: Vec2;
  vel: Vec2;
  color: string;
  grade: Grade = 'A+';
  invincibleUntil: number = 0;
  playerIndex: number;

  constructor(playerIndex: number) {
    this.playerIndex = playerIndex;
    // TODO: set initial position, size, color based on playerIndex
    this.pos = { x: 0, y: 0 };
    this.size = { x: 0, y: 0 };
    this.vel = { x: 0, y: 0 };
    this.color = '';
  }

  update(_dt: number): void {
    // TODO: call getHorizontalInput(this.playerIndex), apply to vel.x
    // apply friction (vel.x *= FRICTION), clamp to MAX_SPEED
    // update pos.x += vel.x * dt, clamp to screen bounds
  }

  draw(_ctx: CanvasRenderingContext2D): void {
    // TODO: ctx.fillStyle = this.color; ctx.fillRect(...)
  }
}

export type ObstacleType = 'static' | 'moving' | 'chokepoint';

export class Obstacle implements Entity {
  pos: Vec2;
  size: Vec2;
  vel: Vec2;
  color: string;
  type: ObstacleType;

  constructor(type: ObstacleType, pos: Vec2, size: Vec2) {
    this.type = type;
    this.pos = { ...pos };
    this.size = { ...size };
    this.vel = { x: 0, y: 0 };
    this.color = '';
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
