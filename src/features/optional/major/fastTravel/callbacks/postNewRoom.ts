import * as crawlSpace from "../../../../../classes/features/optional/major/fastTravel/crawlSpace";
import { config } from "../../../../../modConfigMenu";

export function fastTravelPostNewRoom(): void {
  if (!config.FastTravel) {
    return;
  }

  crawlSpace.postNewRoom();
}
