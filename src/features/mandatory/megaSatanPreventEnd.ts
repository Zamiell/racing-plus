// There is a 50% chance after defeating Mega Satan that the game will trigger a cutscene and force
// the player to leave the run
// By simply setting the room to be cleared when Mega Satan 2 dies,
// the game will never go on to make the 50% roll

import { addRoomClearCharges, spawnPickup } from "isaacscript-common";
import g from "../../globals";

// ModCallbacks.MC_POST_ENTITY_KILL (68)
// EntityType.ENTITY_MEGA_SATAN_2 (275)
export function postEntityKillMegaSatan2(_entity: Entity): void {
  emulateRoomClear();
}

function emulateRoomClear() {
  // Emulate the room being cleared
  g.r.SetClear(true);
  addRoomClearCharges();

  // Spawn a big chest (which will get replaced with a trophy if we happen to be in a race)
  const position = g.r.GetCenterPos();
  spawnPickup(PickupVariant.PICKUP_BIGCHEST, 0, position);
}
