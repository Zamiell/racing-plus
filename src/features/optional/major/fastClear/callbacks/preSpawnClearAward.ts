import { getRoomNPCs } from "isaacscript-common";
import g from "../../../../../globals";

export default function fastClearPreSpawnClearAward(): void {
  if (!g.config.fastClear) {
    return;
  }

  resetAllDyingNPCs();
}

function resetAllDyingNPCs() {
  // The main bug with fast-clear is that by setting CanShutDoors equal to true,
  // bosses will drop hearts at inappropriate times
  // We fix this by resetting CanShutDoors on the last frame of the death animation
  // But in addition to this, we also need to account for the fact that a room can be cleared with
  // two separate bosses dying, which would result in two hearts being dropped, because even though
  // their CanShutDoors value is reset, the game will still think that the first boss that dies is
  // the final boss (since the CanShutDoors value of the 2nd boss has not been reset back to normal)
  // This can be fixed by resetting the CanShutDoors values of all NPCs in the room when the room is
  // cleared
  for (const npc of getRoomNPCs()) {
    const data = npc.GetData();
    if (data.resetAttributeFrame === undefined) {
      continue;
    }

    npc.CanShutDoors = true;
    data.resetAttributeFrame = undefined;
  }
}
