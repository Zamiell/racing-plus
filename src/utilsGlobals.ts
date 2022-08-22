import { CollectibleType, TrinketType } from "isaac-typescript-definitions";
import {
  getCollectibleInitCharge,
  getCollectibleMaxCharges,
} from "isaacscript-common";
import { COLLECTIBLE_PLACEHOLDER_REVERSE_MAP } from "./features/optional/gameplay/extraStartingItems/constants";
import g from "./globals";

export function addCollectibleAndRemoveFromPools(
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
