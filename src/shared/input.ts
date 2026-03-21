import {
  PLAYER_1 as PLAYER_1_INPUT,
  PLAYER_2 as PLAYER_2_INPUT,
  SYSTEM,
} from "@rcade/plugin-input-classic";
import {
  PLAYER_1 as PLAYER_1_SPINNER,
  PLAYER_2 as PLAYER_2_SPINNER,
} from "@rcade/plugin-input-spinners";

export function detectStartInput(): number | null {
  if (SYSTEM.ONE_PLAYER) return 1;
  if (SYSTEM.TWO_PLAYER) return 2;
  return null;
}

/** Returns horizontal delta this frame. Reads spinner (primary) or D-pad (fallback). */
export function getHorizontalInput(playerIndex: number): number {
  const spinner = playerIndex === 1 ? PLAYER_1_SPINNER.SPINNER : PLAYER_2_SPINNER.SPINNER;
  const spinnerDelta = spinner.consume_step_delta();
  if (spinnerDelta !== 0) {
    return spinnerDelta;
  }

  const dpad = playerIndex === 1 ? PLAYER_1_INPUT.DPAD : PLAYER_2_INPUT.DPAD;
  const DPAD_WEIGHT = 0.2;

  if (dpad.left) {
    return -DPAD_WEIGHT;
  }
  if (dpad.right) {
    return DPAD_WEIGHT;
  }

  return 0;
}
