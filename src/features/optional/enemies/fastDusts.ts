import { config } from "../../../modConfigMenu";

export function postNPCUpdateDust(npc: EntityNPC): void {
  if (!config.fastDusts) {
    return;
  }

  if (npc.State === NpcState.STATE_SPECIAL) {
    npc.State = NpcState.STATE_IDLE;
  }
}
