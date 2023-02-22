import { config } from "../../../../../modConfigMenu";
import * as heavenDoor from "../heavenDoor";
import { setFastTravelClearFrame } from "../v";

export function fastTravelPreSpawnClearAward(): void {
  if (!config.FastTravel) {
    return;
  }

  setFastTravelClearFrame();
  heavenDoor.postRoomClear();
}
