// Prevent the bug where if Suction Pitfalls do not complete their "Disappear" animation by the time
// the player leaves the room, they will re-appear the next time the player enters the room
// (even though the room is already cleared and they should be gone)

import { removeAllMatchingEntities } from "isaacscript-common";
import g from "../../../globals";
import { config } from "../../../modConfigMenu";

// ModCallbacks.MC_POST_NEW_ROOM (19)
export function postNewRoom(): void {
  if (!config.removeInvalidPitfalls) {
    return;
  }

  const roomClear = g.r.IsClear();
  if (!roomClear) {
    return;
  }

  removeAllMatchingEntities(
    EntityType.ENTITY_PITFALL,
    PitfallVariant.SUCTION_PITFALL,
  );
}
