import * as charge from "../../charge";
import g from "../../globals";

// There is a 50% chance after defeating Mega Satan that the game will trigger a cutscene and force
// the player to leave the run
// By simply setting the room to be cleared when Mega Satan 2 dies,
// the game will never go on to make the 50% roll
export function postEntityKill(_entity: Entity): void {
  emulateRoomClear();
}

function emulateRoomClear() {
  // Emulate the room being cleared
  g.r.SetClear(true);
  charge.checkAdd();

  // Spawn a big chest (which will get replaced with a trophy if we happen to be in a race)
  const position = g.r.GetCenterPos();
  Isaac.Spawn(
    EntityType.ENTITY_PICKUP,
    PickupVariant.PICKUP_BIGCHEST,
    0,
    position,
    Vector.Zero,
    null,
  );
}
