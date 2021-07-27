import g from "../../../../../globals";
import * as checkStateComplete from "../checkStateComplete";
import * as crawlspace from "../crawlspace";

export default function fastTravelPostNewRoom(): void {
  if (!g.config.fastTravel) {
    return;
  }

  checkStateComplete.postNewRoom();
  crawlspace.postNewRoom();
}
