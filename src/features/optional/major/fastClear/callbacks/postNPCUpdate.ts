import { isRaglingDeathPatch } from "../ragling";
import { shouldEnableFastClear } from "../shouldEnableFastClear";
import * as tracking from "../tracking";

export function main(npc: EntityNPC): void {
  if (!shouldEnableFastClear()) {
    return;
  }

  // Friendly enemies (from Delirious or Friendly Ball) will be added to the aliveEnemies table
  // because there are no flags set yet in the PostNPCInit callback
  // Thus, we have to wait until they are initialized before we remove them from the table
  if (npc.HasEntityFlags(EntityFlag.FLAG_FRIENDLY)) {
    tracking.checkRemove(npc, false);
    return;
  }

  // In order to keep track of new NPCs,
  // we can't completely rely on the PostNPCInit callback because it is not fired for certain NPCs
  // (like when a Gusher emerges from killing a Gaper)
  tracking.checkAdd(npc);
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
    tracking.checkRemove(npc, false);
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
  tracking.checkRemove(npc, false);
}
