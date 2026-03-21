import { SCREEN } from "../shared/constants";
import { detectStartInput } from "../shared/input";
import { COLORS } from "./constants";
import { Player } from "./entities";

type SceneName = "title" | "ready" | "running" | "results";

export class OrderUpGame {
  // title
  currentScene: SceneName = "title";
  playerCount: number = 1;

  // ready
  ready_timer_ms: number = 4000;

  // running
  player_progression: number = 0;
  player_1: Player | null = null;
  player_2: Player | null = null;

  // --- Top Level Functions ---
  changeScene(name: SceneName): void {
    this.currentScene = name;

    if (this.currentScene === "ready") {
      this.ready_timer_ms = 4000;

      this.player_progression = 0;
      if (this.playerCount === 1) {
        this.player_1 = new Player(1, true);
      } else {
        this.player_1 = new Player(1, false);
        this.player_2 = new Player(2, false);
      }

      // TODO: generate the map, set in state, so we can draw countdown _on_ game
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
    // TODO:
    // 1. update scrollSpeed (check if in slowdown)
    // 2. scrollDistance += scrollSpeed * dt
    // 3. move all obstacles: pos.y += scrollSpeed * dt
    // 4. update obstacle independent movement (moving type)
    // 5. update players (input + physics)
    this.player_1?.update(dt);
    this.player_2?.update(dt);

    // 6. check player-obstacle collisions → grade drop + slowdown + invincibility
    // 7. check player-player collisions (2P) → momentum transfer
    // 8. check if scrollDistance >= totalRunLength → changeScene('results')
  }

  private drawRunning(ctx: CanvasRenderingContext2D): void {
    // TODO:
    // 1. draw obstacles
    // 2. draw players
    this.player_1?.draw(ctx);
    this.player_2?.draw(ctx);

    // 3. draw HUD (P1 grade top-left, P2 grade top-right)
  }

  // --- Results ---
  private updateResults(_dt: number): void {
    // TODO: detect start button → changeScene('title')
  }

  private drawResults(_ctx: CanvasRenderingContext2D): void {
    // TODO: show final grades prominently
    // In 2P: compare grade index in GRADES array, display winner or "TIE"
  }
}
