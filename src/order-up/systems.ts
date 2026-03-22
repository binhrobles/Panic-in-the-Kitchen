import { Obstacle } from "./obstacle";
import { Dish } from "./dish";
import { DISH, WORLD } from "./constants";
import { SCREEN } from "../shared/constants";

const TABLE_SIZE = 20; // square tables

type RowKind = "moving-1" | "moving-2" | "moving-3" | "table" | "table-moving";

const pickRowKind = (): RowKind => {
  const roll = Math.random();
  if (roll < 0.15) return "moving-1";
  if (roll < 0.25) return "moving-2";
  if (roll < 0.3) return "moving-3";
  if (roll < 0.65) return "table";
  return "table-moving";
};

/** Place a small square static table at a random x */
const placeTable = (y: number): Obstacle => {
  const x = Math.random() * (SCREEN.WIDTH - TABLE_SIZE);
  return new Obstacle("static", { x, y }, { x: TABLE_SIZE, y: TABLE_SIZE });
};

/** Place a moving obstacle zone — large area */
const placeMovingZone = (segTop: number, slotHeight: number): Obstacle => {
  const zoneW = SCREEN.WIDTH * (0.5 + Math.random() * 0.4); // 50-90% of screen
  const x = Math.random() * (SCREEN.WIDTH - zoneW);
  const zoneH = slotHeight * (0.6 + Math.random() * 0.3); // 60-90% of slot
  const y = segTop + Math.random() * (slotHeight - zoneH);
  return new Obstacle("moving", { x, y }, { x: zoneW, y: zoneH });
};

/** Place a dish at a fully random position within the screen width */
const placeDish = (y: number): Dish => {
  const x = DISH.SIZE + Math.random() * (SCREEN.WIDTH - DISH.SIZE * 2);
  return new Dish({ x, y });
};

export interface RunLayout {
  obstacles: Obstacle[];
  dishes: Dish[];
}

/** Generate the full obstacle map and dish placements for a run */
export const generateRun = (): RunLayout => {
  const obstacles: Obstacle[] = [];
  const dishes: Dish[] = [];

  for (let seg = 0; seg < WORLD.RUN_SEGMENTS; seg++) {
    const segTop = -(seg + 1) * SCREEN.HEIGHT;

    // obstacle count ramps slower in back half
    const t = (seg + 1) / WORLD.RUN_SEGMENTS;
    const count = Math.floor(2 + Math.sqrt(t) * 3); // gentle ramp: 2 → 5
    const slotHeight = SCREEN.HEIGHT / count;

    for (let i = 0; i < count; i++) {
      const slotTop = segTop + i * slotHeight;
      const y = slotTop + Math.random() * (slotHeight - TABLE_SIZE);
      const kind = pickRowKind();

      switch (kind) {
        case "moving-1":
          obstacles.push(placeMovingZone(slotTop, slotHeight));
          break;
        case "moving-2":
          obstacles.push(placeMovingZone(slotTop, slotHeight));
          obstacles.push(placeMovingZone(slotTop, slotHeight));
          break;
        case "moving-3":
          obstacles.push(placeMovingZone(slotTop, slotHeight));
          obstacles.push(placeMovingZone(slotTop, slotHeight));
          obstacles.push(placeMovingZone(slotTop, slotHeight));
          break;
        case "table":
          obstacles.push(placeTable(y));
          break;
        case "table-moving":
          obstacles.push(placeTable(y));
          obstacles.push(placeMovingZone(slotTop, slotHeight));
          break;
      }

      // ~60% chance to place a dish at random x
      if (Math.random() < 0.6) {
        dishes.push(placeDish(y));
      }
    }
  }

  return { obstacles, dishes };
};
