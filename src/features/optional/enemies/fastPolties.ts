import { config } from "../../../modConfigMenu";

// ModCallbacksCustom.MC_POST_NPC_INIT_LATE
// EntityType.ENTITY_POLTY (816)
export function postNPCInitLatePolty(npc: EntityNPC): void {
  if (!config.fastPolties) {
    return;
  }

  npc.StateFrame = 0;
}
