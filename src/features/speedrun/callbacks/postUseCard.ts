import * as preserveCheckpoint from "../preserveCheckpoint";
import * as season4 from "../season4";
import { inSpeedrun } from "../speedrun";

export function blackRune(player: EntityPlayer): void {
  if (!inSpeedrun()) {
    return;
  }

  preserveCheckpoint.useCardBlackRune();
  season4.useCardBlackRune(player);
}
