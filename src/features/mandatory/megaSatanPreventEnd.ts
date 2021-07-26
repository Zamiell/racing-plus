import * as charge from "../../charge";
import g from "../../globals";
import * as roomClearDelayNPC from "../../roomClearDelayNPC";

export function postEntityKill(_entity: Entity): void {
  // Stop the room from being cleared, which has a chance to take us back to the menu
  roomClearDelayNPC.spawn();

  // Emulate the room being cleared
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

  // Set the room status to clear so that the player cannot fight Mega Satan a second time
  // (e.g. if they use a Fool Card)
  g.r.SetClear(true);
}
