import { config } from "../../../modConfigMenu";
import * as openRepentanceDoor from "../openRepentanceDoor";
import * as removeRepentanceDoor from "../removeRepentanceDoor";
import * as removeVoidDoor from "../removeVoidDoor";

export function racePreSpawnClearAward(): void {
  if (!config.clientCommunication) {
    return;
  }

  openRepentanceDoor.preSpawnClearAward();
  removeRepentanceDoor.preSpawnClearAward();
  removeVoidDoor.preSpawnClearAward();
}
