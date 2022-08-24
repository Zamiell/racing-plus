import {
  ActiveSlot,
  CacheFlag,
  CardType,
  CollectibleType,
  DisplayFlag,
  RoomType,
  UseFlag,
} from "isaac-typescript-definitions";
import {
  addCharge,
  addCollectibleCostume,
  addFlag,
  anyPlayerHasCollectible,
  getPlayerIndex,
  getPlayersWithCollectible,
  getRoomDisplayFlags,
  getRoomGridIndex,
  getRoomGridIndexesForType,
  PlayerIndex,
  removeCollectibleFromItemTracker,
  setRoomDisplayFlags,
} from "isaacscript-common";
import { CollectibleTypeCustom } from "../../enums/CollectibleTypeCustom";
import g from "../../globals";

const OLD_COLLECTIBLE_TYPE = CollectibleType.SOL;
const NEW_COLLECTIBLE_TYPE = CollectibleTypeCustom.SOL_CUSTOM;

const v = {
  level: {
    playersSolEffect: new Set<PlayerIndex>(),
  },
};

// ModCallback.EVALUATE_CACHE (8)
// CacheFlag.DAMAGE (1 << 0)
export function evaluateCacheDamage(player: EntityPlayer): void {
  const playerIndex = getPlayerIndex(player);
  if (v.level.playersSolEffect.has(playerIndex)) {
    player.Damage += 3;
  }
}

// ModCallback.EVALUATE_CACHE (8)
// CacheFlag.LUCK (1 << 10)
export function evaluateCacheLuck(player: EntityPlayer): void {
  const playerIndex = getPlayerIndex(player);
  if (v.level.playersSolEffect.has(playerIndex)) {
    player.Luck++;
  }
}

// ModCallback.POST_PEFFECT_UPDATE (4)
export function postPEffectUpdate(player: EntityPlayer): void {
  // Automatically replace the vanilla flip with the custom one. (This handles Tainted Lazarus
  // correctly, since he is given Flip in the normal active item slot.)
  if (player.HasCollectible(OLD_COLLECTIBLE_TYPE)) {
    player.RemoveCollectible(OLD_COLLECTIBLE_TYPE);
    removeCollectibleFromItemTracker(OLD_COLLECTIBLE_TYPE);
    player.AddCollectible(NEW_COLLECTIBLE_TYPE, 0, false);
    addCollectibleCostume(player, OLD_COLLECTIBLE_TYPE);
  }
}

// ModCallback.POST_NEW_LEVEL (18)
export function postNewLevel(): void {
  checkApplySolMapEffect();
}

function checkApplySolMapEffect() {
  if (!anyPlayerHasCollectible(NEW_COLLECTIBLE_TYPE)) {
    return;
  }

  const solRoomGridIndex = getSolBossRoomGridIndex();
  if (solRoomGridIndex === undefined) {
    return;
  }

  const displayFlags = getRoomDisplayFlags(solRoomGridIndex);
  const displayFlagsWithIcon = addFlag(displayFlags, DisplayFlag.SHOW_ICON);
  setRoomDisplayFlags(solRoomGridIndex, displayFlagsWithIcon);
  g.l.UpdateVisibility();
}

// ModCallbackCustom.POST_ROOM_CLEAR_CHANGED
export function postRoomClearChanged(roomClear: boolean): void {
  if (!roomClear) {
    return;
  }

  const roomType = g.r.GetType();
  if (roomType !== RoomType.BOSS) {
    return;
  }

  const solRoomGridIndex = getSolBossRoomGridIndex();
  if (solRoomGridIndex === undefined) {
    return;
  }

  const roomGridIndex = getRoomGridIndex();
  if (roomGridIndex !== solRoomGridIndex) {
    return;
  }

  const players = getPlayersWithCollectible(NEW_COLLECTIBLE_TYPE);
  for (const player of players) {
    // In vanilla, Sol recharges every active item.
    for (const activeSlot of [
      ActiveSlot.PRIMARY,
      ActiveSlot.SECONDARY,
      ActiveSlot.POCKET,
    ]) {
      // In vanilla, Sol will grant 12 charges, which is likely a bug. Racing+ will replicate this
      // behavior for now.
      addCharge(player, activeSlot, 12);

      player.UseCard(CardType.SUN, UseFlag.NO_ANIMATION);

      const curses = g.l.GetCurses();
      g.l.RemoveCurses(curses);

      const playerIndex = getPlayerIndex(player);
      v.level.playersSolEffect.add(playerIndex);
      player.AddCacheFlags(CacheFlag.DAMAGE);
      player.AddCacheFlags(CacheFlag.LUCK);
      player.EvaluateItems();
    }
  }
}

/**
 * In vanilla, Sol will trigger on the farthest away boss room. This corresponds to the first boss
 * room when iterating over the list indexes.
 */
function getSolBossRoomGridIndex(): int | undefined {
  const bossRoomGridIndexes = getRoomGridIndexesForType(RoomType.BOSS);
  return bossRoomGridIndexes[0];
}
