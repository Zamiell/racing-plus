import * as heavenDoor from "../../../../../classes/features/optional/major/fastTravel/heavenDoor";
import { setFastTravelClearFrame } from "../../../../../classes/features/optional/major/fastTravel/v";
import { config } from "../../../../../modConfigMenu";

export function fastTravelPreSpawnClearAward(): void {
  if (!config.FastTravel) {
    return;
  }

  setFastTravelClearFrame();
  heavenDoor.postRoomClear();
}
