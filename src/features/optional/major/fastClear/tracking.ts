import g from "../../../../globals";
import {
  ATTACHED_NPC_ID_WITHOUT_SUBTYPE,
  ATTACHED_NPC_ID_WITH_SUBTYPE,
} from "./constants";
import { isRaglingDeathPatch } from "./ragling";
import v from "./v";

export function checkAdd(npc: EntityNPC): void {
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

  checkFlushOldRoom();
  add(ptrHash);
}

/**
 * Checks for NPCs that have "CanShutDoors" set to true naturally by the game,
 * but shouldn't actually keep the doors closed.
 */
function isAttachedNPC(npc: EntityNPC) {
  const entityTypeVariant = `${npc.Type}.${npc.Variant}`;
  if (ATTACHED_NPC_ID_WITHOUT_SUBTYPE.has(entityTypeVariant)) {
    return true;
  }

  const entityTypeVariantSubType = `${npc.Type}.${npc.Variant}.${npc.SubType}`;
  if (ATTACHED_NPC_ID_WITH_SUBTYPE.has(entityTypeVariantSubType)) {
    return true;
  }

  return false;
}

function checkFlushOldRoom() {
  const roomFrameCount = g.r.GetFrameCount();

  // If we are entering a new room, flush all of the stuff in the old room
  // We can't use the PostNewRoom callback to handle this since that callback fires after this one
  // roomFrameCount will be at -1 during the initialization phase of the room
  if (roomFrameCount === -1 && !v.run.roomInitializing) {
    v.run.aliveEnemies = new Set();
    v.run.roomInitializing = true;
    v.run.delayClearUntilFrame = null;
  }
}

function add(ptrHash: PtrHash) {
  v.run.aliveEnemies.add(ptrHash);
}

export function checkRemove(
  npc: EntityNPC,
  callbackIsPostEntityKill: boolean,
): void {
  // We only care about entities that are in the "aliveEnemies" table
  const ptrHash = GetPtrHash(npc);
  if (!v.run.aliveEnemies.has(ptrHash)) {
    return;
  }

  // The PostEntityKill callback will be triggered when a Dark Red champion changes to a flesh pile
  // This does not count as a real death (and the NPC should not be removed),
  // so we need to handle this
  // We cannot check for "npc.GetSprite().GetFilename() === "gfx/024.000_Globin.anm2"",
  // because that will not work for champion Gapers & Globins
  // We cannot check for "npc.GetSprite().IsPlaying("ReGenChamp")",
  // because that will only be updated on the next frame
  if (
    npc.GetChampionColorIdx() === ChampionColor.DARK_RED &&
    callbackIsPostEntityKill
  ) {
    // We do not want to open the doors yet until the flesh pile is actually removed in the
    // PostEntityRemove callback
    return;
  }

  remove(ptrHash);
}

function remove(ptrHash: PtrHash) {
  const gameFrameCount = g.g.GetFrameCount();

  v.run.aliveEnemies.delete(ptrHash);

  // If this was the last NPC in the room that died,
  // we want to delay a frame before opening the doors to give time for splitting enemies to spawn
  // their children
  v.run.delayClearUntilFrame = gameFrameCount + 1;

  // We check on every frame to see if the "aliveEnemies" set is empty in the PostUpdate callback
}
