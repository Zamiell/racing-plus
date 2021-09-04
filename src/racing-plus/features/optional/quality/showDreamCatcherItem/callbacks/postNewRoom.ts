import {
  anyPlayerHasCollectible,
  arrayInArray,
  changeRoom,
  getBosses,
  getRoomIndex,
} from "isaacscript-common";
import g from "../../../../../globals";
import { config } from "../../../../../modConfigMenu";
import DreamCatcherWarpState from "../../../../../types/DreamCatcherWarpState";
import { PickupPriceCustom } from "../../../../../types/enums";
import * as sprites from "../sprites";
import v from "../v";

const STAIRWAY_GRID_INDEX = 25;

export default function showDreamCatcherItemPostNewRoom(): void {
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
  const collectibles = Isaac.FindByType(
    EntityType.ENTITY_PICKUP,
    PickupVariant.PICKUP_COLLECTIBLE,
  );
  for (const entity of collectibles) {
    const pickup = entity.ToPickup();
    if (
      pickup !== null &&
      pickup.Price === PickupPriceCustom.PRICE_NO_MINIMAP
    ) {
      pickup.Price = 0;
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

  const treasureRoomIndex = getRoomIndexForType(RoomType.ROOM_TREASURE);
  let bossRoomIndex: int | null = null;
  if (stage !== 6 && stage <= 7) {
    // We don't need to show what the boss is for floors that always have the same boss
    bossRoomIndex = getRoomIndexForType(RoomType.ROOM_BOSS);
  }

  if (treasureRoomIndex !== null) {
    changeRoom(treasureRoomIndex);
    v.level.items = getRoomItemsAndSetPrice();
  }

  if (bossRoomIndex !== null) {
    changeRoom(bossRoomIndex);
    v.level.bosses = getRoomBosses();
  }

  changeRoom(startingRoomIndex);

  if (treasureRoomIndex !== null) {
    resetRoomState(treasureRoomIndex);
  }

  if (bossRoomIndex !== null) {
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
      null,
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
    if (room !== null) {
      displayFlags.set(room.SafeGridIndex, room.DisplayFlags);
    }
  }

  return displayFlags;
}

function getRoomIndexForType(roomType: RoomType) {
  const rooms = g.l.GetRooms();
  for (let i = 0; i < rooms.Size; i++) {
    const room = rooms.Get(i);
    if (room !== null && room.Data !== null && room.Data.Type === roomType) {
      return room.SafeGridIndex;
    }
  }

  return null;
}

function getRoomItemsAndSetPrice() {
  const collectibleTypes: CollectibleType[] = [];
  const collectibles = Isaac.FindByType(
    EntityType.ENTITY_PICKUP,
    PickupVariant.PICKUP_COLLECTIBLE,
  );
  for (const entity of collectibles) {
    collectibleTypes.push(entity.SubType);

    // Now that we have been in the room, the gold star that represents a pedestal item will show up
    // on the minimap for this room
    // We can get around this by giving a price to the item, because unpurchased items do not cause
    // the minimap to display this star
    // We can set the price to any arbitrary value
    const pickup = entity.ToPickup();
    if (pickup !== null) {
      pickup.Price = PickupPriceCustom.PRICE_NO_MINIMAP;
    }
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
  for (const [gridIndex, displayFlags] of displayFlagsMap) {
    const room = g.l.GetRoomByIdx(gridIndex);
    room.DisplayFlags = displayFlags;
  }
  g.l.UpdateVisibility(); // Setting the display flag will not actually update the map
}
