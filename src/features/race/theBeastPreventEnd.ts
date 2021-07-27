import * as charge from "../../charge";
import g from "../../globals";

// The game will always trigger a cutscene and force the player to leave the run
// By simply setting the room to be cleared when The Beast dies,
// the game will never trigger the cutscene and we will spawn a big chest
export function postEntityKillTheBeast(_entity: Entity): void {
  const variant = _entity.Variant;

  if (variant !== BeastVariant.BEAST) {
    return;
  }

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
