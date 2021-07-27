// Setting Hush's appear animation to be 0 frames long has a side effect where his
// EntityCollisionClass will be set to ENTCOLL_ENEMIES instead of ENTCOLL_ALL
// We can fix this by manually setting the EntityCollisionClass on the 0th frame
// (this cannot be done in the PostNPCInit callback)

export function postNPCUpdate(npc: EntityNPC): void {
  fixHushCollision(npc);
}

function fixHushCollision(npc: EntityNPC) {
  if (npc.FrameCount === 0) {
    npc.EntityCollisionClass = EntityCollisionClass.ENTCOLL_ALL;
  }
}
