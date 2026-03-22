export const PLAYER = {
  WIDTH: 20,
  HEIGHT: 25,
  Y_POSITION: 230,
  FRICTION_ACCEL: 0.9,
  FRICTION_DECEL: 0.7,
  MAX_SPEED: 0.3,
  INVINCIBILITY_MS: 500,
} as const;

export const WORLD = {
  SCROLL_SPEED: 60,
  SLOWDOWN_FACTOR: 0.3,
  SLOWDOWN_MS: 300,
  RUN_SEGMENTS: 20,
} as const;

export const GRADES = [
  "A+",
  "A",
  "A-",
  "B+",
  "B",
  "B-",
  "C+",
  "C",
  "C-",
  "D+",
  "D",
  "D-",
  "F",
] as const;

export type Grade = (typeof GRADES)[number];

export const COLORS = {
  P1: "#4488ff",
  P2: "#ff4444",
  OBSTACLE_STATIC: "#666666",
  OBSTACLE_MOVING: "#aa6633",
  OBSTACLE_CHOKEPOINT: "#555555",
  BACKGROUND: "#1a1a2e",
} as const;
