import g from "../../../globals";

export function postNPCUpdate(npc: EntityNPC): void {
  if (!g.config.fastBigHorn) {
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
