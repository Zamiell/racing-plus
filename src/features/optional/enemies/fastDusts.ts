import { config } from "../../../modConfigMenu";

// ModCallbacks.MC_NPC_UPDATE (0)
// EntityType.ENTITY_DUST (882)
export function postNPCUpdateDust(npc: EntityNPC): void {
  if (!config.fastDusts) {
    return;
  }

  if (npc.State === NpcState.STATE_SPECIAL) {
    npc.State = NpcState.STATE_IDLE;
  }
}
