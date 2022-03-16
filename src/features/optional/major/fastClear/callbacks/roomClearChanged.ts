import { log } from "isaacscript-common";
import { shouldEnableFastClear } from "../shouldEnableFastClear";
import v from "../v";

export function fastClearRoomClearChanged(roomClear: boolean): void {
  if (!shouldEnableFastClear()) {
    return;
  }

  checkVanillaRoomClear(roomClear);
}

function checkVanillaRoomClear(roomClear: boolean) {
  // Sometimes, the room clear state can go from cleared to uncleared
  // (e.g. the player bombed an angel)
  // Ignore these cases
  if (!roomClear) {
    return;
  }

  if (!v.room.fastClearedRoom) {
    log("Vanilla room clear detected.");
  }
}
