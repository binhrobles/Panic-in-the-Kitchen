import type { Entity } from "./types";

/** Returns true if two axis-aligned rectangles overlap */
export const checkAABB = (a: Entity, b: Entity): boolean =>
  a.pos.x < b.pos.x + b.size.x &&
  a.pos.x + a.size.x > b.pos.x &&
  a.pos.y < b.pos.y + b.size.y &&
  a.pos.y + a.size.y > b.pos.y;

/** Resolves overlap between two entities, transferring momentum */
export const bounceCollision = (a: Entity, b: Entity): void => {
  // separate positions so collision only fires once
  const overlap = a.pos.x + a.size.x - b.pos.x;
  a.pos.x -= overlap / 2;
  b.pos.x += overlap / 2;

  // swap velocities
  const a_vel = a.vel;
  const b_vel = b.vel;
  a.vel = b_vel * 0.7; // some velocity lost in the impact
  b.vel = a_vel * 0.7;

  // add bounce impulse pushing them apart
  const impact = Math.abs(a_vel - b_vel);
  const impulse = impact * 0.35;
  a.vel -= impulse;
  b.vel += impulse;
};
