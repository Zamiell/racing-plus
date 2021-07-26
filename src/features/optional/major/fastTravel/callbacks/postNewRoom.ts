import g from "../../../../../globals";
import * as checkStateComplete from "../checkStateComplete";
import * as crawlspace from "../crawlspace";
import * as trapdoor from "../trapdoor";

export default function fastTravelPostNewRoom(): void {
  if (!g.config.fastTravel) {
    return;
  }

  checkStateComplete.postNewRoom();

  trapdoor.postNewRoom();
  crawlspace.postNewRoom();
}
