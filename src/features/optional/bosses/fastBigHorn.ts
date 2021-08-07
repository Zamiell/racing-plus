import { config } from "../../../modConfigMenu";

export function postNPCUpdate(npc: EntityNPC): void {
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
