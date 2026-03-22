import {
  PLAYER_1 as PLAYER_1_INPUT,
  PLAYER_2 as PLAYER_2_INPUT,
  SYSTEM,
} from "@rcade/plugin-input-classic";
import {
  PLAYER_1 as PLAYER_1_SPINNER,
  PLAYER_2 as PLAYER_2_SPINNER,
} from "@rcade/plugin-input-spinners";

export const detectStartInput = (): number | null => {
  if (SYSTEM.ONE_PLAYER) return 1;
  if (SYSTEM.TWO_PLAYER) return 2;
  return null;
};

/** Returns horizontal delta this frame. Reads spinner (primary) or D-pad (fallback). */
export const getHorizontalInput = (playerIndex: number): number => {
  const spinner = playerIndex === 1 ? PLAYER_1_SPINNER.SPINNER : PLAYER_2_SPINNER.SPINNER;
  const spinnerDelta = spinner.consume_step_delta();

  // TODO: need to understand the numeric range bw a "fast" spin vs a slow spin
  if (spinnerDelta !== 0) {
    return spinnerDelta;
  }

  const dpad = playerIndex === 1 ? PLAYER_1_INPUT.DPAD : PLAYER_2_INPUT.DPAD;
  const DPAD_WEIGHT = 0.1;

  if (dpad.left) {
    return -DPAD_WEIGHT;
  }
  if (dpad.right) {
    return DPAD_WEIGHT;
  }

  return 0;
};
