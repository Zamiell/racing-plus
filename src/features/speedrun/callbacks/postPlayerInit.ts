import * as disableCoop from "../disableCoop";
import { inSpeedrun } from "../speedrun";

export function speedrunPostPlayerInit(player: EntityPlayer): void {
  if (!inSpeedrun()) {
    return;
  }

  disableCoop.postPlayerInit(player);
}
