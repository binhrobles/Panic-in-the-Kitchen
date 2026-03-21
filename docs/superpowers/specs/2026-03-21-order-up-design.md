# ORDER UP! — Game Design Spec

**Game:** ORDER UP!
**Platform:** RCade arcade cabinet (336x262px, spinner + D-pad + A/B buttons)
**Part of:** Panic! in the Kitchen (multi-minigame collection, inspired by Panic Park)
**Players:** 1-2 simultaneous

## Overview

ORDER UP! is a waiter runner where players dash through a chaotic kitchen to deliver a dish. The player is fixed vertically while the kitchen scrolls toward them. They control only horizontal movement via the spinner, dodging obstacles to keep their dish (and their grade) intact.

This is the first of potentially multiple Panic! in the Kitchen minigames. A future "Busboy" mode will add a dish-stack balancing mechanic on top of the same runner foundation.

## Controls

- **Spinner:** Primary input. Controls horizontal movement with momentum. Spinning generates velocity; friction decays it when the spinner stops.
- **D-pad left/right:** Fallback input for testing/accessibility. Same horizontal movement.
- **No buttons used.** The only inputs are left and right.

## Perspective & Camera

3/4 top-down view — the camera looks down at a slight angle, giving enough vertical dimension to see the "tops" of characters and obstacles. This perspective supports the future Busboy mode where a dish stack needs to visually sway above the player.

The player character is positioned near the bottom of the screen at a fixed Y position. The world (kitchen environment, obstacles) scrolls downward toward the player at a constant speed, creating the illusion of the player running forward.

## Player

- **Position:** Fixed Y (near bottom of screen), variable X (0 to screen width minus player width)
- **Velocity:** Horizontal only, driven by spinner delta with friction decay
- **Visual:** Colored rectangle (P1 and P2 get distinct colors)
- **Grade:** Starts at A+, drops on each obstacle collision
- **Clamped** to screen bounds

## Obstacles

All obstacles are colored rectangles in the first version. Art/sprites come later.

### Types

- **Static:** Kitchen islands, counters. Fixed X position, various widths. Scroll down with the world.
- **Moving:** Cooks walking horizontally. Scroll down with the world AND move left/right at their own speed.
- **Chokepoints:** Two static blocks with a narrow gap between them (doorway). Forces players through a tight channel.

### Collision Behavior

- AABB (axis-aligned bounding box) collision detection between player and obstacle rectangles
- On collision:
  - Player's grade drops one step
  - World scroll speed slows briefly for ALL players
  - Player receives brief invincibility frames to prevent multi-hit from the same obstacle

## Procedural Generation

### Run Structure

Each run has a defined length (N segments of screen height). Obstacles are pre-generated for the entire run before gameplay begins.

### Generation Rules

- **Difficulty ramp:** Early segments are sparse; later segments have more obstacles, more moving obstacles, and tighter chokepoints
- **Survivable:** At least one clear path exists through each segment — but it may be narrow (e.g., a single doorway width)
- **No balance guarantee:** Obstacle placement can skew heavily to one side of the screen. This is intentional — it creates scarcity and forces 2P conflict.
- **Same map for all players:** There is no difference between 1P and 2P maps. One clear path through a segment might only be wide enough for one player, making it zero-sum in 2P.
- **Independently testable:** Pre-generation allows rendering full maps for inspection and review outside of gameplay.

## Scoring

### Grade Ladder

```
A+ → A → A- → B+ → B → B- → C+ → C → C- → D+ → D → D- → F
```

13 steps. Each obstacle collision drops the grade by one step.

### Display

- **1P:** Grade displayed in the top-left corner
- **2P:** P1 grade in top-left, P2 grade in top-right, each in the player's color

### Future Direction

The grade system is a placeholder for more thematic scoring. Future iterations may show dish degradation visually and convert the final dish state into a tip percentage.

## 2-Player Mode

### Shared Space

Both players occupy the same screen and run the same procedurally generated course simultaneously. There is no split screen.

### Bumping Physics

- Players cannot overlap (AABB collision between player rectangles)
- When players collide, the player with more momentum displaces the other
- Momentum transfers proportionally: the faster player loses some velocity, the slower player gains it
- Both players are displaced to resolve any overlap
- This emerges naturally from the physics — there is no explicit "bump action"

### Competitive Dynamics

- The same map is used regardless of player count
- Scarce safe paths (e.g., one doorway) create zero-sum moments where players must jostle for position
- A collision that slows the world benefits the clean player — they get extra time to read ahead and position themselves
- Players can use spinner momentum to bump opponents into obstacles or out of safe paths

## Game Flow (State Machine)

```
TITLE → READY → RUNNING → RESULTS → TITLE
```

- **TITLE:** "ORDER UP!" with start prompt. Detects 1P vs 2P based on which start buttons are pressed.
- **READY:** Brief countdown ("3, 2, 1, ORDER UP!") for player orientation.
- **RUNNING:** Main gameplay. Obstacles scroll, players dodge. The run ends when the final segment has fully scrolled past the player's Y position.
- **RESULTS:** Final grade(s) displayed prominently. In 2P, higher grade wins. Ties are ties. "Play again" returns to TITLE.

Each state implements `update(dt)` and `draw(ctx)`.

## Architecture

### Tech Stack

- TypeScript, Vanilla Canvas 2D
- Vite for build tooling
- RCade SDK for arcade cabinet input (@rcade/plugin-input-classic, @rcade/plugin-input-spinners)
- No game engine or framework dependencies

### Code Structure

```
src/
  main.ts              — entry point, canvas setup, main loop
  shared/
    input.ts           — spinner + D-pad abstraction, outputs horizontal delta
    physics.ts         — AABB collision detection, momentum transfer
    constants.ts       — screen dimensions, shared tuning values
  order-up/
    index.ts           — game state machine for ORDER UP!
    states.ts          — title, ready, running, results state implementations
    systems.ts         — procedural generation, grade scoring
    entities.ts        — player and obstacle entity definitions
    constants.ts       — ORDER UP! specific tuning values (speeds, friction, grade steps)
```

### Design Principles

- **Shared vs game-specific separation:** `shared/` contains input abstraction and basic physics reusable across future Panic! in the Kitchen minigames. `order-up/` contains everything specific to this game.
- **Plain objects/classes:** No framework. Game objects are simple TS constructs with position, velocity, and update/draw methods.
- **Delta time:** All updates receive `dt` for frame-rate independence.
- **Constants file:** All tuning values (scroll speed, friction, slowdown duration, player size, etc.) in dedicated constants files for easy tweaking.
- **Main loop:** `requestAnimationFrame → calculate dt → currentState.update(dt) → currentState.draw(ctx)`
