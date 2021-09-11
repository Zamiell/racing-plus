import { config } from "../../../modConfigMenu";

// ModCallbacks.MC_NPC_UPDATE (0)
// EntityType.ENTITY_BIG_HORN (411)
export function postNPCUpdateBigHorn(npc: EntityNPC): void {
  if (!config.fastBigHorn) {
    return;
  }

  // Speed up coming out of the ground
  if (
    npc.State === BigHornState.HEAD_GOING_UP_OR_GOING_DOWN_INTO_HOLE &&
    npc.StateFrame >= 67 &&
    npc.StateFrame < 100
  ) {
    npc.StateFrame = 100;
  }
}
