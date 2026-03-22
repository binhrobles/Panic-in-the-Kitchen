import { SCREEN } from "../shared/constants";
import { detectStartInput } from "../shared/input";
import { bounceCollision, checkAABB } from "../shared/physics";
import { COLORS, PLAYER, WORLD } from "./constants";
import { Player, Obstacle } from "./entities";
import { Dish } from "./dish";
import { generateRun } from "./systems";

type SceneName = "title" | "ready" | "running" | "results";

export class OrderUpGame {
  // title
  currentScene: SceneName = "title";
  playerCount: number = 1;

  // ready
  ready_timer_ms: number = 4000;

  // running
  obstacles: Obstacle[] = [];
  dishes: Dish[] = [];
  scrollDistance: number = 0;
  totalRunLength: number = WORLD.RUN_SEGMENTS * SCREEN.HEIGHT;
  player_1: Player | null = null;
  player_2: Player | null = null;

  // --- Top Level Functions ---
  changeScene(name: SceneName): void {
    this.currentScene = name;

    if (this.currentScene === "ready") {
      this.ready_timer_ms = 4000;

      if (this.playerCount === 1) {
        this.player_1 = new Player(1, true);
      } else {
        this.player_1 = new Player(1, false);
        this.player_2 = new Player(2, false);
      }

      const run = generateRun();
      this.obstacles = run.obstacles;
      this.dishes = run.dishes;
      this.scrollDistance = 0;
    }

    if (this.currentScene === "running") {
    }
  }

  update(dt: number): void {
    switch (this.currentScene) {
      case "title":
        this.updateTitle(dt);
        break;
      case "ready":
        this.updateReady(dt);
        break;
      case "running":
        this.updateRunning(dt);
        break;
      case "results":
        this.updateResults(dt);
        break;
    }
  }

  draw(ctx: CanvasRenderingContext2D): void {
    ctx.fillStyle = COLORS.BACKGROUND;
    ctx.fillRect(0, 0, SCREEN.WIDTH, SCREEN.HEIGHT);

    switch (this.currentScene) {
      case "title":
        this.drawTitle(ctx);
        break;
      case "ready":
        this.drawReady(ctx);
        break;
      case "running":
        this.drawRunning(ctx);
        break;
      case "results":
        this.drawResults(ctx);
        break;
    }
  }

  // --- Title ---
  private updateTitle(_dt: number): void {
    const mode = detectStartInput();
    if (mode) {
      this.playerCount = mode;
      this.changeScene("ready");
    }
  }

  private drawTitle(ctx: CanvasRenderingContext2D): void {
    ctx.fillStyle = "white";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    ctx.font = "32px serif";
    ctx.fillText("Panic! in the Kitchen", SCREEN.WIDTH / 2, SCREEN.HEIGHT / 3);

    ctx.font = "28px serif";
    ctx.fillText("1P or 2P?", SCREEN.WIDTH / 2, (SCREEN.HEIGHT * 2) / 3);
  }

  // --- Ready ---
  private updateReady(dt: number): void {
    this.updateRunning(dt);
    this.ready_timer_ms -= dt;

    if (this.ready_timer_ms <= 0) {
      this.ready_timer_ms = 4000;
      this.changeScene("running");
    }
  }

  private drawReady(ctx: CanvasRenderingContext2D): void {
    // countdown is drawn _over_ the starting state
    this.drawRunning(ctx);

    ctx.fillStyle = "white";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = "48px serif";

    const labelPosition: [number, number] = [SCREEN.WIDTH / 2, SCREEN.HEIGHT / 3];
    const countdownPosition: [number, number] = [SCREEN.WIDTH / 2, SCREEN.HEIGHT / 2];

    if (this.ready_timer_ms <= 1000) {
      ctx.fillText("ORDER UP!!", ...countdownPosition);
    } else {
      ctx.fillText("READY IN", ...labelPosition);

      if (this.ready_timer_ms <= 2000) {
        ctx.fillText("1...", ...countdownPosition);
      } else if (this.ready_timer_ms <= 3000) {
        ctx.fillText("2...", ...countdownPosition);
      } else {
        ctx.fillText("3...", ...countdownPosition);
      }
    }
  }

  // --- Running ---
  private updateRunning(dt: number): void {
    const now = performance.now();

    // 1. advance scroll — speed increases each segment
    const currentSeg = Math.floor(this.scrollDistance / SCREEN.HEIGHT);
    const speedMultiplier = 1 + currentSeg * 0.15;
    const scrollDelta = (WORLD.SCROLL_SPEED * speedMultiplier * dt) / 1000;
    this.scrollDistance += scrollDelta;

    // 2. scroll all obstacles and dishes
    for (const o of this.obstacles) {
      o.scrollBy(scrollDelta);
    }
    for (const d of this.dishes) {
      d.pos.y += scrollDelta;
    }

    // 3. update obstacle independent movement (moving type)
    for (const o of this.obstacles) {
      o.update(dt);
    }

    // 4. update players
    this.player_1?.update(dt);
    this.player_2?.update(dt);

    // 5. check player-dish collection (not while invincible)
    for (const player of [this.player_1, this.player_2]) {
      if (!player || now < player.invincibleUntil) continue;
      for (const d of this.dishes) {
        if (!d.collected && checkAABB(player, d)) {
          d.collected = true;
          player.dishes++;
        }
      }
    }

    // 6. check player-obstacle collisions — lose a dish on every hit
    for (const player of [this.player_1, this.player_2]) {
      if (!player || now < player.invincibleUntil) continue;
      for (const o of this.obstacles) {
        if (checkAABB(player, o)) {
          player.invincibleUntil = now + PLAYER.INVINCIBILITY_MS;
          if (player.dishes > 0) {
            player.dishes--;
          }
          break;
        }
      }
    }

    // 7. check player-player collisions (2P)
    if (this.player_2 && checkAABB(this.player_1!, this.player_2)) {
      bounceCollision(this.player_1!, this.player_2);
    }

    // 8. check if run is complete
    if (this.scrollDistance >= this.totalRunLength) {
      this.changeScene("results");
    }
  }

  private drawRunning(ctx: CanvasRenderingContext2D): void {
    // 1. draw obstacles (only those on screen)
    for (const o of this.obstacles) {
      if (o.pos.y + o.size.y > 0 && o.pos.y < SCREEN.HEIGHT) {
        o.draw(ctx);
      }
    }

    // 2. draw dishes (only uncollected, on screen)
    for (const d of this.dishes) {
      if (!d.collected && d.pos.y + d.size.y > 0 && d.pos.y < SCREEN.HEIGHT) {
        d.draw(ctx);
      }
    }

    // 3. draw players
    this.player_1?.draw(ctx);
    this.player_2?.draw(ctx);

    // 4. draw HUD — dish count
    ctx.font = "12px monospace";
    ctx.textBaseline = "top";
    if (this.player_1) {
      ctx.fillStyle = COLORS.P1;
      ctx.textAlign = "left";
      ctx.fillText(`${this.player_1.dishes}`, 4, 4);
    }
    if (this.player_2) {
      ctx.fillStyle = COLORS.P2;
      ctx.textAlign = "right";
      ctx.fillText(`${this.player_2.dishes}`, SCREEN.WIDTH - 4, 4);
    }
  }

  // --- Results ---
  private updateResults(_dt: number): void {
    const mode = detectStartInput();
    if (mode) {
      this.playerCount = mode;
      this.changeScene("ready");
    }
  }

  private drawResults(ctx: CanvasRenderingContext2D): void {
    ctx.fillStyle = "white";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    ctx.font = "24px serif";
    if (this.player_1 && this.player_2) {
      const p1 = this.player_1.dishes;
      const p2 = this.player_2.dishes;
      ctx.fillStyle = COLORS.P1;
      ctx.fillText(`P1: ${p1}`, SCREEN.WIDTH / 2, SCREEN.HEIGHT / 3 - 20);
      ctx.fillStyle = COLORS.P2;
      ctx.fillText(`P2: ${p2}`, SCREEN.WIDTH / 2, SCREEN.HEIGHT / 3 + 20);

      ctx.font = "32px serif";
      ctx.fillStyle = "white";
      const result = p1 > p2 ? "P1 WINS!" : p2 > p1 ? "P2 WINS!" : "TIE!";
      ctx.fillText(result, SCREEN.WIDTH / 2, (SCREEN.HEIGHT * 2) / 3);
    } else if (this.player_1) {
      ctx.fillText(`Dishes: ${this.player_1.dishes}`, SCREEN.WIDTH / 2, SCREEN.HEIGHT / 2);
    }
  }
}
