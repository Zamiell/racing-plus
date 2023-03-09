import * as crawlSpace from "../../../../../classes/features/optional/major/fastTravel/crawlSpace";
import { config } from "../../../../../modConfigMenu";

export function fastTravelPostPEffectUpdate(player: EntityPlayer): void {
  if (!config.FastTravel) {
    return;
  }

  crawlSpace.postPEffectUpdate(player);
}
