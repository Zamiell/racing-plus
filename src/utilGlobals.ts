import { getRoomIndex, inCrawlspace } from "isaacscript-common";
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

export function giveItemAndRemoveFromPools(
  player: EntityPlayer,
  collectibleType: CollectibleType | CollectibleTypeCustom,
): void {
  const initCharges = getItemInitCharges(collectibleType);
  const maxCharges = getItemMaxCharges(collectibleType);
  const charges = initCharges === -1 ? maxCharges : initCharges;

  player.AddCollectible(collectibleType, charges);
  g.itemPool.RemoveCollectible(collectibleType);
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

export function spawnCollectible(
  collectibleType: CollectibleType,
  position: Vector,
  seed: int,
  options: boolean,
): void {
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
  if (collectible !== null && options) {
    collectible.OptionsPickupIndex = 1;
  }

  preventItemRotate.checkQuestItem(collectibleType, seed);
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
