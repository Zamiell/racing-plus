import {
  Challenge,
  CollectibleType,
  TrinketType,
} from "isaac-typescript-definitions";
import {
  getCollectibleInitCharge,
  getCollectibleMaxCharges,
} from "isaacscript-common";
import * as racingPlusSprite from "./features/mandatory/racingPlusSprite";
import { COLLECTIBLE_PLACEHOLDER_REVERSE_MAP } from "./features/optional/gameplay/extraStartingItems/constants";
import { shouldConsistentDevilAngelRoomsApply } from "./features/race/consistentDevilAngelRooms";
import g from "./globals";

export function getEffectiveDevilDeals(): int {
  const devilRoomDeals = g.g.GetDevilRoomDeals();

  // In seeded races, we arbitrarily increase the Devil Room deals counter by one, so account for
  // this.
  return shouldConsistentDevilAngelRoomsApply()
    ? devilRoomDeals - 1
    : devilRoomDeals;
}

export function giveCollectibleAndRemoveFromPools(
  player: EntityPlayer,
  collectibleType: CollectibleType,
): void {
  const initCharges = getCollectibleInitCharge(collectibleType);
  const maxCharges = getCollectibleMaxCharges(collectibleType);
  const charges = initCharges === -1 ? maxCharges : initCharges;

  player.AddCollectible(collectibleType, charges);
  g.itemPool.RemoveCollectible(collectibleType);

  const placeholderCollectible =
    COLLECTIBLE_PLACEHOLDER_REVERSE_MAP.get(collectibleType);
  if (placeholderCollectible !== undefined) {
    g.itemPool.RemoveCollectible(placeholderCollectible);
  }
}

export function giveTrinketAndRemoveFromPools(
  player: EntityPlayer,
  trinketType: TrinketType,
): void {
  player.AddTrinket(trinketType);
  g.itemPool.RemoveTrinket(trinketType);
}

/**
 * Don't check for inputs when:
 * - the game is paused
 * - the console is open
 * - Mod Config Menu is open
 */
export function shouldCheckForGameplayInputs(): boolean {
  const isPaused = g.g.IsPaused();
  return !isPaused && (ModConfigMenu === undefined || !ModConfigMenu.IsVisible);
}

export function unseed(): void {
  // Invoking the `Seeds.Reset` method will cause the log to be spammed with: "[ASSERT] - Error:
  // Game Start Seed was not set."

  // It will also cause the `Seeds.GetStartSeed` method to return 0, which can cause crashes. So, we
  // must immediately re-initialize the game start seed by using the `Seeds.Restart` method.
  g.seeds.Reset();
  g.seeds.Restart(Challenge.NULL);

  // Using the `Seeds.Reset` method will also remove any Easter Eggs that have been enabled, so we
  // must manually reactivate them.
  racingPlusSprite.disableAchievements();
}
