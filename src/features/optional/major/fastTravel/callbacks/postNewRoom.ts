import { config } from "../../../../../modConfigMenu";
import * as checkStateComplete from "../checkStateComplete";
import * as crawlspace from "../crawlspace";

export default function fastTravelPostNewRoom(): void {
  if (!config.fastTravel) {
    return;
  }

  checkStateComplete.postNewRoom();
  crawlspace.postNewRoom();
}
