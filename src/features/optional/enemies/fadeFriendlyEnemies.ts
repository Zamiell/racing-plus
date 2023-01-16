import { EntityFlag } from "isaac-typescript-definitions";
import { setEntityOpacity } from "isaacscript-common";

/** The floating heart animation must be separately faded in "statuseffects.anm2". */
const FADE_AMOUNT = 0.25;

// ModCallback.POST_NPC_UPDATE (0)
export function postNPCUpdate(npc: EntityNPC): void {
  if (npc.HasEntityFlags(EntityFlag.FRIENDLY)) {
    setEntityOpacity(npc, FADE_AMOUNT);
  }
}
