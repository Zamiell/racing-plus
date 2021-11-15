import { isRaglingDeathPatch } from "../ragling";
import { shouldEnableFastClear } from "../shouldEnableFastClear";
import * as trackingAdd from "../trackingAdd";
import * as trackingClear from "../trackingClear";
import * as trackingRemove from "../trackingRemove";

export function main(npc: EntityNPC): void {
  if (!shouldEnableFastClear()) {
    return;
  }

  trackingClear.postNPCUpdate();
  trackingAdd.postNPCUpdate(npc);
}

// EntityType.ENTITY_DINGLE (261)
export function dingle(npc: EntityNPC): void {
  if (!shouldEnableFastClear()) {
    return;
  }

  // Fix the bug where a Dangle spawned from a Brownie will be faded
  // We only care about Dangles that are freshly spawned
  if (
    npc.Variant === DingleVariant.DANGLE &&
    npc.State === NpcState.STATE_INIT
  ) {
    npc.SetColor(Color.Default, 1000, 0, true, true);
  }
}

// EntityType.ENTITY_RAGLING (246)
export function ragling(npc: EntityNPC): void {
  if (!shouldEnableFastClear()) {
    return;
  }

  // Rag Man Raglings do not actually die; they turn into patches on the ground
  // So, we need to manually keep track of when this happens
  if (isRaglingDeathPatch(npc)) {
    trackingRemove.checkRemove(npc, false);
  }
}

// EntityType.ENTITY_STONEY (302)
export function stoney(npc: EntityNPC): void {
  if (!shouldEnableFastClear()) {
    return;
  }

  // Stoneys have a chance to morph from EntityType.ENTITY_FATTY (208),
  // so they will get added to the aliveEnemies table before the room is loaded
  // To correct for this, we constantly remove them from the aliveEnemies set
  trackingRemove.checkRemove(npc, false);
}
