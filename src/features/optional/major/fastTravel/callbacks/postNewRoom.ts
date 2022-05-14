import { config } from "../../../../../modConfigMenu";
import * as crawlSpace from "../crawlSpace";

export function fastTravelPostNewRoom(): void {
  if (!config.fastTravel) {
    return;
  }

  crawlSpace.postNewRoom();
}
