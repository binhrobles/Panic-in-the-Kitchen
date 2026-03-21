# ORDER UP! Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a 1-2 player waiter runner game for the RCade arcade cabinet where players dodge kitchen obstacles to deliver a dish, scored by a letter grade.

**Architecture:** Vanilla Canvas 2D with a simple game loop and state machine. Code split into `shared/` (input, physics, constants reusable across future Krazy Kitchen games) and `order-up/` (game-specific states, entities, systems). All game objects are plain TS classes with `update(dt)` and `draw(ctx)` methods.

**Tech Stack:** TypeScript, Canvas 2D API, Vite, RCade SDK (@rcade/plugin-input-classic, @rcade/plugin-input-spinners)

**Collaboration model:** Claude scaffolds project structure and stubs. User implements the bodies. Each task notes who does what.

**Spec:** `docs/superpowers/specs/2026-03-21-order-up-design.md`

---

## File Structure

```
src/
  main.ts                  — canvas setup, main loop, delegates to current game
  shared/
    types.ts               — shared interfaces (GameState, Entity, Vec2)
    input.ts               — spinner + D-pad → horizontal delta abstraction
    physics.ts             — AABB collision detection, overlap resolution, momentum transfer
    constants.ts           — screen dimensions (336x262), shared tuning values
  order-up/
    index.ts               — ORDER UP! game state machine, transitions between states
    states.ts              — title, ready, running, results state implementations
    entities.ts            — Player and Obstacle classes
    systems.ts             — procedural generation, grade scoring
    constants.ts           — ORDER UP! tuning values (speeds, friction, grade steps, etc.)
```

---

### Task 1: Scaffold project structure (Claude)

**Files:**
- Create: `src/shared/types.ts`
- Create: `src/shared/input.ts`
- Create: `src/shared/physics.ts`
- Create: `src/shared/constants.ts`
- Create: `src/order-up/index.ts`
- Create: `src/order-up/states.ts`
- Create: `src/order-up/entities.ts`
- Create: `src/order-up/systems.ts`
- Create: `src/order-up/constants.ts`
- Modify: `src/main.ts`

Claude creates all files with types, interfaces, class shells, and exported function signatures. Implementation bodies are `TODO` stubs or minimal placeholders.

- [ ] **Step 1: Create `src/shared/types.ts`** with core interfaces

```typescript
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
```

- [ ] **Step 2: Create `src/shared/constants.ts`**

```typescript
export const SCREEN = {
  WIDTH: 336,
  HEIGHT: 262,
} as const;
```

- [ ] **Step 3: Create `src/shared/input.ts`** with stub

```typescript
/** Returns horizontal delta this frame (-1 to 1 range, or raw spinner delta) */
export function getHorizontalInput(playerIndex: number): number {
  // TODO: read from spinner (primary) or D-pad (fallback)
  return 0;
}
```

- [ ] **Step 4: Create `src/shared/physics.ts`** with stubs

```typescript
import type { Entity } from './types';

/** Returns true if two axis-aligned rectangles overlap */
export function checkAABB(a: Entity, b: Entity): boolean {
  // TODO
  return false;
}

/** Resolves overlap between two entities, transferring momentum */
export function resolveCollision(a: Entity, b: Entity): void {
  // TODO
}
```

- [ ] **Step 5: Create `src/order-up/constants.ts`**

```typescript
export const PLAYER = {
  WIDTH: 16,
  HEIGHT: 20,
  Y_POSITION: 230,       // fixed Y near bottom
  FRICTION: 0.9,          // velocity decay per frame
  MAX_SPEED: 200,         // pixels per second
  INVINCIBILITY_MS: 500,  // after collision
} as const;

export const WORLD = {
  SCROLL_SPEED: 60,       // pixels per second
  SLOWDOWN_FACTOR: 0.3,   // multiplier during collision slowdown
  SLOWDOWN_MS: 300,       // duration of slowdown
  RUN_SEGMENTS: 20,       // number of screen-height segments per run
} as const;

export const GRADES = [
  'A+', 'A', 'A-',
  'B+', 'B', 'B-',
  'C+', 'C', 'C-',
  'D+', 'D', 'D-',
  'F',
] as const;

export type Grade = typeof GRADES[number];

export const COLORS = {
  P1: '#4488ff',
  P2: '#ff4444',
  OBSTACLE_STATIC: '#666666',
  OBSTACLE_MOVING: '#aa6633',
  OBSTACLE_CHOKEPOINT: '#555555',
  BACKGROUND: '#1a1a2e',
} as const;
```

- [ ] **Step 6: Create `src/order-up/entities.ts`** with class shells

```typescript
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

  update(dt: number): void {
    // TODO: apply input, friction, clamp to screen bounds
  }

  draw(ctx: CanvasRenderingContext2D): void {
    // TODO: draw colored rectangle
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
    // TODO: set color based on type, set vel for moving obstacles
  }

  update(dt: number): void {
    // TODO: move based on vel, handle moving obstacle horizontal bounce
  }

  draw(ctx: CanvasRenderingContext2D): void {
    // TODO: draw colored rectangle
  }
}
```

- [ ] **Step 7: Create `src/order-up/systems.ts`** with stubs

```typescript
import type { Obstacle } from './entities';
import type { Grade } from './constants';

/** Generate the full obstacle map for a run */
export function generateRun(): Obstacle[] {
  // TODO: create obstacles for each segment with difficulty ramp
  return [];
}

/** Drop grade by one step, returns new grade */
export function dropGrade(current: Grade): Grade {
  // TODO: find current index in GRADES, return next
  return current;
}
```

- [ ] **Step 8: Create `src/order-up/states.ts`** with state shells

```typescript
import type { GameState } from '../shared/types';

// Note: states will need a reference to OrderUpGame for changeState() calls.
// This will be wired up in Task 8 — add constructor params or setters then.

export class TitleState implements GameState {
  enter(): void { /* TODO */ }
  update(dt: number): void { /* TODO: detect start button, 1P vs 2P */ }
  draw(ctx: CanvasRenderingContext2D): void { /* TODO: draw title screen */ }
  exit(): void { /* TODO */ }
}

export class ReadyState implements GameState {
  enter(): void { /* TODO: start countdown */ }
  update(dt: number): void { /* TODO: tick countdown, transition when done */ }
  draw(ctx: CanvasRenderingContext2D): void { /* TODO: draw countdown */ }
  exit(): void { /* TODO */ }
}

export class RunningState implements GameState {
  enter(): void { /* TODO: generate run, create players */ }
  update(dt: number): void { /* TODO: scroll world, update players/obstacles, check collisions */ }
  draw(ctx: CanvasRenderingContext2D): void { /* TODO: draw everything */ }
  exit(): void { /* TODO */ }
}

export class ResultsState implements GameState {
  enter(): void { /* TODO */ }
  update(dt: number): void { /* TODO: detect restart input */ }
  draw(ctx: CanvasRenderingContext2D): void { /* TODO: show grades */ }
  exit(): void { /* TODO */ }
}
```

- [ ] **Step 9: Create `src/order-up/index.ts`** — game state machine

```typescript
import type { GameState } from '../shared/types';
import { TitleState, ReadyState, RunningState, ResultsState } from './states';

export class OrderUpGame {
  private currentState: GameState;
  private states: Record<string, GameState>;

  constructor() {
    this.states = {
      title: new TitleState(),
      ready: new ReadyState(),
      running: new RunningState(),
      results: new ResultsState(),
    };
    this.currentState = this.states.title;
  }

  /** Transition to a new state */
  changeState(name: string): void {
    this.currentState.exit();
    this.currentState = this.states[name];
    this.currentState.enter();
  }

  update(dt: number): void {
    this.currentState.update(dt);
  }

  draw(ctx: CanvasRenderingContext2D): void {
    this.currentState.draw(ctx);
  }
}
```

- [ ] **Step 10: Rewrite `src/main.ts`** — canvas setup + main loop

```typescript
import './style.css';
import { SCREEN } from './shared/constants';
import { OrderUpGame } from './order-up/index';

const canvas = document.createElement('canvas');
canvas.width = SCREEN.WIDTH;
canvas.height = SCREEN.HEIGHT;
document.querySelector<HTMLDivElement>('#app')!.appendChild(canvas);

const ctx = canvas.getContext('2d')!;
const game = new OrderUpGame();

let lastTime = performance.now();

function loop(now: number): void {
  const dt = (now - lastTime) / 1000; // seconds
  lastTime = now;

  game.update(dt);
  game.draw(ctx);

  requestAnimationFrame(loop);
}

game.changeState('title');
requestAnimationFrame(loop);
```

- [ ] **Step 11: Verify it builds and runs**

Run: `npm run dev`
Expected: Black screen with no errors in console. The canvas is mounted and the game loop is running, but nothing draws yet because all state `draw()` methods are empty.

- [ ] **Step 12: Commit**

```bash
git add src/
git commit -m "scaffold: ORDER UP! project structure with stubs"
```

---

### Task 2: Implement input system (User)

**Files:**
- Implement: `src/shared/input.ts`

**Guidance:**
- Import `PLAYER_1` from `@rcade/plugin-input-classic` and `PLAYER_1 as PLAYER_1_SPINNER` from `@rcade/plugin-input-spinners`
- The existing `main.ts` shows how to read these: `PLAYER_1.DPAD.left/right` for D-pad, `PLAYER_1_SPINNER.SPINNER.consume_step_delta()` for spinner
- Spinner delta is the primary input; D-pad is fallback. If spinner delta is non-zero, use it. Otherwise check D-pad and return a fixed delta value (e.g., ±1) when pressed.
- Consider: the spinner returns raw step deltas that may need scaling to feel right. This is a tuning value — you can add a `SPINNER_SENSITIVITY` to `shared/constants.ts`
- For 2P: you'll need `PLAYER_2` imports from both plugins. The `playerIndex` parameter (0 or 1) selects which player's input to read.

**How to test:** Hook the input function into `RunningState.update()` and log the output, or temporarily draw a rectangle that moves with the input.

- [ ] Step 1: Implement `getHorizontalInput()` reading spinner then D-pad fallback
- [ ] Step 2: Verify with console.log or a moving rectangle
- [ ] Step 3: Commit

---

### Task 3: Implement player entity (User)

**Files:**
- Implement: `src/order-up/entities.ts` (Player class)

**Guidance:**
- Constructor: set `pos.x` based on playerIndex (P1 starts left-of-center, P2 right-of-center), `pos.y` to `PLAYER.Y_POSITION`, `size` to player dimensions, `color` from `COLORS.P1/P2`
- `update(dt)`: call `getHorizontalInput(playerIndex)`, add to `vel.x` (scaled by sensitivity), apply `FRICTION` each frame (`vel.x *= FRICTION`), clamp `vel.x` to `MAX_SPEED`, update `pos.x += vel.x * dt`, clamp `pos.x` to screen bounds
- `draw(ctx)`: `ctx.fillStyle = this.color; ctx.fillRect(pos.x, pos.y, size.x, size.y)`

**How to test:** In `RunningState.enter()`, create a Player. In `update(dt)`, call `player.update(dt)`. In `draw(ctx)`, call `player.draw(ctx)`. You should see a colored rectangle that moves with the spinner.

- [ ] Step 1: Implement Player constructor
- [ ] Step 2: Implement Player.update() with input, friction, clamping
- [ ] Step 3: Implement Player.draw()
- [ ] Step 4: Wire into RunningState temporarily to test
- [ ] Step 5: Commit

---

### Task 4: Implement world scrolling & obstacle rendering (User)

**Files:**
- Implement: `src/order-up/entities.ts` (Obstacle class)
- Implement: `src/order-up/states.ts` (RunningState)

**Guidance:**
- Obstacle Y movement is driven by `RunningState`, not the obstacle itself — the state sets each obstacle's `pos.y += scrollSpeed * dt` each frame (since `scrollSpeed` varies during slowdown). Obstacle's own `update(dt)` handles only its independent movement (e.g., `moving` type oscillating `pos.x` with `vel.x`).
- Obstacle `draw(ctx)`: same pattern as Player — `fillRect` with type-based color.
- In `RunningState`: maintain a `scrollSpeed` property (starts at `WORLD.SCROLL_SPEED`). Each frame, update all obstacles. When an obstacle's `pos.y` is past the screen bottom, it's gone.
- For now, manually place a few test obstacles at known positions to verify scrolling works before wiring up procedural generation.

**How to test:** Hard-code 3-4 obstacles at different Y positions (above screen). Run the game. They should scroll down toward the player at constant speed.

- [ ] Step 1: Implement Obstacle constructor (color by type, vel for moving)
- [ ] Step 2: Implement Obstacle.update() and draw()
- [ ] Step 3: Wire into RunningState with hard-coded test obstacles
- [ ] Step 4: Verify scrolling works visually
- [ ] Step 5: Commit

---

### Task 5: Implement collision detection (User)

**Files:**
- Implement: `src/shared/physics.ts`
- Modify: `src/order-up/states.ts` (RunningState)

**Guidance:**
- `checkAABB(a, b)`: standard rectangle overlap test. Two rects overlap when `a.pos.x < b.pos.x + b.size.x && a.pos.x + a.size.x > b.pos.x && a.pos.y < b.pos.y + b.size.y && a.pos.y + a.size.y > b.pos.y`
- In `RunningState.update()`: for each obstacle, check collision with each player. On hit:
  1. Drop the grade (for now, just log or hardcode the drop — `dropGrade()` is implemented in Task 6)
  2. Set `player.invincibleUntil = now + PLAYER.INVINCIBILITY_MS`
  3. Trigger world slowdown: `scrollSpeed = WORLD.SCROLL_SPEED * WORLD.SLOWDOWN_FACTOR` for `WORLD.SLOWDOWN_MS`, then restore
- Skip collision check if `now < player.invincibleUntil`
- Consider a visual flash on the player during invincibility (e.g., toggle visibility every 100ms)

**How to test:** Run into a hard-coded obstacle. Grade should drop, world should slow briefly, and re-hitting the same obstacle during invincibility should do nothing.

- [ ] Step 1: Implement checkAABB()
- [ ] Step 2: Implement collision response in RunningState (grade drop + slowdown + invincibility)
- [ ] Step 3: Test with hard-coded obstacles
- [ ] Step 4: Commit

---

### Task 6: Implement grade scoring & display (User)

**Files:**
- Implement: `src/order-up/systems.ts` (dropGrade)
- Modify: `src/order-up/states.ts` (RunningState.draw for HUD)

**Guidance:**
- `dropGrade`: find index of `current` in `GRADES` array, return `GRADES[index + 1]` or `'F'` if already at the end
- HUD drawing: in `RunningState.draw()`, after drawing game objects, draw grade text. Use `ctx.fillText()` with a large font. P1 top-left, P2 top-right. Use player colors for the text.
- Consider: `ctx.font = 'bold 20px monospace'` and `ctx.textAlign` ('left' for P1, 'right' for P2)

**How to test:** Crash into obstacles and watch the grade drop in the corner.

- [ ] Step 1: Implement dropGrade()
- [ ] Step 2: Draw grade HUD in RunningState.draw()
- [ ] Step 3: Verify grade drops on collision
- [ ] Step 4: Commit

---

### Task 7: Implement procedural generation (User)

**Files:**
- Implement: `src/order-up/systems.ts` (generateRun)

**Guidance:**
- Divide the run into `RUN_SEGMENTS` segments, each `SCREEN.HEIGHT` tall. Obstacles are positioned at negative Y values (above the screen, scrolling down).
- Segment `i` obstacle at Y = `-(i * SCREEN.HEIGHT)` to `-(i * SCREEN.HEIGHT + SCREEN.HEIGHT)`
- Difficulty ramp: early segments get 1-2 static obstacles. Later segments get more obstacles, moving obstacles appear after ~30%, chokepoints after ~50%.
- Chokepoint = two static obstacles spanning the width with a gap between them. Gap width should fit at least one player.
- **Key constraint:** every segment must have at least one clear path through it. Simplest approach: place obstacles, then verify a player-width gap exists. If not, shrink or remove an obstacle.
- No left/right balance requirement. Use `Math.random()` for X positions.
- Obstacles for the entire run are returned as a flat array.

**How to test:** Call `generateRun()`, log the results, verify obstacle count increases over segments. Eventually, play through and confirm runs are survivable but challenging. Consider a debug mode that renders the full map as a scrollable image for visual inspection.

- [ ] Step 1: Implement basic generateRun() with static obstacles only
- [ ] Step 2: Wire into RunningState.enter() replacing hard-coded obstacles
- [ ] Step 3: Play-test, tune density
- [ ] Step 4: Add moving obstacles in later segments
- [ ] Step 5: Add chokepoints in later segments
- [ ] Step 6: Verify survivability (clear path always exists)
- [ ] Step 7: Commit

---

### Task 8: Implement game state machine flow (User)

**Files:**
- Modify: `src/order-up/states.ts` (all states)
- Modify: `src/order-up/index.ts` (wire transitions)

**Guidance:**
- The states need a reference to the game's `changeState()` method. Options: pass a callback in constructor, or pass the `OrderUpGame` instance.
- **TitleState:** Draw "ORDER UP!" text and "Press Start" prompt. In `update()`, check `SYSTEM.ONE_PLAYER` or `SYSTEM.TWO_PLAYER` to detect player count. Store player count, then `changeState('ready')`.
- **ReadyState:** On `enter()`, start a 3-second countdown. Draw countdown numbers ("3", "2", "1", "ORDER UP!"). When done, `changeState('running')`.
- **RunningState:** On `enter()`, generate run and create players (using stored player count). Track a `scrollDistance` accumulator, incrementing by `scrollSpeed * dt` each frame. Total run length = `RUN_SEGMENTS * SCREEN.HEIGHT`. End the run when `scrollDistance >= totalRunLength`, then `changeState('results')`.
- **ResultsState:** Display final grades. On start button press, `changeState('title')`.
- Player count needs to flow from TitleState → ReadyState → RunningState. Store it on the `OrderUpGame` instance.

**How to test:** Play through the full loop: title → ready → running → results → title.

- [ ] Step 1: Add player count to OrderUpGame, pass game ref to states
- [ ] Step 2: Implement TitleState (draw + start detection)
- [ ] Step 3: Implement ReadyState (countdown + transition)
- [ ] Step 4: Implement run-end detection in RunningState
- [ ] Step 5: Implement ResultsState (show grades, display winner in 2P by comparing grade index in GRADES array — or "TIE" if equal, restart on start button)
- [ ] Step 6: Play through full loop
- [ ] Step 7: Commit

---

### Task 9: Implement 2-player support (User)

**Files:**
- Modify: `src/shared/input.ts` (P2 input)
- Modify: `src/shared/physics.ts` (player-player collision)
- Modify: `src/order-up/states.ts` (RunningState for 2P)

**Guidance:**
- **Input:** Add P2 spinner/D-pad imports. `getHorizontalInput(1)` reads P2's controls.
- **Player-player collision:** In `RunningState.update()`, check AABB between the two players. Use `resolveCollision()` which should:
  1. Calculate overlap amount
  2. Determine which player has more momentum (`Math.abs(vel.x)`)
  3. Push the slower player away by the overlap amount
  4. Transfer momentum: faster player loses some `vel.x`, slower player gains it
  5. A simple approach: treat it like a 1D elastic collision on the X axis
- **RunningState:** When `playerCount === 2`, create two players, update both, check collisions between them and between each player and obstacles.
- **HUD:** Already handled in Task 6 (P1 left, P2 right).

**How to test:** Start 2P game. Verify both players render and move independently. Verify they can't overlap and bumping transfers momentum. Verify obstacle collisions affect each player's grade independently. Verify world slowdown triggers on any player collision.

- [ ] Step 1: Add P2 input to shared/input.ts
- [ ] Step 2: Implement resolveCollision() for player-player bumping
- [ ] Step 3: Wire 2P into RunningState (two players, all collision checks)
- [ ] Step 4: Test 2P gameplay
- [ ] Step 5: Commit

---

### Task 10: Polish & tuning pass (User)

**Files:**
- Modify: `src/order-up/constants.ts` (tune values)
- Modify: various files as needed

**Guidance:**
- Play-test repeatedly and adjust constants: scroll speed, friction, spinner sensitivity, slowdown duration, obstacle density, chokepoint gap width, invincibility duration
- Consider visual polish (all still colored rectangles, but): player flashing during invincibility, grade color change as it drops (green → yellow → red), brief screen shake on collision
- Consider adding a simple "kitchen floor" background pattern (checkerboard or tile lines) to convey scrolling speed
- Verify the game feels fun in both 1P and 2P

This is iterative — no fixed steps, just play and tune.

- [ ] Step 1: Play-test and identify what feels off
- [ ] Step 2: Adjust constants
- [ ] Step 3: Add visual juice (flashing, color changes, background)
- [ ] Step 4: Final commit
