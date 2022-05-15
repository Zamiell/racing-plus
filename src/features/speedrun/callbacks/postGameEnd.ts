import { inSpeedrun } from "../speedrun";
import v from "../v";

export function speedrunPostGameEnd(isGameOver: boolean): void {
  if (!inSpeedrun()) {
    return;
  }

  if (!isGameOver) {
    return;
  }

  // Don't move to the first character of the speedrun if we die.
  v.persistent.performedFastReset = true;
}
