import { config } from "../../../../../modConfigMenu";
import * as crawlspace from "../crawlspace";

export function fastTravelPostUpdate(): void {
  if (!config.fastTravel) {
    return;
  }

  crawlspace.postUpdate();
}
