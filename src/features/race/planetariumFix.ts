import {
  anyPlayerHasCollectible,
  anyPlayerIs,
  changeRoom,
  getEffectiveStage,
  getPlayers,
  getRoomIndex,
  getRoomIndexesForType,
} from "isaacscript-common";
import g from "../../globals";
import { DreamCatcherWarpState } from "../../types/DreamCatcherWarpState";
import { EffectVariantCustom, PickupPriceCustom } from "../../types/enums";
import { centerPlayers } from "../mandatory/centerStart";
import { RaceFormat } from "./types/RaceFormat";
import { RacerStatus } from "./types/RacerStatus";
import { RaceStatus } from "./types/RaceStatus";
import v from "./v";

// Planetariums have a greater chance of occurring if a Treasure Room is skipped,
// which can cause a divergence in seeded races
// In order to mitigate this, we force all players to visit every Treasure Room in seeded races
// The code in this file is mostly copied from the custom Dream Catcher implementation

const STAIRWAY_GRID_INDEX = 25;
const TAINTED_KEEPER_ITEM_PRICE = 15;

function shouldApplyPlanetariumFix() {
  return (
    g.race.format === RaceFormat.SEEDED &&
    g.race.status === RaceStatus.IN_PROGRESS &&
    g.race.myStatus === RacerStatus.RACING &&
    getEffectiveStage() > 1 &&
    !anyPlayerHasCollectible(CollectibleType.COLLECTIBLE_DREAM_CATCHER) &&
    !g.g.IsGreedMode() &&
    !g.g.GetStateFlag(GameStateFlag.STATE_BACKWARDS_PATH)
  );
}

// ModCallbacks.MC_POST_RENDER (2)
export function postRender(): void {
  if (!shouldApplyPlanetariumFix()) {
    return;
  }

  repositionPlayer();
}

function repositionPlayer() {
  if (
    v.level.planetariumFixWarpState !==
    DreamCatcherWarpState.REPOSITIONING_PLAYER
  ) {
    return;
  }

  v.level.planetariumFixWarpState = DreamCatcherWarpState.FINISHED;

  centerPlayers();

  // Fix the bug where the fast-travel pitfalls will be misaligned due to being spawned before the
  // player's position was updated
  const players = getPlayers();
  const customPitfalls = Isaac.FindByType(
    EntityType.ENTITY_EFFECT,
    EffectVariantCustom.PITFALL_CUSTOM,
  );
  for (let i = 0; i < customPitfalls.length; i++) {
    const pitfall = customPitfalls[i];
    const player = players[i];

    pitfall.Position = player.Position;
  }
}

// ModCallbacks.MC_POST_NEW_ROOM (19)
export function postNewRoom(): void {
  if (!shouldApplyPlanetariumFix()) {
    return;
  }

  revertItemPrices();
  warp();
}

// When we initially visited the room, we set the prices of the items to an arbitrary value
// Now that we have arrived in the room for real, reset the prices back to the way that they are
// supposed to be
function revertItemPrices() {
  const revertedPrice = anyPlayerIs(PlayerType.PLAYER_KEEPER_B)
    ? TAINTED_KEEPER_ITEM_PRICE
    : 0;

  const collectibles = Isaac.FindByType(
    EntityType.ENTITY_PICKUP,
    PickupVariant.PICKUP_COLLECTIBLE,
  );
  for (const entity of collectibles) {
    const pickup = entity.ToPickup();
    if (
      pickup !== undefined &&
      pickup.Price === PickupPriceCustom.PRICE_NO_MINIMAP
    ) {
      pickup.Price = revertedPrice;
    }
  }
}

function warp() {
  const startingRoomIndex = g.l.GetStartingRoomIndex();

  if (!shouldWarp()) {
    return;
  }

  v.level.planetariumFixWarpState = DreamCatcherWarpState.WARPING;
  const displayFlagsMap = getMinimapDisplayFlagsMap();

  const treasureRoomIndexes = getRoomIndexesForType(RoomType.ROOM_TREASURE);

  for (const treasureRoomIndex of treasureRoomIndexes.values()) {
    changeRoom(treasureRoomIndex);
    setItemPrices();
  }

  changeRoom(startingRoomIndex);

  for (const treasureRoomIndex of treasureRoomIndexes.values()) {
    resetRoomState(treasureRoomIndex);
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

  // We cannot reposition the player in the PostNewRoom callback for some reason,
  // so mark to do it on the next render frame
  v.level.planetariumFixWarpState = DreamCatcherWarpState.REPOSITIONING_PLAYER;
}

function shouldWarp() {
  const startingRoomIndex = g.l.GetStartingRoomIndex();
  const isFirstVisit = g.r.IsFirstVisit();
  const roomIndex = getRoomIndex();

  return (
    v.level.planetariumFixWarpState === DreamCatcherWarpState.INITIAL &&
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

function setItemPrices() {
  const collectibles = Isaac.FindByType(
    EntityType.ENTITY_PICKUP,
    PickupVariant.PICKUP_COLLECTIBLE,
  );
  for (const entity of collectibles) {
    // Now that we have been in the room, the gold star that represents a pedestal item will show up
    // on the minimap for this room
    // We can get around this by giving a price to the item, because unpurchased items do not cause
    // the minimap to display this star
    // We can set the price to any arbitrary value
    const pickup = entity.ToPickup();
    if (pickup !== undefined) {
      pickup.Price = PickupPriceCustom.PRICE_NO_MINIMAP;
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
