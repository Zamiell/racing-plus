import { config } from "../../../modConfigMenu";
import * as openRepentanceDoor from "../openRepentanceDoor";
import * as removeRepentanceDoor from "../removeRepentanceDoor"; // eslint-disable-line unicorn/no-non-function-verb-prefix

export function racePreSpawnClearAward(): void {
  if (!config.ClientCommunication) {
    return;
  }

  openRepentanceDoor.preSpawnClearAward();
  removeRepentanceDoor.preSpawnClearAward();
}
