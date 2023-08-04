import {
  ActiveSlot,
  CacheFlag,
  CardType,
  CollectibleType,
  DisplayFlag,
  ModCallback,
  RoomType,
  UseFlag,
} from "isaac-typescript-definitions";
import type {
  PlayerIndex} from "isaacscript-common";
import {
  Callback,
  CallbackCustom,
  ModCallbackCustom,
  addCollectibleCostume,
  addRoomDisplayFlag,
  anyPlayerHasCollectible,
  game,
  getPlayerFromIndex,
  getPlayerIndex,
  getPlayersWithCollectible,
  getRoomGridIndex,
  getRoomGridIndexesForType,
  inRoomType,
} from "isaacscript-common";
import { CollectibleTypeCustom } from "../../../../enums/CollectibleTypeCustom";
import type { Config } from "../../../Config";
import { ConfigurableModFeature } from "../../../ConfigurableModFeature";

const OLD_COLLECTIBLE_TYPE = CollectibleType.SOL;
const NEW_COLLECTIBLE_TYPE = CollectibleTypeCustom.SOL_CUSTOM;

const v = {
  run: {
    playersSolEffect: new Set<PlayerIndex>(),
  },
};

/**
 * We have to reimplement Sol from scratch so that the Sun card effect will happen at the beginning
 * of a boss' death animation (instead of at the end).
 *
 * For this reason, this feature depends on fast-clear.
 *
 * @see https://bindingofisaacrebirth.fandom.com/wiki/Sol
 */
export class SolCustom extends ConfigurableModFeature {
  configKey: keyof Config = "FastClear";
  v = v;

  // 8, 1 << 0
  @Callback(ModCallback.EVALUATE_CACHE, CacheFlag.DAMAGE)
  evaluateCacheDamage(player: EntityPlayer): void {
    const playerIndex = getPlayerIndex(player);
    if (v.run.playersSolEffect.has(playerIndex)) {
      player.Damage += 3;
    }
  }

  // 8, 1 << 10
  @Callback(ModCallback.EVALUATE_CACHE, CacheFlag.LUCK)
  evaluateCacheLuck(player: EntityPlayer): void {
    const playerIndex = getPlayerIndex(player);
    if (v.run.playersSolEffect.has(playerIndex)) {
      player.Luck++;
    }
  }

  // 70
  @Callback(ModCallback.PRE_SPAWN_CLEAR_AWARD)
  preSpawnClearAward(): boolean | undefined {
    const level = game.GetLevel();

    if (!inRoomType(RoomType.BOSS)) {
      return undefined;
    }

    const solRoomGridIndex = getSolBossRoomGridIndex();
    if (solRoomGridIndex === undefined) {
      return undefined;
    }

    const roomGridIndex = getRoomGridIndex();
    if (roomGridIndex !== solRoomGridIndex) {
      return undefined;
    }

    const players = getPlayersWithCollectible(NEW_COLLECTIBLE_TYPE);
    for (const player of players) {
      // In vanilla, Sol recharges every active item.
      for (const activeSlot of [
        ActiveSlot.PRIMARY,
        ActiveSlot.SECONDARY,
        ActiveSlot.POCKET,
      ]) {
        // In vanilla, Sol will grant a full 12 charges, which is likely a bug. Racing+ will
        // replicate this behavior. Note that Mega Blast has a hardcoded nerf such that when the
        // `EntityPlayer.FullCharge` method is used, it will only grant 3 charges instead of 12.
        // Unfortunately, Mega Mush does not have this hard-coded nerf, so it will be fully charged
        // by Sol.
        player.FullCharge(activeSlot);

        player.UseCard(CardType.SUN, UseFlag.NO_ANIMATION);

        const curses = level.GetCurses();
        level.RemoveCurses(curses);

        const playerIndex = getPlayerIndex(player);
        v.run.playersSolEffect.add(playerIndex);
        evaluateItems(player);
      }
    }

    return undefined;
  }

  @CallbackCustom(ModCallbackCustom.POST_PEFFECT_UPDATE_REORDERED)
  postPEffectUpdateReordered(player: EntityPlayer): void {
    // Automatically replace the vanilla Sol with the custom one.
    if (player.HasCollectible(OLD_COLLECTIBLE_TYPE, true)) {
      player.RemoveCollectible(OLD_COLLECTIBLE_TYPE);
      player.AddCollectible(NEW_COLLECTIBLE_TYPE, 0, false);
      addCollectibleCostume(player, OLD_COLLECTIBLE_TYPE);
    }
  }

  @CallbackCustom(ModCallbackCustom.POST_NEW_LEVEL_REORDERED)
  postNewLevelReordered(): void {
    this.checkRemoveSolBuff();
  }

  checkRemoveSolBuff(): void {
    const playerIndexes = [...v.run.playersSolEffect.values()];
    v.run.playersSolEffect.clear();

    for (const playerIndex of playerIndexes) {
      const player = getPlayerFromIndex(playerIndex);
      if (player !== undefined) {
        evaluateItems(player);
      }
    }
  }

  /**
   * We check to apply the map effect on every room instead of on every new level because the player
   * could save and quit in the middle of a floor.
   */
  @CallbackCustom(ModCallbackCustom.POST_NEW_ROOM_REORDERED)
  postNewRoomReordered(): void {
    this.checkApplySolMapEffect();
  }

  checkApplySolMapEffect(): void {
    if (!anyPlayerHasCollectible(NEW_COLLECTIBLE_TYPE)) {
      return;
    }

    const solBossRoomGridIndex = getSolBossRoomGridIndex();
    if (solBossRoomGridIndex === undefined) {
      return;
    }

    addRoomDisplayFlag(solBossRoomGridIndex, DisplayFlag.SHOW_ICON);
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

function evaluateItems(player: EntityPlayer) {
  player.AddCacheFlags(CacheFlag.DAMAGE);
  player.AddCacheFlags(CacheFlag.LUCK);
  player.EvaluateItems();
}
