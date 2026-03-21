/** Returns horizontal delta this frame. Reads spinner (primary) or D-pad (fallback). */
export function getHorizontalInput(_playerIndex: number): number {
  // TODO: read from spinner (primary) or D-pad (fallback)
  // See existing main.ts for import patterns:
  //   import { PLAYER_1 } from '@rcade/plugin-input-classic'
  //   import { PLAYER_1 as PLAYER_1_SPINNER } from '@rcade/plugin-input-spinners'
  //   PLAYER_1.DPAD.left / .right for D-pad
  //   PLAYER_1_SPINNER.SPINNER.consume_step_delta() for spinner
  // For P2, import PLAYER_2 from both plugins
  return 0;
}
