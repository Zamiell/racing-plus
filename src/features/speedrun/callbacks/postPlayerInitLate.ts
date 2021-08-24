import * as disableCoop from "../disableCoop";
import { inSpeedrun } from "../speedrun";

export function speedrunPostPlayerInitLate(player: EntityPlayer): void {
  if (!inSpeedrun()) {
    return;
  }

  disableCoop.postPlayerInitLate(player);
}
