import * as preserveCheckpoint from "../preserveCheckpoint";
import { inSpeedrun } from "../speedrun";

export function blackRune(): void {
  if (!inSpeedrun()) {
    return;
  }

  preserveCheckpoint.useCardBlackRune();
}
