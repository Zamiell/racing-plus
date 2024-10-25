import {
  EntityType,
  ModCallback,
  NPCState,
} from "isaac-typescript-definitions";
import { Callback, DefaultMap } from "isaacscript-common";
import type { Config } from "../../../Config";
import { ConfigurableModFeature } from "../../../ConfigurableModFeature";

const MAX_REGENERATIONS = 4;

const v = {
  room: {
    numGlobinRegenerations: new DefaultMap<PtrHash, int>(0),
    globinStates: new Map<PtrHash, NPCState>(),
  },
};

export class GlobinSoftlock extends ConfigurableModFeature {
  configKey: keyof Config = "GlobinSoftlock";
  v = v;

  // 0, 24
  @Callback(ModCallback.POST_NPC_UPDATE, EntityType.GLOBIN)
  postNPCUpdateGlobin(npc: EntityNPC): void {
    this.checkGlobinStateTransition(npc);
  }

  checkGlobinStateTransition(npc: EntityNPC): void {
    const ptrHash = GetPtrHash(npc);
    const lastState = v.room.globinStates.get(ptrHash);

    // Globins are always in `NPCState.MOVE` (when chasing) or `NPCState.IDLE` (when dead).
    if (npc.State === lastState) {
      return;
    }
    v.room.globinStates.set(ptrHash, npc.State);

    if (npc.State === NPCState.IDLE) {
      this.globinTransitionedToFleshPile(npc, ptrHash);
    }
  }

  globinTransitionedToFleshPile(npc: EntityNPC, ptrHash: PtrHash): void {
    const numOldGlobinRegenerations =
      v.room.numGlobinRegenerations.getAndSetDefault(ptrHash);
    const numNewGlobinRegenerations = numOldGlobinRegenerations + 1;
    v.room.numGlobinRegenerations.set(ptrHash, numNewGlobinRegenerations);

    if (numNewGlobinRegenerations === MAX_REGENERATIONS) {
      npc.Kill();
    }
  }
}
