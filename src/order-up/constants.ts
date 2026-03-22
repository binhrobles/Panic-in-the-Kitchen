export const PLAYER = {
  WIDTH: 16,
  HEIGHT: 20,
  Y_POSITION: 230,
  FRICTION_ACCEL: 0.9,
  FRICTION_DECEL: 0.7,
  MAX_SPEED: 0.3,
  INVINCIBILITY_MS: 500,
} as const;

export const DISH = {
  SIZE: 10,
} as const;

export const WORLD = {
  SCROLL_SPEED: 60,
  RUN_SEGMENTS: 20,
} as const;

export const COLORS = {
  P1: "#4488ff",
  P2: "#ff4444",
  OBSTACLE_STATIC: "#666666",
  OBSTACLE_MOVING: "#aa6633",
  DISH: "#ffcc00",
  BACKGROUND: "#1a1a2e",
} as const;
