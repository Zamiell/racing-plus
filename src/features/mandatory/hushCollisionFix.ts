// Setting Hush's appear animation to be 0 frames long has a side effect where his
// `EntityCollisionClass` will be set to `ENEMIES` instead of `ALL`. We can fix this by manually
// setting the `EntityCollisionClass` on the 0th frame. (This cannot be done in the PostNPCInit
// callback.)

import { EntityCollisionClass } from "isaac-typescript-definitions";

// ModCallback.POST_NPC_UPDATE (0)
// EntityType.HUSH (407)
export function postNPCUpdateHush(npc: EntityNPC): void {
  fixHushCollision(npc);
}

function fixHushCollision(npc: EntityNPC) {
  if (npc.FrameCount === 0) {
    npc.EntityCollisionClass = EntityCollisionClass.ALL;
  }
}
