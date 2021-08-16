import { config } from "../../../modConfigMenu";

// ModCallbacks.MC_NPC_UPDATE (0)
// EntityType.ENTITY_BIG_HORN (411)
export function postNPCUpdateBigHorn(npc: EntityNPC): void {
  if (!config.fastBigHorn) {
    return;
  }

  // Speed up coming out of the ground
  if (
    npc.State === NpcState.STATE_MOVE &&
    npc.StateFrame >= 67 &&
    npc.StateFrame < 100
  ) {
    npc.StateFrame = 100;
  }
}
