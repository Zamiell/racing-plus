import { NpcState } from "isaac-typescript-definitions";
import { config } from "../../../modConfigMenu";

// ModCallback.POST_NPC_UPDATE (0)
// EntityType.DUST (882)
export function postNPCUpdateDust(npc: EntityNPC): void {
  if (!config.fastDusts) {
    return;
  }

  if (npc.State === NpcState.SPECIAL) {
    npc.State = NpcState.IDLE;
  }
}
