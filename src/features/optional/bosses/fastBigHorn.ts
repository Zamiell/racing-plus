import { BigHornState } from "isaac-typescript-definitions";
import { asNpcState } from "isaacscript-common";
import { config } from "../../../modConfigMenu";

// ModCallback.POST_NPC_UPDATE (0)
// EntityType.BIG_HORN (411)
export function postNPCUpdateBigHorn(npc: EntityNPC): void {
  if (!config.fastBigHorn) {
    return;
  }

  // Speed up coming out of the ground.
  if (
    npc.State ===
      asNpcState(BigHornState.HEAD_GOING_UP_OR_GOING_DOWN_INTO_HOLE) &&
    npc.StateFrame >= 67 &&
    npc.StateFrame < 100
  ) {
    npc.StateFrame = 100;
  }
}
