import { config } from "../../../modConfigMenu";

// ModCallbackCustom.POST_NPC_INIT_LATE
// EntityType.POLTY (816)
export function postNPCInitLatePolty(npc: EntityNPC): void {
  if (!config.fastPolties) {
    return;
  }

  npc.StateFrame = 0;
}
