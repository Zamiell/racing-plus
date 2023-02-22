import { config } from "../../../../../modConfigMenu";
import * as crawlSpace from "../crawlSpace";

export function fastTravelPostNewRoom(): void {
  if (!config.FastTravel) {
    return;
  }

  crawlSpace.postNewRoom();
}
