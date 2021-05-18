import g from "../../../globals";
import * as tracking from "../tracking";

export function main(entity: Entity): void {
  if (!g.config.fastClear) {
    return;
  }

  // We only care about NPCs dying
  const npc = entity.ToNPC();
  if (npc === null) {
    return;
  }

  // We cannot completely rely on the PostEntityKill callback because it is not fired for certain
  // NPCs (like when Daddy Long Legs does a stomp attack or a Portal despawns)
  tracking.checkRemove(npc, "postEntityRemove");
}
