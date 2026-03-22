import type { Vec2, Entity } from "../shared/types";
import { COLORS, DISH } from "./constants";

export class Dish implements Entity {
  pos: Vec2;
  size: Vec2;
  vel: number = 0;
  color: string = COLORS.DISH;
  collected: boolean = false;

  constructor(pos: Vec2) {
    this.pos = { ...pos };
    this.size = { x: DISH.SIZE, y: DISH.SIZE };
  }

  update(_dt: number): void {}

  draw(ctx: CanvasRenderingContext2D): void {
    if (this.collected) return;
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(
      this.pos.x + this.size.x / 2,
      this.pos.y + this.size.y / 2,
      this.size.x / 2,
      0,
      Math.PI * 2,
    );
    ctx.fill();
  }
}
