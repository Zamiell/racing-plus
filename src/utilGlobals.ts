import {
  getCollectibleInitCharges,
  getCollectibleMaxCharges,
  getRoomIndex,
  inCrawlspace,
} from "isaacscript-common";
import { COLLECTIBLE_PLACEHOLDER_REVERSE_MAP } from "./features/optional/gameplay/extraStartingItems/constants";
import { isFastTravelHappening } from "./features/optional/major/fastTravel/v";
import g from "./globals";
import { CollectibleTypeCustom } from "./types/enums";

export function enteredRoomViaTeleport(): boolean {
  const startingRoomIndex = g.l.GetStartingRoomIndex();
  const previousRoomIndex = g.l.GetPreviousRoomIndex();
  const isFirstVisit = g.r.IsFirstVisit();
  const roomIndex = getRoomIndex();
  const justReachedThisFloor = roomIndex === startingRoomIndex && isFirstVisit;
  const cameFromCrawlspace =
    previousRoomIndex === GridRooms.ROOM_DUNGEON_IDX ||
    previousRoomIndex === GridRooms.ROOM_SECRET_SHOP_IDX;

  return (
    g.l.LeaveDoor === -1 &&
    !justReachedThisFloor &&
    !inCrawlspace() &&
    !cameFromCrawlspace &&
    !isFastTravelHappening()
  );
}

export function giveCollectibleAndRemoveFromPools(
  player: EntityPlayer,
  collectibleType: CollectibleType | CollectibleTypeCustom,
): void {
  const initCharges = getCollectibleInitCharges(collectibleType);
  const maxCharges = getCollectibleMaxCharges(collectibleType);
  const charges = initCharges === -1 ? maxCharges : initCharges;

  player.AddCollectible(collectibleType, charges);
  g.itemPool.RemoveCollectible(collectibleType);

  const placeholderCollectible = COLLECTIBLE_PLACEHOLDER_REVERSE_MAP.get(
    collectibleType as CollectibleType,
  );
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

export function unseed(): void {
  // Invoking the "Reset()" method will cause the log to be spammed with:
  // [ASSERT] - Error: Game Start Seed was not set.
  // It will also cause the "GetStartSeed()" method to return 0, which can cause crashes
  // So we must immediately re-initialize the game start seed by using the "Restart()" method
  g.seeds.Reset();
  g.seeds.Restart(0);
}
