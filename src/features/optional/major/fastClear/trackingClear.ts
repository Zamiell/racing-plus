import { getRoomIndex, getRoomVisitedCount, log } from "isaacscript-common";
import { FAST_CLEAR_DEBUG } from "./constants";
import v from "./v";

// ModCallbacks.MC_NPC_UPDATE (0)
export function postNPCUpdate(): void {
  checkFlushOldRoomEnemies();
}

// ModCallbacks.MC_POST_UPDATE (1)
export function postUpdate(): void {
  checkFlushOldRoomEnemies();
}

// ModCallbacks.MC_POST_NEW_ROOM (19)
export function postNewRoom(): void {
  checkFlushOldRoomEnemies();
}

// ModCallbacks.MC_POST_NPC_INIT (27)
export function postNPCInit(): void {
  checkFlushOldRoomEnemies();
}

// ModCallbacks.MC_POST_ENTITY_REMOVE (67)
export function postEntityRemove(): void {
  checkFlushOldRoomEnemies();
}

// ModCallbacks.MC_POST_ENTITY_KILL (68)
export function postEntityKill(): void {
  checkFlushOldRoomEnemies();
}

function checkFlushOldRoomEnemies() {
  const roomIndex = getRoomIndex();
  const roomVisitedCount = getRoomVisitedCount();

  // If we are entering a new room, flush all of the stuff in the old room
  // We can't use the PostNewRoom callback to handle this since the NPCUpdate callback will fire
  // before that
  if (
    roomIndex !== v.run.currentRoomIndex ||
    roomVisitedCount !== v.run.currentRoomVisitedCount
  ) {
    v.run.currentRoomIndex = roomIndex;
    v.run.currentRoomVisitedCount = roomVisitedCount;

    v.run.aliveEnemies = new Set();
    v.run.delayClearUntilFrame = null;
    v.run.earlyClearedRoom = false;

    if (FAST_CLEAR_DEBUG) {
      log("Flushed fast-travel tracking entries due to entering a new room.");
    }
  }
}
