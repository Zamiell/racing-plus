import {
  anyPlayerHasCollectible,
  anyPlayerIs,
  arrayInArray,
  changeRoom,
  getBosses,
  getCollectibles,
  getEffects,
  getRoomIndex,
  getRoomIndexesForType,
} from "isaacscript-common";
import g from "../../../../../globals";
import { config } from "../../../../../modConfigMenu";
import { DreamCatcherWarpState } from "../../../../../types/DreamCatcherWarpState";
import { PickupPriceCustom } from "../../../../../types/enums";
import * as sprites from "../sprites";
import v from "../v";

const STAIRWAY_GRID_INDEX = 25;
const TAINTED_KEEPER_ITEM_PRICE = 15;

export function showDreamCatcherItemPostNewRoom(): void {
  if (!config.showDreamCatcherItem) {
    return;
  }

  revertItemPrices(); // This must be before the "warp()" function
  warp();
  sprites.set();
}

// When we initially visited the room, we set the prices of the items to an arbitrary value
// Now that we have arrived in the room for real, reset the prices back to the way that they are
// supposed to be
function revertItemPrices() {
  const revertedPrice = anyPlayerIs(PlayerType.PLAYER_KEEPER_B)
    ? TAINTED_KEEPER_ITEM_PRICE
    : 0;

  for (const collectible of getCollectibles()) {
    if (collectible.Price === PickupPriceCustom.PRICE_NO_MINIMAP) {
      collectible.Price = revertedPrice;
    }
  }
}

// In order to find out what the Treasure Room item is and what the bosses are,
// we have to warp to the room and look for ourselves
function warp() {
  const stage = g.l.GetStage();
  const startingRoomIndex = g.l.GetStartingRoomIndex();

  if (!shouldWarp()) {
    return;
  }

  v.level.warpState = DreamCatcherWarpState.WARPING;
  const displayFlagsMap = getMinimapDisplayFlagsMap();

  const treasureRoomIndexes = getRoomIndexesForType(RoomType.ROOM_TREASURE);
  let bossRoomIndexes: Set<int> = new Set();
  if (stage !== 6 && stage <= 7) {
    // We don't need to show what the boss is for floors that always have the same boss
    bossRoomIndexes = getRoomIndexesForType(RoomType.ROOM_BOSS);
  }

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

  v.level.items = [];
  for (const treasureRoomIndex of treasureRoomIndexes.values()) {
    changeRoom(treasureRoomIndex);
    const newItems = getRoomItemsAndSetPrice();
    v.level.items = v.level.items.concat(newItems);
  }

  v.level.bosses = [];
  for (const bossRoomIndex of bossRoomIndexes.values()) {
    changeRoom(bossRoomIndex);
    const newBosses = getRoomBosses();
    v.level.bosses = v.level.bosses.concat(newBosses);
  }

  changeRoom(startingRoomIndex);

  for (const treasureRoomIndex of treasureRoomIndexes.values()) {
    resetRoomState(treasureRoomIndex);
  }

  for (const bossRoomIndex of bossRoomIndexes.values()) {
    resetRoomState(bossRoomIndex);
  }

  restoreMinimapDisplayFlags(displayFlagsMap);

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

  // We cannot reposition the player in the PostNewRoom callback for some reason,
  // so mark to do it on the next render frame
  v.level.warpState = DreamCatcherWarpState.REPOSITIONING_PLAYER;
}

function shouldWarp() {
  const startingRoomIndex = g.l.GetStartingRoomIndex();
  const isFirstVisit = g.r.IsFirstVisit();
  const roomIndex = getRoomIndex();

  return (
    anyPlayerHasCollectible(CollectibleType.COLLECTIBLE_DREAM_CATCHER) &&
    v.level.warpState === DreamCatcherWarpState.INITIAL &&
    // Disable this feature in Greed Mode, since that is outside of the scope of normal speedruns
    !g.g.IsGreedMode() &&
    roomIndex === startingRoomIndex &&
    isFirstVisit
  );
}

function getMinimapDisplayFlagsMap() {
  const displayFlags = new Map<int, int>();
  const rooms = g.l.GetRooms();
  for (let i = 0; i < rooms.Size; i++) {
    const room = rooms.Get(i);
    if (room !== undefined) {
      displayFlags.set(room.SafeGridIndex, room.DisplayFlags);
    }
  }

  return displayFlags;
}

function getRoomItemsAndSetPrice() {
  const collectibleTypes: CollectibleType[] = [];
  for (const collectible of getCollectibles()) {
    collectibleTypes.push(collectible.SubType);

    // Now that we have been in the room, the gold star that represents a pedestal item will show up
    // on the minimap for this room
    // We can get around this by giving a price to the item, because unpurchased items do not cause
    // the minimap to display this star
    // We can set the price to any arbitrary value
    collectible.Price = PickupPriceCustom.PRICE_NO_MINIMAP;
  }

  return collectibleTypes;
}

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

function resetRoomState(roomIndex: int) {
  const room = g.l.GetRoomByIdx(roomIndex);
  room.VisitedCount = 0;
  room.Clear = false;
  room.ClearCount = 0;
}

function restoreMinimapDisplayFlags(displayFlagsMap: Map<int, int>) {
  for (const [gridIndex, displayFlags] of displayFlagsMap.entries()) {
    const room = g.l.GetRoomByIdx(gridIndex);
    room.DisplayFlags = displayFlags;
  }
  g.l.UpdateVisibility(); // Setting the display flag will not actually update the map
}
