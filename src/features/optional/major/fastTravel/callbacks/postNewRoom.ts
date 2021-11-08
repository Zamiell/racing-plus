import { config } from "../../../../../modConfigMenu";
import * as crawlspace from "../crawlspace";

export function fastTravelPostNewRoom(): void {
  if (!config.fastTravel) {
    return;
  }

  crawlspace.postNewRoom();
}
