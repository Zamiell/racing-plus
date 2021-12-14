import { config } from "../../../../../modConfigMenu";
import * as crawlspace from "../crawlspace";

export function fastTravelPostPEffectUpdate(player: EntityPlayer): void {
  if (!config.fastTravel) {
    return;
  }

  crawlspace.postPEffectUpdate(player);
}
