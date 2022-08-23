import {
  CollectibleType,
  LevelStage,
  RoomType,
  TrinketType,
} from "isaac-typescript-definitions";
import {
  getCollectibleInitCharge,
  getCollectibleItemType,
  getCollectibleMaxCharges,
  isRoomInsideGrid,
  newPickingUpItem,
} from "isaacscript-common";
import { COLLECTIBLE_PLACEHOLDER_REVERSE_MAP } from "./features/optional/gameplay/extraStartingItems/constants";
import { automaticItemInsertionPreItemPickup } from "./features/optional/quality/automaticItemInsertion/callbacks/preItemPickup";
import g from "./globals";

export function addCollectibleAndRemoveFromPools(
  player: EntityPlayer,
  collectibleType: CollectibleType,
): void {
  // Before adding the new collectible, pretend like the item is becoming queued so that the
  // automatic item insertion feature works properly.
  const itemType = getCollectibleItemType(collectibleType);
  const pickingUpItem = newPickingUpItem();
  pickingUpItem.itemType = itemType;
  pickingUpItem.subType = collectibleType;
  automaticItemInsertionPreItemPickup(player, pickingUpItem);

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

export function isInClearedMomBossRoom(): boolean {
  const stage = g.l.GetStage();
  const roomType = g.r.GetType();
  const roomClear = g.r.IsClear();
  const roomInsideGrid = isRoomInsideGrid();

  return (
    stage === LevelStage.DEPTHS_2 &&
    roomType === RoomType.BOSS &&
    roomInsideGrid &&
    roomClear
  );
}
