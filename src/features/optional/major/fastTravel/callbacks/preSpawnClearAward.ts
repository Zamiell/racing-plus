import { config } from "../../../../../modConfigMenu";
import * as heavenDoor from "../heavenDoor";
import { fastTravelSetClearFrame } from "../v";

export function fastTravelPreSpawnClearAward(): void {
  if (!config.fastTravel) {
    return;
  }

  fastTravelSetClearFrame();
  heavenDoor.postRoomClear();
}
