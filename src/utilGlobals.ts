import {
  anyPlayerIs,
  getDoors,
  getRoomIndex,
  inCrawlspace,
  isHiddenSecretRoomDoor,
  isQuestItem,
  log,
} from "isaacscript-common";
import { TAINTED_KEEPER_ITEM_PRICE } from "./constants";
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
  const position = g.r.FindFreePickupSpawnPosition(startingPosition);
  const gridEntity = g.r.GetGridEntityFromPos(position);
  if (gridEntity === null) {
    return position;
  }

  // The "FindFreePickupSpawnPosition()" function failed,
  // because the position that it chose overlaps with a grid entity
  const position2 = g.r.FindFreeTilePosition(startingPosition, 0);

  // The results of the "FindFreeTilePosition()" function can overlap with existing entities,
  // so now call "FindFreePickupSpawnPosition()" again to prevent entity overlap
  return g.r.FindFreePickupSpawnPosition(position2);
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
}

export function spawnCollectible(
  collectibleType: CollectibleType | CollectibleTypeCustom,
  position: Vector,
  seed: int,
  options: boolean,
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
    !isQuestItem(collectibleType)
  ) {
    collectible.Price = TAINTED_KEEPER_ITEM_PRICE;
    log(
      `Set an item in an Angel Room to a price of ${collectible.Price} for Tainted Keeper.`,
    );
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
