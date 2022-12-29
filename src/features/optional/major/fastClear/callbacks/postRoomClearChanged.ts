import { log } from "isaacscript-common";
import { shouldEnableFastClear } from "../shouldEnableFastClear";
import v from "../v";

export function fastClearPostRoomClearChanged(roomClear: boolean): void {
  if (!shouldEnableFastClear()) {
    return;
  }

  checkVanillaRoomClear(roomClear);
}

function checkVanillaRoomClear(roomClear: boolean) {
  const verb = roomClear ? "cleared" : "uncleared";
  log(`Room state changed to: ${verb}`);

  if (roomClear && !v.room.fastClearedRoom) {
    log("Vanilla room clear detected.");
  }
}
