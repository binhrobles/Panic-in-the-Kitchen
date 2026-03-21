import type { Obstacle } from './entities';
import { type Grade, GRADES } from './constants';

/** Generate the full obstacle map for a run */
export function generateRun(): Obstacle[] {
  // TODO: divide run into RUN_SEGMENTS segments, each SCREEN.HEIGHT tall
  // place obstacles at negative Y values (above screen, scroll down)
  // difficulty ramp: sparse early, dense late
  // moving obstacles appear ~30%, chokepoints ~50%
  // ensure at least one player-width gap per segment
  // no left/right balance requirement
  return [];
}

/** Drop grade by one step, returns new grade */
export function dropGrade(current: Grade): Grade {
  const index = GRADES.indexOf(current);
  if (index === -1 || index >= GRADES.length - 1) return 'F';
  return GRADES[index + 1];
}
