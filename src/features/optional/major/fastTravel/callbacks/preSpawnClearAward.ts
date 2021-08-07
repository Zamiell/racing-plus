import { config } from "../../../../../modConfigMenu";
import * as heavenDoor from "../heavenDoor";
import { setClearFrame } from "../v";

export default function fastTravelPreSpawnClearAward(): void {
  if (!config.fastTravel) {
    return;
  }

  setClearFrame();
  heavenDoor.postRoomClear();
}
