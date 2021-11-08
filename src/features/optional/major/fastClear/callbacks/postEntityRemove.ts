import { shouldEnableFastClear } from "../shouldEnableFastClear";
import * as tracking from "../tracking";

export function fastClearPostEntityRemove(entity: Entity): void {
  if (!shouldEnableFastClear()) {
    return;
  }

  const npc = entity.ToNPC();
  if (npc === undefined) {
    return;
  }

  // We cannot completely rely on the PostEntityKill callback because it is not fired for certain
  // NPCs (like when Daddy Long Legs does a stomp attack or a Portal despawns)
  tracking.checkRemove(npc, false);
}
