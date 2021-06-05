import g from "../../../globals";
import { log } from "../../../misc";

const MAX_REGENERATIONS = 4;

export function postNPCUpdate(npc: EntityNPC): void {
  if (!g.config.globinSoftlock) {
    return;
  }

  const data = npc.GetData();

  // Globins are always in NpcState.STATE_MOVE (when chasing) or NpcState.STATE_IDLE (when dead)
  if (npc.State === data.lastState) {
    return;
  }

  data.lastState = npc.State;

  if (npc.State !== NpcState.STATE_IDLE) {
    return;
  }

  // The Globin is now in a flesh-pile
  // Increment the number of regenerations
  if (data.numRegenerations === undefined) {
    data.numRegenerations = 0;
  }
  (data.numRegenerations as int) += 1;

  if (data.numRegenerations === MAX_REGENERATIONS) {
    npc.Kill();
    log("Manually killed a Globin to prevent a softlock.");
  }
}
