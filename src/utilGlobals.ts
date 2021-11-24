import {
  anyPlayerIs,
  getCollectibleInitCharges,
  getCollectibleMaxCharges,
  getDoors,
  getRoomIndex,
  inCrawlspace,
  isHiddenSecretRoomDoor,
  isQuestCollectible,
} from "isaacscript-common";
import * as preventItemRotate from "./features/mandatory/preventItemRotate";
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

/**
 * If a room had enemies in it that were removed in a PostNewRoom callback, then a room drop will be
 * awarded and the doors will start closed and then open. Manually fix this.
 */
export function setRoomCleared(): void {
  const roomClear = g.r.IsClear();

  // There were no vanilla enemies in the room
  if (roomClear) {
    return;
  }

  g.r.SetClear(true);
  for (const door of getDoors()) {
    if (isHiddenSecretRoomDoor(door)) {
      continue;
    }

    door.State = DoorState.STATE_OPEN;

    const sprite = door.GetSprite();
    sprite.Play("Opened", true);

    // If there was a vanilla Krampus in the room,
    // then the door would be barred in addition to being closed
    // Ensure that the bar is not visible
    door.ExtraVisible = false;
  }
  g.sfx.Stop(SoundEffect.SOUND_DOOR_HEAVY_OPEN);

  // If the room contained Mom's Hands, then a screen shake will be queued
  // Override it with a null shake
  g.g.ShakeScreen(0);
}

export function spawnCollectible(
  collectibleType: CollectibleType | CollectibleTypeCustom,
  position: Vector,
  seed: int,
  options = false,
  forceFreeItem = false,
): EntityPickup {
  if (seed === 0) {
    error(
      "Attempted to spawn a collectible with a seed of 0, which is not allowed. (It will cause the game to crash under certain conditions.)",
    );
  }

  const roomType = g.r.GetType();

  const collectible = g.g
    .Spawn(
      EntityType.ENTITY_PICKUP,
      PickupVariant.PICKUP_COLLECTIBLE,
      position,
      Vector.Zero,
      undefined,
      collectibleType,
      seed,
    )
    .ToPickup();
  if (collectible === undefined) {
    error("Failed to spawn a collectible.");
  }

  if (options) {
    collectible.OptionsPickupIndex = 1;
  }

  // In vanilla, all pedestals have a 20 frame delay before they can be picked up
  // Remove the pedestal delay for the Checkpoint,
  // since players will always want to immediately pick it up
  if (collectibleType === CollectibleTypeCustom.COLLECTIBLE_CHECKPOINT) {
    collectible.Wait = 0;
  }

  if (
    roomType === RoomType.ROOM_ANGEL &&
    anyPlayerIs(PlayerType.PLAYER_KEEPER_B) &&
    !isQuestCollectible(collectibleType) &&
    !forceFreeItem
  ) {
    // When playing Tainted Keeper, collectibles are supposed to have a price,
    // and manually spawned items will not have a price, so we have to set it manually

    // Setting the shop item ID in this way prevents the bug where the item will sometimes change to
    // 99 cents
    collectible.ShopItemId = -1;

    // We can set the price to any arbitrary value;
    // it will auto-update to the true price on the next frame
    collectible.Price = 15;
  }

  preventItemRotate.checkQuestItem(collectible, collectibleType, seed);

  return collectible;
}

export function unseed(): void {
  // Invoking the "Reset()" method will cause the log to be spammed with:
  // [ASSERT] - Error: Game Start Seed was not set.
  // It will also cause the "GetStartSeed()" method to return 0, which can cause crashes
  // So we must immediately re-initialize the game start seed by using the "Restart()" method
  g.seeds.Reset();
  g.seeds.Restart(0);
}
