import { config } from "../../../../../modConfigMenu";
import * as crawlSpace from "../crawlSpace";

export function fastTravelPostPEffectUpdate(player: EntityPlayer): void {
  if (!config.fastTravel) {
    return;
  }

  crawlSpace.postPEffectUpdate(player);
}
