import { log } from "isaacscript-common";
import {
  ATTACHED_NPCS_TYPE_VARIANT,
  ATTACHED_NPCS_TYPE_VARIANT_SUBTYPE,
  FAST_CLEAR_DEBUG,
} from "./constants";
import { isRaglingDeathPatch } from "./ragling";
import * as trackingRemove from "./trackingRemove";
import v from "./v";

// ModCallbacks.MC_NPC_UPDATE (0)
export function postNPCUpdate(npc: EntityNPC): void {
  // Friendly enemies (from Delirious or Friendly Ball) will be added to the aliveEnemies table
  // because there are no flags set yet in the PostNPCInit callback
  // Thus, we have to wait until they are initialized before we remove them from the table
  if (npc.HasEntityFlags(EntityFlag.FLAG_FRIENDLY)) {
    trackingRemove.checkRemove(npc, false);
    return;
  }

  // In order to keep track of new NPCs,
  // we can't completely rely on the PostNPCInit callback because it is not fired for certain NPCs
  // (like when a Gusher emerges from killing a Gaper)
  checkAdd(npc);
}

// ModCallbacks.MC_POST_NPC_INIT (27)
export function postNPCInit(npc: EntityNPC): void {
  checkAdd(npc);
}

function checkAdd(npc: EntityNPC) {
  // Don't do anything if we are already tracking this NPC
  const ptrHash = GetPtrHash(npc);
  if (v.run.aliveEnemies.has(ptrHash)) {
    return;
  }

  // We don't care if this is a non-battle NPC
  if (!npc.CanShutDoors) {
    return;
  }

  // We don't care if the NPC is already dead
  // (this is needed because we can enter this function from the PostNPCUpdate callback)
  if (npc.IsDead()) {
    return;
  }

  // Rag Man Raglings do not actually die; they turn into patches on the ground
  // So, they will get past the above death check
  if (isRaglingDeathPatch(npc)) {
    return;
  }

  // We don't care if this is a specific child NPC attached to some other NPC
  if (isAttachedNPC(npc)) {
    return;
  }

  add(npc, ptrHash);
}

/**
 * Checks for NPCs that have "CanShutDoors" set to true naturally by the game,
 * but shouldn't actually keep the doors closed.
 */
function isAttachedNPC(npc: EntityNPC) {
  const entityTypeVariant = `${npc.Type}.${npc.Variant}`;
  if (ATTACHED_NPCS_TYPE_VARIANT.has(entityTypeVariant)) {
    return true;
  }

  const entityTypeVariantSubType = `${npc.Type}.${npc.Variant}.${npc.SubType}`;
  if (ATTACHED_NPCS_TYPE_VARIANT_SUBTYPE.has(entityTypeVariantSubType)) {
    return true;
  }

  return false;
}

function add(npc: EntityNPC, ptrHash: PtrHash) {
  v.run.aliveEnemies.add(ptrHash);

  if (FAST_CLEAR_DEBUG) {
    log(
      `Added NPC to track: ${npc.Type}.${npc.Variant}.${npc.SubType} - ${ptrHash}`,
    );
    log(`Total NPCs tracked: ${v.run.aliveEnemies.size}`);
  }
}
