import { log } from "isaacscript-common";
import { config } from "../../../modConfigMenu";

const MAX_REGENERATIONS = 4;

const v = {
  room: {
    numGlobinRegenerations: new Map<PtrHash, int>(),
    globinStates: new Map<PtrHash, NpcState>(),
  },
};

// ModCallbacks.MC_NPC_UPDATE (0)
// EntityType.ENTITY_GLOBIN (24)
export function postNPCUpdateGlobin(npc: EntityNPC): void {
  if (!config.globinSoftlock) {
    return;
  }

  checkGlobinStateTransition(npc);
}

function checkGlobinStateTransition(npc: EntityNPC) {
  const ptrHash = GetPtrHash(npc);
  const lastState = v.room.globinStates.get(ptrHash);

  // Globins are always in NpcState.STATE_MOVE (when chasing) or NpcState.STATE_IDLE (when dead)
  if (npc.State === lastState) {
    return;
  }
  v.room.globinStates.set(ptrHash, npc.State);

  if (npc.State === NpcState.STATE_IDLE) {
    globinTransitionedToFleshPile(npc, ptrHash);
  }
}

function globinTransitionedToFleshPile(npc: EntityNPC, ptrHash: PtrHash) {
  let numGlobinRegenerations = v.room.numGlobinRegenerations.get(ptrHash);
  if (numGlobinRegenerations === undefined) {
    numGlobinRegenerations = 0;
  }

  numGlobinRegenerations += 1;
  v.room.numGlobinRegenerations.set(ptrHash, numGlobinRegenerations);

  if (numGlobinRegenerations === MAX_REGENERATIONS) {
    npc.Kill();
    log("Manually killed a Globin to prevent a softlock.");
  }
}
