import type { Vec2, Entity } from "../shared/types";
import { COLORS, PLAYER } from "./constants";

export type ObstacleType = "static" | "moving";

export class Obstacle implements Entity {
  pos: Vec2;
  size: Vec2;
  vel: number;
  color: string;
  type: ObstacleType;

  // moving type: erratic movement within the bounding zone
  zoneOrigin: Vec2;
  zoneSize: Vec2;
  private direction: Vec2 = { x: 0, y: 0 };
  private moveSpeed: number = 0;

  constructor(type: ObstacleType, pos: Vec2, size: Vec2) {
    this.type = type;
    this.pos = { ...pos };
    this.size = { ...size };
    this.vel = 0;
    this.zoneOrigin = { ...pos };
    this.zoneSize = { ...size };

    if (type === "static") {
      this.color = COLORS.OBSTACLE_STATIC;
    } else {
      this.color = COLORS.OBSTACLE_MOVING;
      this.size = { x: PLAYER.WIDTH, y: PLAYER.HEIGHT };
      // start at random position within zone
      this.pos = {
        x: pos.x + Math.random() * (size.x - PLAYER.WIDTH),
        y: pos.y + Math.random() * (size.y - PLAYER.HEIGHT),
      };
      this.moveSpeed = 0.04 + Math.random() * 0.04;
      this.pickNewDirection();
    }
  }

  /** Pick a random unit vector direction */
  private pickNewDirection(): void {
    const angle = Math.random() * Math.PI * 2;
    this.direction = { x: Math.cos(angle), y: Math.sin(angle) };
  }

  /** Scroll the obstacle (and its zone) by a delta */
  scrollBy(dy: number): void {
    this.pos.y += dy;
    this.zoneOrigin.y += dy;
  }

  update(dt: number): void {
    if (this.type !== "moving") return;

    const step = this.moveSpeed * dt;
    const nextX = this.pos.x + this.direction.x * step;
    const nextY = this.pos.y + this.direction.y * step;

    const minX = this.zoneOrigin.x;
    const maxX = this.zoneOrigin.x + this.zoneSize.x - this.size.x;
    const minY = this.zoneOrigin.y;
    const maxY = this.zoneOrigin.y + this.zoneSize.y - this.size.y;

    // move until hitting zone boundary, then pick new direction
    if (nextX < minX || nextX > maxX || nextY < minY || nextY > maxY) {
      // clamp to boundary
      this.pos.x = Math.max(minX, Math.min(maxX, nextX));
      this.pos.y = Math.max(minY, Math.min(maxY, nextY));
      this.pickNewDirection();
    } else {
      this.pos.x = nextX;
      this.pos.y = nextY;
    }
  }

  draw(ctx: CanvasRenderingContext2D): void {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.pos.x, this.pos.y, this.size.x, this.size.y);
  }
}
