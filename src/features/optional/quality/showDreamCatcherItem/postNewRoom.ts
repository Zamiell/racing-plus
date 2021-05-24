import g from "../../../../globals";
import {
  changeRoom,
  getPlayers,
  getRoomIndex,
  initGlowingItemSprite,
  initSprite,
} from "../../../../misc";
import { PickupPriceCustom } from "../../../../types/enums";
import { bossPNGMap } from "./bossPNGMap";
import { WarpState } from "./enums";

export function main(): void {
  if (!g.config.showDreamCatcherItem) {
    return;
  }

  revertItemPrices(); // This must be before the "warp()" function
  warp();
  setItemSprites();
}

// When we initially visited the room, we set the prices of the items to an arbitrary value
// Now that we have arrived in the room for real, reset the prices back to the way that they are
// supposed to be
function revertItemPrices() {
  const collectibles = Isaac.FindByType(
    EntityType.ENTITY_PICKUP,
    PickupVariant.PICKUP_COLLECTIBLE,
    -1,
    false,
    false,
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

function warp() {
  const startingRoomIndex = g.l.GetStartingRoomIndex();

  if (!shouldWarpToTreasureRoom()) {
    return;
  }

  const treasureRoomIndex = getTreasureRoomIndex();
  if (treasureRoomIndex === null) {
    // This floor does not have a Treasure Room, so we don't need to do anything further
    g.run.level.dreamCatcher.warpState = WarpState.FINISHED;
    return;
  }

  g.run.level.dreamCatcher.warpState = WarpState.WARPING;
  saveMinimapDisplayFlags();
  changeRoom(treasureRoomIndex);
  g.run.level.dreamCatcher.items = getRoomItemsAndSetPrice();
  changeRoom(startingRoomIndex);
  resetTreasureRoomState();
  restoreMinimapDisplayFlags();
  // g.run.level.dreamCatcher.bosses.push(EntityType.ENTITY_MONSTRO);

  // We cannot reposition the player in the PostNewRoom callback for some reason,
  // so mark to do it on the next render frame
  g.run.level.dreamCatcher.warpState = WarpState.REPOSITIONING_PLAYER;
}

function shouldWarpToTreasureRoom() {
  const startingRoomIndex = g.l.GetStartingRoomIndex();
  const isFirstVisit = g.r.IsFirstVisit();
  const roomIndex = getRoomIndex();

  let someoneHasDreamCatcher = false;
  for (const player of getPlayers()) {
    if (player.HasCollectible(CollectibleType.COLLECTIBLE_DREAM_CATCHER)) {
      someoneHasDreamCatcher = true;
      break;
    }
  }

  return (
    someoneHasDreamCatcher &&
    g.run.level.dreamCatcher.warpState === WarpState.INITIAL &&
    // Disable this feature in Greed Mode, since that is outside of the scope of normal speedruns
    !g.g.IsGreedMode() &&
    roomIndex === startingRoomIndex &&
    isFirstVisit
  );
}

function saveMinimapDisplayFlags() {
  const rooms = g.l.GetRooms();
  for (let i = 0; i < rooms.Size; i++) {
    const room = rooms.Get(i);
    if (room !== null) {
      g.run.level.dreamCatcher.displayFlagsMap.set(
        room.SafeGridIndex,
        room.DisplayFlags,
      );
    }
  }
}

function getTreasureRoomIndex() {
  const rooms = g.l.GetRooms();
  for (let i = 0; i < rooms.Size; i++) {
    const room = rooms.Get(i);
    if (room !== null && room.Data.Type === RoomType.ROOM_TREASURE) {
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
    -1,
    false,
    false,
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

function resetTreasureRoomState() {
  const treasureRoomIndex = getTreasureRoomIndex();
  if (treasureRoomIndex !== null) {
    const room = g.l.GetRoomByIdx(treasureRoomIndex);
    room.VisitedCount = 0;
    room.Clear = false;
    room.ClearCount = 0;
  }
}

function restoreMinimapDisplayFlags() {
  for (const [gridIndex, displayFlags] of pairs(
    g.run.level.dreamCatcher.displayFlagsMap,
  )) {
    const room = g.l.GetRoomByIdx(gridIndex);
    room.DisplayFlags = displayFlags;
  }
  g.l.UpdateVisibility(); // Setting the display flag will not actually update the map
}

function setItemSprites() {
  if (!shouldShowSprites()) {
    g.run.level.dreamCatcher.dreamCatcherSprite = null;
    g.run.level.dreamCatcher.itemSprites = [];
    g.run.level.dreamCatcher.bossSprites = [];
    return;
  }

  g.run.level.dreamCatcher.dreamCatcherSprite = initGlowingItemSprite(
    CollectibleType.COLLECTIBLE_DREAM_CATCHER,
  );

  for (let i = 0; i < g.run.level.dreamCatcher.items.length; i++) {
    if (g.run.level.dreamCatcher.itemSprites[i] === null) {
      const collectibleType = g.run.level.dreamCatcher.items[i];
      g.run.level.dreamCatcher.itemSprites[i] =
        initGlowingItemSprite(collectibleType);
    }
  }

  for (let i = 0; i < g.run.level.dreamCatcher.bosses.length; i++) {
    if (g.run.level.dreamCatcher.bossSprites[i] === null) {
      const [entityType, variant] = g.run.level.dreamCatcher.bosses[i];
      g.run.level.dreamCatcher.bossSprites[i] = initBossSprite(
        entityType,
        variant,
      );
    }
  }
}

// Only show the sprites in the starting room
function shouldShowSprites() {
  const startingRoomIndex = g.l.GetStartingRoomIndex();
  const roomIndex = getRoomIndex();
  return (
    g.run.level.dreamCatcher.items.length > 0 &&
    roomIndex === startingRoomIndex &&
    // Disable this feature in Greed Mode, since that is outside of the scope of normal speedruns
    !g.g.IsGreedMode()
  );
}

function initBossSprite(entityType: EntityType, variant: int) {
  const pngArray = bossPNGMap.get(entityType);
  if (pngArray === undefined) {
    error(`Failed to find the boss of ${entityType} in the boss PNG map.`);
  }
  const png = pngArray[variant];
  return initSprite("gfx/boss.anm2", png);
}
