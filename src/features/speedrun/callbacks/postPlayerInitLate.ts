import * as season4 from "../season4";
import { inSpeedrun } from "../speedrun";

export function speedrunPostPlayerInitLate(player: EntityPlayer): void {
  if (!inSpeedrun()) {
    return;
  }

  season4.postPlayerInitLate(player);
}
