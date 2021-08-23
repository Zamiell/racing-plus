import {
  anyEntityCloserThan,
  anyPlayerIs,
  DISTANCE_OF_GRID_TILE,
  getDoors,
  getRoomIndex,
  inCrawlspace,
  isHiddenSecretRoomDoor,
  isQuestItem,
} from "isaacscript-common";
import * as preventItemRotate from "./features/mandatory/preventItemRotate";
import g from "./globals";
import { CollectibleTypeCustom } from "./types/enums";

export function enteredRoomViaTeleport(): boolean {
  const startingRoomIndex = g.l.GetStartingRoomIndex();
  const previousRoomIndex = g.l.GetPreviousRoomIndex();
  const isFirstVisit = g.r.IsFirstVisit();
  const roomIndex = getRoomIndex();
  const justReachedThisFloor = roomIndex === startingRoomIndex && isFirstVisit;
  const cameFromCrawlspace = previousRoomIndex === GridRooms.ROOM_DUNGEON_IDX;

  return (
    g.l.LeaveDoor === -1 &&
    !justReachedThisFloor &&
    !inCrawlspace() &&
    !cameFromCrawlspace
  );
}

export function findFreePosition(startingPosition: Vector): Vector {
  // The "FindFreePickupSpawnPosition()" function will not account for beams of light
  const heavenDoors = Isaac.FindByType(
    EntityType.ENTITY_EFFECT,
    EffectVariant.HEAVEN_LIGHT_DOOR,
  );
  for (let i = 0; i < 100; i++) {
    const position = g.r.FindFreePickupSpawnPosition(startingPosition, i);
    if (!anyEntityCloserThan(heavenDoors, position, DISTANCE_OF_GRID_TILE)) {
      return position;
    }
  }

  // We failed to find a free position in N iterations
  return g.r.FindFreePickupSpawnPosition(startingPosition);
}

function getItemInitCharges(
  collectibleType: CollectibleType | CollectibleTypeCustom,
): int {
  const itemConfigItem = g.itemConfig.GetCollectible(collectibleType);
  if (itemConfigItem === null) {
    return -1; // The default value for this property is -1
  }

  return itemConfigItem.InitCharge;
}

export function getItemMaxCharges(
  collectibleType: CollectibleType | CollectibleTypeCustom,
): int {
  const itemConfigItem = g.itemConfig.GetCollectible(collectibleType);
  if (itemConfigItem === null) {
    return 0;
  }

  return itemConfigItem.MaxCharges;
}

export function giveCollectibleAndRemoveFromPools(
  player: EntityPlayer,
  collectibleType: CollectibleType | CollectibleTypeCustom,
): void {
  const initCharges = getItemInitCharges(collectibleType);
  const maxCharges = getItemMaxCharges(collectibleType);
  const charges = initCharges === -1 ? maxCharges : initCharges;

  player.AddCollectible(collectibleType, charges);
  g.itemPool.RemoveCollectible(collectibleType);
}

export function giveTrinketAndRemoveFromPools(
  player: EntityPlayer,
  trinketType: TrinketType,
): void {
  player.AddTrinket(trinketType);
  g.itemPool.RemoveTrinket(trinketType);
}

export function removeGridEntity(gridEntity: GridEntity): void {
  // In some cases, the grid entity will show on screen for a frame before it is removed
  // (like for the trapdoor spawned after killing It Lives!)
  // We can replace the graphics to fix this
  const sprite = gridEntity.GetSprite();
  sprite.ReplaceSpritesheet(0, "gfx/none.png");
  sprite.LoadGraphics();

  const gridIndex = gridEntity.GetGridIndex();
  g.r.RemoveGridEntity(gridIndex, 0, false); // gridEntity.Destroy() does not work

  // It is best practice to call the "Update()" method after removing a grid entity;
  // otherwise, spawning grid entities on the same tile can fail
  g.r.Update();
}

/**
 * If a room had enemies in it that were removed in a PostGameStarted callback, then a room drop
 * will be awarded and the doors will start closed and then open. Manually fix this.
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
): EntityPickup | null {
  const roomType = g.r.GetType();

  const collectible = g.g
    .Spawn(
      EntityType.ENTITY_PICKUP,
      PickupVariant.PICKUP_COLLECTIBLE,
      position,
      Vector.Zero,
      null,
      collectibleType,
      seed,
    )
    .ToPickup();
  if (collectible === null) {
    return null;
  }

  if (options) {
    collectible.OptionsPickupIndex = 1;
  }

  if (
    roomType === RoomType.ROOM_ANGEL &&
    anyPlayerIs(PlayerType.PLAYER_KEEPER_B) &&
    !isQuestItem(collectibleType) &&
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

  preventItemRotate.checkQuestItem(collectibleType, seed);

  return collectible;
}

export function teleport(
  roomIndex: int,
  direction = Direction.NO_DIRECTION,
  roomTransitionAnim = RoomTransitionAnim.TELEPORT,
): void {
  // This must be set before every StartRoomTransition() invocation or else the function can send
  // you to the wrong room
  g.l.LeaveDoor = -1;

  g.g.StartRoomTransition(roomIndex, direction, roomTransitionAnim);
}
