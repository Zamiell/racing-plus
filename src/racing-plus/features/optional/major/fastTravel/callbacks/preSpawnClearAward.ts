import { config } from "../../../../../modConfigMenu";
import * as heavenDoor from "../heavenDoor";
import { fastTravelSetClearFrame } from "../v";

export default function fastTravelPreSpawnClearAward(): void {
  if (!config.fastTravel) {
    return;
  }

  fastTravelSetClearFrame();
  heavenDoor.postRoomClear();
}
