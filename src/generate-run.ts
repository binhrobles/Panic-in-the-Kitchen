import { generateRun } from "./order-up/systems";
import { SCREEN } from "./shared/constants";
import { WORLD } from "./order-up/constants";
import type { Obstacle } from "./order-up/obstacle";

const SCALE = 2;
const COLS = SCREEN.WIDTH / SCALE; // 168
const SEGMENT_ROWS = SCREEN.HEIGHT / SCALE; // 131
const TOTAL_ROWS = WORLD.RUN_SEGMENTS * SEGMENT_ROWS;

const { obstacles } = generateRun();

// build grid
const grid: string[][] = Array.from({ length: TOTAL_ROWS }, () => Array(COLS).fill(" "));

// map obstacle to grid coordinates
const stamp = (o: Obstacle) => {
  // for moving obstacles, render the zone not the player-sized hitbox
  const renderPos = o.type === "moving" ? o.zoneOrigin : o.pos;
  const renderSize = o.type === "moving" ? o.zoneSize : o.size;

  const startRow = Math.floor(-renderPos.y / SCALE) - Math.floor(renderSize.y / SCALE);
  const startCol = Math.floor(renderPos.x / SCALE);
  const endCol = Math.floor((renderPos.x + renderSize.x) / SCALE);

  // clamp
  const r0 = Math.max(0, startRow);
  const r1 = Math.min(TOTAL_ROWS - 1, Math.floor(-renderPos.y / SCALE));
  const c0 = Math.max(0, startCol);
  const c1 = Math.min(COLS - 1, endCol - 1);

  const width = c1 - c0 + 1;
  if (width < 3) return; // too narrow to render notation

  const height = r1 - r0 + 1;
  const midC = c0 + Math.floor(width / 2);
  const midR = r0 + Math.floor(height / 2);

  for (let r = r0; r <= r1; r++) {
    const isTopBottom = r === r0 || r === r1;
    for (let c = c0; c <= c1; c++) {
      // don't overwrite solid obstacles with zone fill
      if (o.type === "moving" && grid[r][c] !== " " && grid[r][c] !== "~") continue;

      if (o.type === "static") {
        if (c === c0 || c === c1) grid[r][c] = "|";
        else if (c === midC) grid[r][c] = "T";
        else grid[r][c] = "-";
      } else {
        // moving: 2D zone with border
        if (isTopBottom) {
          if (c === c0) grid[r][c] = "+";
          else if (c === c1) grid[r][c] = "+";
          else grid[r][c] = "-";
        } else if (c === c0 || c === c1) {
          grid[r][c] = "|";
        } else if (r === midR && c === midC) {
          grid[r][c] = "M";
        } else {
          grid[r][c] = "~";
        }
      }
    }
  }
};

// stamp solids first (static + chokepoint)
const solids = obstacles.filter((o) => o.type !== "moving");
for (const o of solids) stamp(o);

// gap check on solid-only grid before movement zones are drawn
const MIN_PASSABLE_COLS = 15; // 30px / SCALE
const warnings: string[] = [];
for (let r = 0; r < TOTAL_ROWS; r++) {
  const hasSolid = grid[r].some((ch) => ch !== " ");
  if (!hasSolid) continue;

  let maxGap = 0;
  let currentGap = 0;
  for (let c = 0; c < COLS; c++) {
    if (grid[r][c] === " ") {
      currentGap++;
      maxGap = Math.max(maxGap, currentGap);
    } else {
      currentGap = 0;
    }
  }

  if (maxGap < MIN_PASSABLE_COLS) {
    const seg = Math.floor(r / SEGMENT_ROWS) + 1;
    warnings.push(
      `⚠ row ${r} (seg ${seg}): biggest gap is ${maxGap} cols (need ${MIN_PASSABLE_COLS})`,
    );
  }
}

// now stamp movement zones on top
const movers = obstacles.filter((o) => o.type === "moving");
for (const o of movers) stamp(o);

// render with segment dividers
const lines: string[] = [];
for (let r = 0; r < TOTAL_ROWS; r++) {
  if (r % SEGMENT_ROWS === 0) {
    const seg = r / SEGMENT_ROWS + 1;
    const label = ` SEGMENT ${seg}/${WORLD.RUN_SEGMENTS} `;
    const pad = Math.floor((COLS - label.length) / 2);
    lines.push("=".repeat(pad) + label + "=".repeat(COLS - pad - label.length));
  }
  lines.push(grid[r].join(""));
}
lines.push(...warnings);

console.log(lines.join("\n"));
