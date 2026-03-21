import type { Entity } from './types';

/** Returns true if two axis-aligned rectangles overlap */
export function checkAABB(_a: Entity, _b: Entity): boolean {
  // TODO: standard rectangle overlap test
  return false;
}

/** Resolves overlap between two entities, transferring momentum */
export function resolveCollision(_a: Entity, _b: Entity): void {
  // TODO: calculate overlap, determine who has more momentum,
  // push slower entity away, transfer velocity proportionally
}
