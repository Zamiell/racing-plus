import { DingleVariant, NpcState } from "isaac-typescript-definitions";
import {
  asNumber,
  ColorDefault,
  isRaglingDeathPatch,
} from "isaacscript-common";
import { shouldEnableFastClear } from "../shouldEnableFastClear";
import * as trackingAdd from "../trackingAdd";
import * as trackingRemove from "../trackingRemove";

export function main(npc: EntityNPC): void {
  if (!shouldEnableFastClear()) {
    return;
  }

  trackingAdd.postNPCUpdate(npc);
}

// EntityType.DINGLE (261)
export function dingle(npc: EntityNPC): void {
  if (!shouldEnableFastClear()) {
    return;
  }

  // Fix the bug where a Dangle spawned from a Brownie will be faded. We only care about Dangles
  // that are freshly spawned.
  if (
    npc.Variant === asNumber(DingleVariant.DANGLE) &&
    npc.State === NpcState.INIT
  ) {
    npc.SetColor(ColorDefault, 1000, 0, true, true);
  }
}

// EntityType.RAGLING (246)
export function ragling(npc: EntityNPC): void {
  if (!shouldEnableFastClear()) {
    return;
  }

  // Rag Man Raglings do not actually die; they turn into patches on the ground. So, we need to
  // manually keep track of when this happens.
  if (isRaglingDeathPatch(npc)) {
    trackingRemove.checkRemove(npc, false, "MC_NPC_UPDATE_RAGLING");
  }
}

// EntityType.STONEY (302)
export function stoney(npc: EntityNPC): void {
  if (!shouldEnableFastClear()) {
    return;
  }

  // Stonies have a chance to morph from EntityType.FATTY (208), so they will get added to the
  // `aliveEnemies` set before the room is loaded. To correct for this, we constantly remove them
  // from the set.
  trackingRemove.checkRemove(npc, false, "MC_NPC_UPDATE_STONEY");
}
