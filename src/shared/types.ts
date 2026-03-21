export interface Vec2 {
  x: number;
  y: number;
}

export interface Entity {
  pos: Vec2;
  size: Vec2;
  /** velocity only exists on the x-axis */
  vel: number;
  color: string;
  update(dt: number): void;
  draw(ctx: CanvasRenderingContext2D): void;
}
