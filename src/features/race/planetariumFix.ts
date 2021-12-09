// Planetariums have a greater chance of occurring if a Treasure Room is skipped,
// which can cause a divergence in seeded races
// In order to mitigate this, we force all players to visit every Treasure Room in seeded races
// The code in this file is mostly copied from the custom Dream Catcher implementation

import {
  anyPlayerHasCollectible,
  anyPlayerIs,
  changeRoom,
  getCollectibles,
  getDoors,
  getEffectiveStage,
  getEffects,
  getPlayers,
  getRoomGridIndexesForType,
  getRooms,
  getRoomSafeGridIndex,
  lockDoor,
  log,
} from "isaacscript-common";
import g from "../../globals";
import { DreamCatcherWarpState } from "../../types/DreamCatcherWarpState";
import { EffectVariantCustom, PickupPriceCustom } from "../../types/enums";
import { centerPlayers } from "../mandatory/centerStart";
import { RaceFormat } from "./types/RaceFormat";
import { RacerStatus } from "./types/RacerStatus";
import { RaceStatus } from "./types/RaceStatus";
import v from "./v";

const STAIRWAY_GRID_INDEX = 25;
const TAINTED_KEEPER_ITEM_PRICE = 15;

// ModCallbacks.MC_POST_RENDER (2)
export function postRender(): void {
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
  const customPitfalls = getEffects(EffectVariantCustom.PITFALL_CUSTOM);
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

function warp() {
  const startingRoomGridIndex = g.l.GetStartingRoomIndex();

  if (!shouldWarp()) {
    return;
  }

  v.level.planetariumFixWarpState = DreamCatcherWarpState.WARPING;
  log("Warping to the Treasure Room (for the Planetarium Fix).");
  const displayFlagsMap = getMinimapDisplayFlagsMap();

  const treasureRoomGridIndexes = getRoomGridIndexesForType(
    RoomType.ROOM_TREASURE,
  );

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

  for (const treasureRoomGridIndex of treasureRoomGridIndexes) {
    changeRoom(treasureRoomGridIndex);
    setItemPrices();
  }

  changeRoom(startingRoomGridIndex);

  for (const treasureRoomGridIndex of treasureRoomGridIndexes) {
    resetRoomState(treasureRoomGridIndex);
  }

  restoreMinimapDisplayFlags(displayFlagsMap);

  // If the Treasure room was attached to the starting room, the door will now be open
  // Manually close it
  for (const treasureRoomDoor of getDoors(RoomType.ROOM_TREASURE)) {
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
  v.level.planetariumFixWarpState = DreamCatcherWarpState.REPOSITIONING_PLAYER;
}

function shouldWarp() {
  const startingRoomGridIndex = g.l.GetStartingRoomIndex();
  const isFirstVisit = g.r.IsFirstVisit();
  const roomSafeGridIndex = getRoomSafeGridIndex();

  return (
    v.level.planetariumFixWarpState === DreamCatcherWarpState.INITIAL &&
    roomSafeGridIndex === startingRoomGridIndex &&
    isFirstVisit
  );
}

function getMinimapDisplayFlagsMap() {
  const displayFlags = new Map<int, int>();
  for (const roomDesc of getRooms()) {
    displayFlags.set(roomDesc.SafeGridIndex, roomDesc.DisplayFlags);
  }

  return displayFlags;
}

function setItemPrices() {
  for (const collectible of getCollectibles()) {
    // Now that we have been in the room, the gold star that represents a pedestal item will show up
    // on the minimap for this room
    // We can get around this by giving a price to the item, because unpurchased items do not cause
    // the minimap to display this star
    // We can set the price to any arbitrary value
    collectible.Price = PickupPriceCustom.PRICE_NO_MINIMAP;
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
