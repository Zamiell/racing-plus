import { log } from "isaacscript-common";
import g from "../../../../globals";
import { FAST_CLEAR_DEBUG } from "./constants";
import v from "./v";

// ModCallbacks.MC_POST_ENTITY_REMOVE (67)
export function postEntityRemove(entity: Entity): void {
  const npc = entity.ToNPC();
  if (npc === undefined) {
    return;
  }

  // We cannot completely rely on the PostEntityKill callback because it is not fired for certain
  // NPCs (like when Daddy Long Legs does a stomp attack or a Portal despawns)
  checkRemove(npc, false);
}

// ModCallbacks.MC_POST_ENTITY_KILL (68)
export function postEntityKill(entity: Entity): void {
  const npc = entity.ToNPC();
  if (npc === undefined) {
    return;
  }

  checkRemove(npc, true);
}

export function checkRemove(
  npc: EntityNPC,
  callbackIsPostEntityKill: boolean,
): void {
  // We only care about entities that are in the "aliveEnemies" table
  const ptrHash = GetPtrHash(npc);
  if (!v.room.aliveEnemies.has(ptrHash)) {
    return;
  }

  // The PostEntityKill callback will be triggered when a Dark Red champion changes to a flesh pile
  // This does not count as a real death (and the NPC should not be removed),
  // so we need to handle this
  // We cannot check for "npc.GetSprite().GetFilename() === "gfx/024.000_Globin.anm2"",
  // because that will not work for champion Gapers & Globins
  // We cannot check for "npc.GetSprite().IsPlaying("ReGenChamp")",
  // because that will only be updated on the next frame
  const championColor = npc.GetChampionColorIdx();
  if (championColor === ChampionColor.DARK_RED && callbackIsPostEntityKill) {
    // We do not want to open the doors yet until the flesh pile is actually removed in the
    // PostEntityRemove callback
    return;
  }

  remove(npc, ptrHash);
}

function remove(npc: EntityNPC, ptrHash: PtrHash) {
  const gameFrameCount = g.g.GetFrameCount();

  v.room.aliveEnemies.delete(ptrHash);

  // If this was the last NPC in the room that died,
  // we want to delay a frame before opening the doors to give time for splitting enemies to spawn
  // their children
  let frameDelay = 1;
  if (npc.Type === EntityType.ENTITY_COHORT) {
    // It takes between 16 to 22 frames for the first Globin to spawn from a Cohort dying
    frameDelay = 22;
    log(
      `Delaying ${frameDelay} frames due to killing a Cohort on frame: ${gameFrameCount}`,
    );
  }
  v.room.delayClearUntilFrame = gameFrameCount + frameDelay;

  // Next, we check on every frame to see if the "aliveEnemies" set is empty in the PostUpdate
  // callback

  if (FAST_CLEAR_DEBUG) {
    log(
      `Removed NPC to track on frame ${gameFrameCount}: ${npc.Type}.${npc.Variant}.${npc.SubType} - ${ptrHash}`,
    );
    log(
      `Total NPCs tracked on frame ${gameFrameCount}: ${v.room.aliveEnemies.size}`,
    );
  }
}
