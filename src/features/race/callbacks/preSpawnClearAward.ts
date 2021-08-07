import { config } from "../../../modConfigMenu";
import * as openRepentanceDoor from "../openRepentanceDoor";
import * as removeRepentanceDoor from "../removeRepentanceDoor";

export default function preSpawnClearAward(): void {
  if (!config.clientCommunication) {
    return;
  }

  openRepentanceDoor.preSpawnClearAward();
  removeRepentanceDoor.preSpawnClearAward();
}
