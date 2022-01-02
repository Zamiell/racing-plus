// This is a utility feature to visit any arbitrary room upon getting to a new floor
// (some mod features need to visit rooms upon getting to a floor for the first time)

import {
  anyPlayerHasCollectible,
  anyPlayerIs,
  arrayCopy,
  arrayInArray,
  changeRoom,
  getBosses,
  getCollectibles,
  getDoors,
  getEffectiveStage,
  getEffects,
  getPlayers,
  getRoomGridIndexesForType,
  getRooms,
  getRoomSafeGridIndex,
  lockDoor,
  saveDataManager,
} from "isaacscript-common";
import g from "../../globals";
import { EffectVariantCustom } from "../../types/EffectVariantCustom";
import { PickupPriceCustom } from "../../types/PickupPriceCustom";
import { RoomVisitorWarpState } from "../../types/RoomVisitorWarpState";
import { shouldCheckForDreamCatcherThings } from "../optional/quality/showDreamCatcherItem/v";
import { shouldApplyPlanetariumFix } from "../race/planetariumFix";
import { centerPlayers } from "./centerStart";
import { shouldRemoveEndGamePortals } from "./nerfCardReading";

const STAIRWAY_GRID_INDEX = 25;
const TAINTED_KEEPER_ITEM_PRICE = 15;

const v = {
  level: {
    warpState: RoomVisitorWarpState.INITIAL,

    collectibles: [] as CollectibleType[],

    /** Bosses are stored as an array of: [entityType, variant] */
    bosses: [] as Array<[int, int]>,
  },
};

export function init(): void {
  saveDataManager("roomVisiter", v);
}

// ModCallbacks.MC_POST_RENDER (2)
export function postRender(): void {
  repositionPlayer();
}

function repositionPlayer() {
  if (v.level.warpState !== RoomVisitorWarpState.REPOSITIONING_PLAYER) {
    return;
  }

  v.level.warpState = RoomVisitorWarpState.FINISHED;

  centerPlayers();

  // Fix the bug where the fast-travel pitfalls will be misaligned due to being spawned before the
  // player's position was updated
  const players = getPlayers();
  const customPitfalls = getEffects(EffectVariantCustom.PITFALL_CUSTOM);
  for (let i = 0; i < customPitfalls.length; i++) {
    const pitfall = customPitfalls[i];
    const player = players[i];
    if (pitfall !== undefined && player !== undefined) {
      pitfall.Position = player.Position;
    }
  }
}

// ModCallbacks.MC_POST_NEW_ROOM (19)
export function postNewRoom(): void {
  revertItemPrices();
  checkWarp();
}

// If we warped to a room that had collectibles in it, we set their prices to an arbitrary value
// If we are entering that room now for real, reset the prices back to the way that they are
// supposed to be
function revertItemPrices() {
  const originalPrice = anyPlayerIs(PlayerType.PLAYER_KEEPER_B)
    ? TAINTED_KEEPER_ITEM_PRICE
    : 0;

  for (const collectible of getCollectibles()) {
    if (collectible.Price === PickupPriceCustom.PRICE_NO_MINIMAP) {
      collectible.Price = originalPrice;
    }
  }
}

function checkWarp() {
  const isGreedMode = g.g.IsGreedMode();
  const onTheAscent = g.g.GetStateFlag(GameStateFlag.STATE_BACKWARDS_PATH);
  const startingRoomGridIndex = g.l.GetStartingRoomIndex();
  const isFirstVisit = g.r.IsFirstVisit();
  const roomSafeGridIndex = getRoomSafeGridIndex();
  const effectiveStage = getEffectiveStage();

  // We only need to visit rooms upon reaching a new floor for the first time
  if (
    roomSafeGridIndex !== startingRoomGridIndex ||
    !isFirstVisit ||
    effectiveStage === 1
  ) {
    return;
  }

  // Disable this feature in Greed Mode, since that is outside of the scope of normal speedruns
  if (isGreedMode) {
    return;
  }

  // Disable this feature on the Ascent, since that is outside of the scope of normal speedruns
  if (onTheAscent) {
    return;
  }

  const roomsTypesToVisit = new Set<RoomType>();

  if (shouldApplyPlanetariumFix()) {
    roomsTypesToVisit.add(RoomType.ROOM_TREASURE);
    roomsTypesToVisit.add(RoomType.ROOM_PLANETARIUM);
  }

  if (shouldCheckForDreamCatcherThings()) {
    roomsTypesToVisit.add(RoomType.ROOM_TREASURE);
    roomsTypesToVisit.add(RoomType.ROOM_BOSS);
  }

  if (roomsTypesToVisit.size === 0) {
    return;
  }

  warp(roomsTypesToVisit);
}

function warp(roomsTypesToVisit: Set<RoomType>) {
  const startingRoomGridIndex = g.l.GetStartingRoomIndex();

  v.level.warpState = RoomVisitorWarpState.WARPING;
  const displayFlagsMap = getMinimapDisplayFlagsMap();

  // Once we warp away, any Card Reading portals will be destroyed, so record what they are
  const cardReadingPortalDescriptions: Array<[int, Vector]> = [];
  const cardReadingPortals = getEffects(EffectVariant.PORTAL_TELEPORT);
  for (const cardReadingPortal of cardReadingPortals) {
    const tuple: [int, Vector] = [
      cardReadingPortal.SubType,
      cardReadingPortal.Position,
    ];
    cardReadingPortalDescriptions.push(tuple);
  }

  const roomGridIndexes: int[] = [];
  for (const roomType of roomsTypesToVisit.values()) {
    const roomGridIndexesForThisRoomType = getRoomGridIndexesForType(roomType);
    for (const gridIndex of roomGridIndexesForThisRoomType) {
      roomGridIndexes.push(gridIndex);
    }
  }

  if (roomGridIndexes.length === 0) {
    return;
  }

  for (const gridIndex of roomGridIndexes) {
    changeRoom(gridIndex);
    setCollectiblesToCustomPrices();

    // Store information about certain types of rooms for other mod features to request
    const roomType = g.r.GetType();
    if (roomType === RoomType.ROOM_TREASURE) {
      for (const collectibleType of getRoomCollectibles()) {
        v.level.collectibles.push(collectibleType);
      }
    } else if (roomType === RoomType.ROOM_BOSS) {
      for (const boss of getRoomBosses()) {
        v.level.bosses.push(boss);
      }
    }
  }

  changeRoom(startingRoomGridIndex);

  for (const gridIndex of roomGridIndexes) {
    resetRoomState(gridIndex);
  }

  restoreMinimapDisplayFlags(displayFlagsMap);

  // If a room that is normally locked is was attached to the starting room,
  // the door will now be open; manually close it
  for (const treasureRoomDoor of getDoors(
    RoomType.ROOM_SHOP, // 2
    RoomType.ROOM_TREASURE, // 4
    RoomType.ROOM_LIBRARY, // 12
    RoomType.ROOM_PLANETARIUM, // 24
  )) {
    lockDoor(treasureRoomDoor);
  }

  // If the player has The Stairway, moving away from the room would delete the ladder,
  // so respawn it if necessary
  if (anyPlayerHasCollectible(CollectibleType.COLLECTIBLE_STAIRWAY)) {
    const position = g.r.GetGridPosition(STAIRWAY_GRID_INDEX);
    Isaac.Spawn(
      EntityType.ENTITY_EFFECT,
      EffectVariant.TALL_LADDER,
      LadderSubType.STAIRWAY,
      position,
      Vector.Zero,
      undefined,
    );
  }

  // If the player has Card Reading, moving away from the room would delete the portals,
  // so respawn them if necessary
  if (!shouldRemoveEndGamePortals()) {
    for (const cardReadingPortalDescription of cardReadingPortalDescriptions) {
      const [subType, position] = cardReadingPortalDescription;
      Isaac.Spawn(
        EntityType.ENTITY_EFFECT,
        EffectVariant.PORTAL_TELEPORT,
        subType,
        position,
        Vector.Zero,
        undefined,
      );
    }
  }

  // We cannot reposition the player in the PostNewRoom callback for some reason,
  // so mark to do it on the next render frame
  v.level.warpState = RoomVisitorWarpState.REPOSITIONING_PLAYER;
}

function getMinimapDisplayFlagsMap() {
  const displayFlags = new Map<int, int>();
  for (const roomDesc of getRooms()) {
    displayFlags.set(roomDesc.SafeGridIndex, roomDesc.DisplayFlags);
  }

  return displayFlags;
}

function setCollectiblesToCustomPrices() {
  for (const collectible of getCollectibles()) {
    // Now that we have been in the room, the gold star that represents a pedestal item will show up
    // on the minimap for this room
    // We can get around this by giving a price to the item, because unpurchased items do not cause
    // the minimap to display this star
    // We can set the price to any arbitrary value
    collectible.Price = PickupPriceCustom.PRICE_NO_MINIMAP;
  }
}

function getRoomCollectibles() {
  const collectibleTypes: CollectibleType[] = [];

  for (const collectible of getCollectibles()) {
    collectibleTypes.push(collectible.SubType);
  }

  return collectibleTypes;
}

/** Returns an array of: [entityType, variant] */
function getRoomBosses() {
  const bosses: Array<[int, int]> = [];
  for (const boss of getBosses()) {
    if (!isBossException(boss.Type, boss.Variant)) {
      const bossArray: [int, int] = [boss.Type, boss.Variant];
      if (!arrayInArray(bossArray, bosses)) {
        bosses.push(bossArray);
      }
    }
  }

  return bosses;
}

function isBossException(type: EntityType, variant: int) {
  switch (type) {
    // 45
    case EntityType.ENTITY_MOM: {
      return variant === MomVariant.STOMP;
    }

    // 79
    case EntityType.ENTITY_GEMINI: {
      return (
        variant === GeminiVariant.GEMINI_BABY ||
        variant === GeminiVariant.STEVEN_BABY ||
        variant === GeminiVariant.BLIGHTED_OVUM_BABY ||
        variant === GeminiVariant.UMBILICAL_CORD
      );
    }

    default: {
      return false;
    }
  }
}

function resetRoomState(roomGridIndex: int) {
  const roomDesc = g.l.GetRoomByIdx(roomGridIndex);
  roomDesc.VisitedCount = 0;
  roomDesc.Clear = false;
  roomDesc.ClearCount = 0;
}

function restoreMinimapDisplayFlags(displayFlagsMap: Map<int, int>) {
  for (const [roomGridIndex, displayFlags] of displayFlagsMap.entries()) {
    const roomDesc = g.l.GetRoomByIdx(roomGridIndex);
    roomDesc.DisplayFlags = displayFlags;
  }

  g.l.UpdateVisibility(); // Setting the display flag will not actually update the map
}

export function getVisitedRoomCollectibles(): CollectibleType[] {
  return arrayCopy(v.level.collectibles);
}

export function getVisitedRoomBosses(): Array<[int, int]> {
  return arrayCopy(v.level.bosses);
}
