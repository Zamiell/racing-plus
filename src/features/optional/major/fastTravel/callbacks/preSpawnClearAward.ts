import { config } from "../../../../../modConfigMenu";
import * as heavenDoor from "../heavenDoor";
import { setFastTravelClearFrame } from "../v";

export function fastTravelPreSpawnClearAward(): void {
  if (!config.fastTravel) {
    return;
  }

  setFastTravelClearFrame();
  heavenDoor.postRoomClear();
}
