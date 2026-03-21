export interface Vec2 {
  x: number;
  y: number;
}

export interface Entity {
  pos: Vec2;
  size: Vec2;
  vel: Vec2;
  color: string;
  update(dt: number): void;
  draw(ctx: CanvasRenderingContext2D): void;
}

export interface GameState {
  enter(): void;
  update(dt: number): void;
  draw(ctx: CanvasRenderingContext2D): void;
  exit(): void;
}
