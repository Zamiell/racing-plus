import { getDoors, getPlayers, getRoomIndex, log } from "isaacscript-common";
import { BEAST_ROOM_SUB_TYPE } from "./constants";
import { FastTravelState } from "./features/optional/major/fastTravel/enums";
import g from "./globals";
import { CollectibleTypeCustom } from "./types/enums";
import { moveEsauNextToJacob } from "./util";

export function enteredRoomViaTeleport(): boolean {
  const startingRoomIndex = g.l.GetStartingRoomIndex();
  const previousRoomIndex = g.l.GetPreviousRoomIndex();
  const isFirstVisit = g.r.IsFirstVisit();
  const roomIndex = getRoomIndex();
  const justReachedThisFloor = roomIndex === startingRoomIndex && isFirstVisit;
  const cameFromCrawlspace = previousRoomIndex === GridRooms.ROOM_DUNGEON_IDX;

  return (
    g.run.fastTravel.state === FastTravelState.Disabled &&
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

export function getTotalPlayerCollectibles(
  collectibleType: CollectibleType,
): int {
  let numCollectibles = 0;
  for (const player of getPlayers()) {
    numCollectibles += player.GetCollectibleNum(collectibleType);
  }

  return numCollectibles;
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

export function gridToPos(x: int, y: int): Vector {
  x += 1;
  y += 1;

  const gridIndex = y * g.r.GetGridWidth() + x;
  return g.r.GetGridPosition(gridIndex);
}

export function hasPolaroidOrNegative(): [boolean, boolean] {
  let hasPolaroid = false;
  let hasNegative = false;
  for (const player of getPlayers()) {
    // We must use "GetCollectibleNum" instead of "HasCollectible" because the latter will be true
    // if they are holding the Mysterious Paper trinket
    if (player.GetCollectibleNum(CollectibleType.COLLECTIBLE_POLAROID) > 0) {
      hasPolaroid = true;
    }
    if (player.GetCollectibleNum(CollectibleType.COLLECTIBLE_NEGATIVE) > 0) {
      hasNegative = true;
    }
  }

  return [hasPolaroid, hasNegative];
}

export function inCrawlspace(): boolean {
  const roomIndex = getRoomIndex();
  const roomDesc = g.l.GetCurrentRoomDesc();
  const roomData = roomDesc.Data;
  const roomSubType = roomData.Subtype;

  return (
    roomIndex === GridRooms.ROOM_DUNGEON_IDX &&
    roomSubType !== BEAST_ROOM_SUB_TYPE
  );
}

export function isAntibirthStage(): boolean {
  const stageType = g.l.GetStageType();
  return (
    stageType === StageType.STAGETYPE_REPENTANCE ||
    stageType === StageType.STAGETYPE_REPENTANCE_B
  );
}

export function movePlayersAndFamiliars(position: Vector): void {
  const players = getPlayers();
  for (const player of players) {
    player.Position = position;
  }

  moveEsauNextToJacob();

  // Put familiars next to the players
  const familiars = Isaac.FindByType(EntityType.ENTITY_FAMILIAR);
  for (const familiar of familiars) {
    familiar.Position = position;
  }
}

export function playingOnSetSeed(): boolean {
  const customRun = g.seeds.IsCustomRun();
  const challenge = Isaac.GetChallenge();

  return challenge === Challenge.CHALLENGE_NULL && customRun;
}

// eslint-disable-next-line import/no-unused-modules
export function openAllDoors(): void {
  for (const door of getDoors()) {
    // If we try to open a hidden secret room door (or super secret room door),
    // then nothing will happen
    door.Open();
  }
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

  g.run.room.initializedGridEntities.delete(gridIndex);
  g.run.room.fastTravel.trapdoors.delete(gridIndex);
  g.run.room.fastTravel.crawlspaces.delete(gridIndex);
}

export function removeItemFromItemTracker(
  collectibleType: CollectibleType | CollectibleTypeCustom,
): void {
  const itemConfig = g.itemConfig.GetCollectible(collectibleType);
  log(
    `Removing voided collectible ${collectibleType} (${itemConfig.Name}) from player 0 (Player)`,
  );
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

  // Prevent quest items from switching to another item on Tainted Isaac
  const itemConfigItem = g.itemConfig.GetCollectible(collectibleType);
  const isQuestItem = itemConfigItem.HasTags(ItemConfigTag.QUEST);
  if (isQuestItem) {
    g.run.level.stuckItems.set(seed, collectibleType);
  }
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
