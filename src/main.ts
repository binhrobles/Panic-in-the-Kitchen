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
  const dt = (now - lastTime) / 1000;
  lastTime = now;

  game.update(dt);
  game.draw(ctx);

  requestAnimationFrame(loop);
}

game.changeState('title');
requestAnimationFrame(loop);
