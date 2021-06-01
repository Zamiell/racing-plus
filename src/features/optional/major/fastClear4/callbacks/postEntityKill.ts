// By default, the game will only consider the room to be cleared after the death animation is
// finished for all NPCs in the room
// Some enemies have a very long death animation, which forces the player to sit and wait
// To fix this, we can simply set CanShutDoors equal to false as soon as the entity dies
// At that point, the game no longer considers the NPC to exist, and it will trigger a room clear
// Note that with this method, there is a 10 frame delay between when the final NPC dies and when
// the room state is actually set to being cleared
// In the future, if a function is added to the API to set the room to being cleared,
// then we can remove this 10 frame delay by tracking all of the NPCs manually and then invoking the
// new function ourselves

import g from "../../../../../globals";
import * as angels from "../angels";
import * as krampus from "../krampus";

// Mom is exempt from Fast-Clear to prevent the bug where all 4 copies of her will drop hearts
const FAST_CLEAR_EXCEPTIONS = [EntityType.ENTITY_MOM];

export function main(entity: Entity): void {
  if (!g.config.fastClear4) {
    return;
  }

  const npc = entity.ToNPC();
  if (npc === null) {
    return;
  }

  if (FAST_CLEAR_EXCEPTIONS.includes(npc.Type)) {
    return;
  }

  npc.CanShutDoors = false;

  // Perform some additional steps for specific entities
  if (npc.Type === EntityType.ENTITY_FALLEN && npc.Variant === 1) {
    krampus.postEntityKill(npc);
  } else if (
    (npc.Type === EntityType.ENTITY_URIEL ||
      npc.Type === EntityType.ENTITY_GABRIEL) &&
    // Fallen Angels do not drop items
    entity.Variant === 0
  ) {
    angels.postEntityKill(npc);
  }
}
