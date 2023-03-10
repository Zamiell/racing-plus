import { ChampionColor } from "isaac-typescript-definitions";
import { game } from "isaacscript-common";
import { logFastClear, v } from "./v";

// ModCallback.POST_ENTITY_REMOVE (67)
export function trackingRemovePostEntityRemove(entity: Entity): void {
  const npc = entity.ToNPC();
  if (npc === undefined) {
    return;
  }

  // We cannot completely rely on the `POST_ENTITY_KILL` callback because it is not fired for
  // certain NPCs (like when Daddy Long Legs does a stomp attack or a Portal despawns).
  fastClearCheckRemove(npc, false, "POST_ENTITY_REMOVE");
}

// ModCallback.POST_ENTITY_KILL (68)
export function trackingRemovePostEntityKill(entity: Entity): void {
  const npc = entity.ToNPC();
  if (npc === undefined) {
    return;
  }

  fastClearCheckRemove(npc, true, "POST_ENTITY_KILL");
}

export function fastClearCheckRemove(
  npc: EntityNPC,
  callbackIsPostEntityKill: boolean,
  parentCallback: string,
): void {
  // We only care about entities that are in the `aliveEnemies` set.
  const ptrHash = GetPtrHash(npc);
  if (!v.room.aliveEnemies.has(ptrHash)) {
    return;
  }

  // The `POST_ENTITY_KILL` callback will be triggered when a Dark Red champion changes to a flesh
  // pile. This does not count as a real death (and the NPC should not be removed), so we need to
  // handle this.
  // - We cannot check for the sprite file name being equal to "gfx/024.000_Globin.anm2"`, since
  //   that that will not work for champion Gapers & Globins.
  // - We cannot check to see if the sprite is playing the "ReGenChamp" animation, since that will
  //   only be updated on the next frame.
  const championColor = npc.GetChampionColorIdx();
  if (championColor === ChampionColor.DARK_RED && callbackIsPostEntityKill) {
    // We do not want to open the doors yet until the flesh pile is actually removed in the
    // PostEntityRemove callback.
    return;
  }

  remove(npc, ptrHash, parentCallback);
}

function remove(npc: EntityNPC, ptrHash: PtrHash, parentCallback: string) {
  const gameFrameCount = game.GetFrameCount();

  v.room.aliveEnemies.delete(ptrHash);
  v.room.aliveBosses.delete(ptrHash);
  logFastClear(false, npc, ptrHash, parentCallback);

  // If this was the last NPC in the room that died, we want to delay a frame before opening the
  // doors to give time for splitting enemies to spawn their children.
  v.room.delayClearUntilGameFrame = gameFrameCount + 1;

  // Next, we check on every frame to see if the `aliveEnemies` set is empty in the `POST_UPDATE`
  // callback.
}
