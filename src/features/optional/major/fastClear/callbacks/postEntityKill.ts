// By default, the game will only consider the room to be cleared after the death animation is
// finished for all NPCs in the room
// Some enemies have a very long death animation, which forces the player to sit and wait
// To fix this, we can simply set CanShutDoors equal to false as soon as the entity dies
// At that point, the game no longer considers the NPC to exist, and it will trigger a room clear
// Note that with this method, there is a 10 frame delay between when the final NPC dies and when
// the room state is actually set to being cleared
// This method has the side effect of making lots of hearts spawn,
// since the game thinks that each boss that dies is the last boss present in the room
// To combat this, we only apply fast-clear to entities that have a death animation longer than 1
// frame, and reset their CanShutDoors status on the last frame of the death animation
// In the future, if a function is added to the API to set the room to being cleared,
// then we can remove this 10 frame delay by tracking all of the NPCs manually and then invoking the
// new function ourselves

import g from "../../../../../globals";
import {
  FAST_CLEAR_WHITELIST,
  FAST_CLEAR_WHITELIST_WITH_SPECIFIC_VARIANT,
} from "../constants";

export default function fastClearPostEntityKill(entity: Entity): void {
  if (!g.config.fastClear) {
    return;
  }

  const npc = entity.ToNPC();
  if (npc === null) {
    return;
  }

  if (!isWhitelistedNPC(npc)) {
    return;
  }

  const gameFrameCount = g.g.GetFrameCount();

  // Mark to modify the NPC on the next frame
  // We can't set the CanShutDoors property now because it will prevent the NPC from dropping a
  // heart (in the case of Tainted Magdalene) or a coin (in the case of Tainted Keeper)
  // (the heart/coin will drop on the next frame)
  g.run.room.fastClearNPCQueue.push({
    gameFrameToModify: gameFrameCount + 1,
    entityPtr: EntityPtr(npc),
  });
}

function isWhitelistedNPC(npc: EntityNPC) {
  // The main fast-clear whitelist just includes NPC types
  if (FAST_CLEAR_WHITELIST.includes(npc.Type)) {
    return true;
  }

  // Some NPCs are only whitelisted that have specific variants
  for (const [
    entityType,
    entityVariant,
  ] of FAST_CLEAR_WHITELIST_WITH_SPECIFIC_VARIANT) {
    if (entityType === npc.Type && entityVariant === npc.Variant) {
      return true;
    }
  }

  return false;
}
