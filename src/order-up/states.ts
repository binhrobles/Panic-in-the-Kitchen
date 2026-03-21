import type { GameState } from '../shared/types';

// Note: states will need a reference to OrderUpGame for changeState() calls.
// This will be wired up in Task 8 — add constructor params or setters then.

export class TitleState implements GameState {
  enter(): void { /* TODO */ }
  update(_dt: number): void { /* TODO: detect start button, 1P vs 2P */ }
  draw(_ctx: CanvasRenderingContext2D): void { /* TODO: draw "ORDER UP!" title and start prompt */ }
  exit(): void { /* TODO */ }
}

export class ReadyState implements GameState {
  enter(): void { /* TODO: start countdown timer */ }
  update(_dt: number): void { /* TODO: tick countdown, transition to running when done */ }
  draw(_ctx: CanvasRenderingContext2D): void { /* TODO: draw countdown ("3", "2", "1", "ORDER UP!") */ }
  exit(): void { /* TODO */ }
}

export class RunningState implements GameState {
  enter(): void { /* TODO: generate run, create players, reset scrollDistance */ }
  update(_dt: number): void {
    // TODO:
    // 1. update scrollSpeed (check if in slowdown)
    // 2. scrollDistance += scrollSpeed * dt
    // 3. move all obstacles: pos.y += scrollSpeed * dt
    // 4. update obstacle independent movement (moving type)
    // 5. update players (input + physics)
    // 6. check player-obstacle collisions → grade drop + slowdown + invincibility
    // 7. check player-player collisions (2P) → momentum transfer
    // 8. check if scrollDistance >= totalRunLength → changeState('results')
  }
  draw(_ctx: CanvasRenderingContext2D): void {
    // TODO:
    // 1. clear screen with BACKGROUND color
    // 2. draw obstacles
    // 3. draw players
    // 4. draw HUD (P1 grade top-left, P2 grade top-right)
  }
  exit(): void { /* TODO */ }
}

export class ResultsState implements GameState {
  enter(): void { /* TODO */ }
  update(_dt: number): void { /* TODO: detect start button → changeState('title') */ }
  draw(_ctx: CanvasRenderingContext2D): void {
    // TODO: show final grades prominently
    // In 2P: compare grade index in GRADES array, display winner or "TIE"
  }
  exit(): void { /* TODO */ }
}
