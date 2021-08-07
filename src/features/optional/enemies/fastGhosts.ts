import { config } from "../../../modConfigMenu";

export function postNPCUpdate(npc: EntityNPC): void {
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
