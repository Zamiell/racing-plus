import g from "../../../../../globals";
import * as tracking from "../tracking";

// We can't use the PostNPCDeath callback or PostEntityRemove callbacks because they are only fired
// once the death animation is finished
export function main(entity: Entity): void {
  if (!g.fastClear) {
    return;
  }

  // We only care about NPCs dying
  const npc = entity.ToNPC();
  if (npc === null) {
    return;
  }

  tracking.checkRemove(npc, true);
}
