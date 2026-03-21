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
