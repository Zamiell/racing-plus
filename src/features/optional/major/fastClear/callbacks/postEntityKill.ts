// By default, the game will only consider the room to be cleared after the death animation is
// finished for all NPCs in the room
// Some enemies have a very long death animation, which forces the player to sit and wait
// To fix this, we can simply set CanShutDoors equal to false as soon as the entity dies
// At that point, the game no longer considers the NPC to exist, and it will trigger a room clear
// Note that with this method, there is a 10 frame delay between when the final NPC dies and when
// the room state is actually set to being cleared
// This method has the side effect of making lots of hearts spawn,
// since the game thinks that each boss that dies is the last boss present in the room
// To combat this, we only apply Fast-Clear to entities that have a death animation longer than 1
// frame, and reset their CanShutDoors status on the last frame of the death animation
// In the future, if a function is added to the API to set the room to being cleared,
// then we can remove this 10 frame delay by tracking all of the NPCs manually and then invoking the
// new function ourselves

import g from "../../../../../globals";
import * as angels from "../angels";
import { FAST_CLEAR_WHITELIST } from "../constants";
import * as krampus from "../krampus";

export function main(entity: Entity): void {
  if (!g.config.fastClear) {
    return;
  }

  const npc = entity.ToNPC();
  if (npc === null) {
    return;
  }

  if (!FAST_CLEAR_WHITELIST.includes(npc.Type)) {
    return;
  }

  // This is the magic that allows Fast-Clear to work
  npc.CanShutDoors = false;

  // We are not currently playing the death animation
  // (that will naturally start on the next frame)
  // Manually set the death animation now the purposes of finding out how long it is
  const sprite = npc.GetSprite();
  sprite.Play("Death", true);
  const finalFrame = getFinalFrame(sprite);

  // Mark the final frame of the death animation on the entity's data so that we can revert the
  // CanShutDoors attribute later
  const data = npc.GetData();
  data.resetAttributeFrame = finalFrame;

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

function getFinalFrame(sprite: Sprite) {
  const currentFrame = sprite.GetFrame();
  sprite.SetLastFrame();
  const finalFrame = sprite.GetFrame();
  sprite.SetFrame(currentFrame);
  return finalFrame;
}
