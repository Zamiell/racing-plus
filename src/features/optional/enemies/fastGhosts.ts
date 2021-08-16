import { config } from "../../../modConfigMenu";

// ModCallbacks.MC_NPC_UPDATE (0)
// EntityType.ENTITY_WIZOOB (219)
// EntityType.ENTITY_RED_GHOST (285)
export function postNPCUpdateGhosts(npc: EntityNPC): void {
  if (!config.fastGhosts) {
    return;
  }

  // Speed up the attack pattern of Wizoobs & Red Ghosts
  if (
    npc.State === NpcState.STATE_IDLE && // This is when they are disappeared and doing nothing
    npc.StateFrame !== 0
  ) {
    npc.StateFrame = 0; // StateFrame decrements down from 60 to 0, so just jump ahead
  }
}
