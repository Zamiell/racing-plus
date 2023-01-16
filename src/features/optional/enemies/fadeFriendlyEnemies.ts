import { EntityFlag } from "isaac-typescript-definitions";
import { setEntityOpacity } from "isaacscript-common";

/**
 * We must fade it to a severe degree because the animated hearts above friendly entities are very
 * prominent.
 */
const FADE_AMOUNT = 0.25;

// ModCallback.POST_NPC_UPDATE (0)
export function postNPCUpdate(npc: EntityNPC): void {
  if (npc.HasEntityFlags(EntityFlag.FRIENDLY)) {
    setEntityOpacity(npc, FADE_AMOUNT);
  }
}
