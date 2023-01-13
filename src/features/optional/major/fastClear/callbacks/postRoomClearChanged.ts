import { log } from "isaacscript-common";
import { shouldEnableFastClear } from "../shouldEnableFastClear";
import { v } from "../v";

/** This intentionally does not use the `PRE_SPAWN_CLEAR_AWARD` callback. */
export function fastClearPostRoomClearChanged(roomClear: boolean): void {
  if (!shouldEnableFastClear()) {
    return;
  }

  checkVanillaRoomClear(roomClear);
}

function checkVanillaRoomClear(roomClear: boolean) {
  if (roomClear && !v.room.fastClearedRoom) {
    log("Vanilla room clear detected.");
  }
}
