import { config } from "../../../../../modConfigMenu";
import * as crawlSpace from "../crawlSpace";

export function fastTravelPostPEffectUpdate(player: EntityPlayer): void {
  if (!config.FastTravel) {
    return;
  }

  crawlSpace.postPEffectUpdate(player);
}
