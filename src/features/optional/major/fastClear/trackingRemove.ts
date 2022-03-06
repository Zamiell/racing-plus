import { getEntityID, log } from "isaacscript-common";
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
  checkRemove(npc, false, "MC_POST_ENTITY_REMOVE");
}

// ModCallbacks.MC_POST_ENTITY_KILL (68)
export function postEntityKill(entity: Entity): void {
  const npc = entity.ToNPC();
  if (npc === undefined) {
    return;
  }

  checkRemove(npc, true, "MC_POST_ENTITY_KILL");
}

export function checkRemove(
  npc: EntityNPC,
  callbackIsPostEntityKill: boolean,
  parentCallback: string,
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

  remove(npc, ptrHash, parentCallback);
}

function remove(npc: EntityNPC, ptrHash: PtrHash, parentCallback: string) {
  const gameFrameCount = g.g.GetFrameCount();

  v.room.aliveEnemies.delete(ptrHash);

  if (FAST_CLEAR_DEBUG) {
    const entityID = getEntityID(npc);
    log(
      `Removed fast-clear entity to track on game frame ${gameFrameCount}: ${entityID} - ${ptrHash} (${parentCallback})`,
    );
    log(
      `Total fast-clear entities tracked on game frame ${gameFrameCount}: ${v.room.aliveEnemies.size}`,
    );
  }

  // If this was the last NPC in the room that died,
  // we want to delay a frame before opening the doors to give time for splitting enemies to spawn
  // their children
  v.room.delayClearUntilFrame = gameFrameCount + 1;

  // Next, we check on every frame to see if the "aliveEnemies" set is empty in the PostUpdate
  // callback
}
