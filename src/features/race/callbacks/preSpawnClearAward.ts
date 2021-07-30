import g from "../../../globals";
import * as openRepentanceDoor from "../openRepentanceDoor";
import * as removeRepentanceDoor from "../removeRepentanceDoor";

export default function preSpawnClearAward(): void {
  if (!g.config.clientCommunication) {
    return;
  }

  openRepentanceDoor.preSpawnClearAward();
  removeRepentanceDoor.preSpawnClearAward();
}
