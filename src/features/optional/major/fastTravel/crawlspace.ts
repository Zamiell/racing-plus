// For testing, a seed with a black market is: 2SB2 M4R6

import { log } from "isaacscript-common";
import g from "../../../../globals";
import {
  getRoomIndex,
  inCrawlspace,
  movePlayersAndFamiliars,
  teleport,
} from "../../../../utilGlobals";
import { FastTravelEntityType } from "./enums";
import * as fastTravel from "./fastTravel";
import * as state from "./state";

const GRID_INDEX_OF_TOP_OF_LADDER = 2;
const TOP_OF_LADDER_POSITION = Vector(120, 160);

const DEVIL_ANGEL_EXIT_MAP = new Map<int, Direction>([
  [7, Direction.UP], // Top door
  [74, Direction.RIGHT], // Right door
  [127, Direction.DOWN], // Bottom door
  [60, Direction.LEFT], // Left door
]);

const BOSS_RUSH_EXIT_MAP = new Map<int, Direction>([
  // Even though the Boss Rush is a 2x2 room,
  // it is not possible for doors to spawn in other locations than these 4 spots
  [7, Direction.UP], // Top left door
  [112, Direction.LEFT], // Left top door
  [139, Direction.RIGHT], // Right top door
  [427, Direction.DOWN], // Bottom left door
]);

const BOSS_ROOM_ENTER_MAP = new Map<Direction, int>([
  [Direction.LEFT, 73], // 0 (returning from the right door)
  [Direction.UP, 112], // 1 (returning from the bottom door)
  [Direction.RIGHT, 61], // 2 (returning from the left door)
  [Direction.DOWN, 22], // 3 (returning from the top door)
]);

const FAST_TRAVEL_ENTITY_TYPE = FastTravelEntityType.Crawlspace;

// ModCallbacks.MC_POST_NEW_ROOM (19)
export function postNewRoom(): void {
  repositionPlayer();
  checkBlackMarket(); // This must be after the "repositionPlayer()" function
  checkReturningToRoomOutsideTheGrid();
  checkPostRoomTransitionSubvert();
}

function repositionPlayer() {
  // The player will be placed at the right-most door if we perform the following steps:
  // - Enter a crawlspace from outside of the grid
  // - Exit the crawlspace
  // - Enter the crawlspace again
  // Fix this bug by simply manually moving the player to the top of the ladder every time they
  // enter a crawlspace
  if (
    inCrawlspace() &&
    // If we are returning from a Black Market, then being at the right-most door is the correct
    // position and we should not do anything further
    !g.run.level.fastTravel.blackMarket
  ) {
    movePlayersAndFamiliars(TOP_OF_LADDER_POSITION);
  }
}

function checkBlackMarket() {
  const roomIndex = getRoomIndex();
  g.run.level.fastTravel.blackMarket =
    roomIndex === GridRooms.ROOM_BLACK_MARKET_IDX;
}

function checkReturningToRoomOutsideTheGrid() {
  const roomIndex = getRoomIndex();
  const prevRoomIndex = g.l.GetPreviousRoomIndex(); // We need the unsafe version here

  // Normally, when returning from a crawlspace,
  // the game automatically moves the player to the "Level.DungeonReturnPosition" variable
  // However, for some reason, this will not occur when returning from a crawlspace to a room
  // outside of the grid
  // If this is the case, move the player manually
  // Furthermore, in the Boss Rush, this will look glitchy because the game originally places us
  // next to a Boss Rush door, but there is no way around this;
  // even if we change player.Position on every frame in the PostRender callback,
  // the glitchy warp will still occur
  if (
    prevRoomIndex === GridRooms.ROOM_DUNGEON_IDX &&
    roomIndex < 0 &&
    // We don't want to teleport if we are returning to a crawlspace from a Black Market
    roomIndex !== GridRooms.ROOM_DUNGEON_IDX &&
    // We don't want to teleport in a Black Market
    roomIndex !== GridRooms.ROOM_BLACK_MARKET_IDX
  ) {
    movePlayersAndFamiliars(g.l.DungeonReturnPosition);
  }
}

function checkPostRoomTransitionSubvert() {
  // If we subverted the room transition for a room outside of the grid,
  // we might not end up in a spot where the player expects
  // So, move to the most logical position
  const direction = g.run.level.fastTravel.subvertedRoomTransitionDirection;
  if (direction !== Direction.NO_DIRECTION) {
    const gridPosition = BOSS_ROOM_ENTER_MAP.get(direction);
    if (gridPosition !== undefined) {
      const player = Isaac.GetPlayer();
      if (player !== null) {
        player.Position = g.r.GetGridPosition(gridPosition);
        g.run.level.fastTravel.subvertedRoomTransitionDirection =
          Direction.NO_DIRECTION;
        log(
          "Changed the player's position after subverting the room transition animation for a room outside of the grid.",
        );
      }
    }
  }
}

// ModCallbacks.MC_POST_PLAYER_UPDATE (31)
export function postPlayerUpdate(player: EntityPlayer): void {
  if (g.run.room.fastTravel.amChangingRooms) {
    return;
  }

  checkTopOfCrawlspaceLadder(player);
  checkExitSoftlock(player);
}

function checkTopOfCrawlspaceLadder(player: EntityPlayer) {
  if (
    inCrawlspace() &&
    g.r.GetGridIndex(player.Position) === GRID_INDEX_OF_TOP_OF_LADDER
  ) {
    g.run.room.fastTravel.amChangingRooms = true;
    teleport(g.l.DungeonReturnRoomIndex, Direction.UP, RoomTransitionAnim.WALK);
  }
}

function checkExitSoftlock(player: EntityPlayer) {
  // By default, if you return from a crawlspace to a room outside of the grid (e.g. the Boss Rush),
  // then leaving the room will cause you to go back to the crawlspace again
  // (because the game is programmed to send you to the previous room)
  // Fix this by checking to see if the player is about to touch a loading zone and if so,
  // subvert their interaction
  const previousRoomIndex = g.l.GetPreviousRoomIndex(); // We need the unsafe version here
  const roomType = g.r.GetType();

  if (
    previousRoomIndex !== GridRooms.ROOM_DUNGEON_IDX ||
    g.run.level.fastTravel.previousRoomIndex === null
  ) {
    return;
  }

  const direction = getExitDirection(roomType, player);
  if (direction !== undefined) {
    g.run.level.fastTravel.subvertedRoomTransitionDirection = direction;
    g.run.room.fastTravel.amChangingRooms = true;
    teleport(
      g.run.level.fastTravel.previousRoomIndex,
      direction,
      RoomTransitionAnim.WALK,
    );
    log(
      "Subverted exiting a room outside of the grid to avoid a crawlspace-related softlock.",
    );
  }
}

function getExitDirection(roomType: RoomType, player: EntityPlayer) {
  const playerGridIndex = g.r.GetGridIndex(player.Position);

  switch (roomType) {
    case RoomType.ROOM_DEVIL:
    case RoomType.ROOM_ANGEL: {
      return DEVIL_ANGEL_EXIT_MAP.get(playerGridIndex);
    }

    case RoomType.ROOM_BOSSRUSH: {
      return BOSS_RUSH_EXIT_MAP.get(playerGridIndex);
    }

    default: {
      return undefined;
    }
  }
}

// ModCallbacksCustom.MC_POST_GRID_ENTITY_INIT
// GridEntityType.GRID_STAIRS
export function postGridEntityInitCrawlspace(gridEntity: GridEntity): void {
  fastTravel.init(gridEntity, FAST_TRAVEL_ENTITY_TYPE, shouldSpawnOpen);
}

// ModCallbacksCustom.MC_POST_GRID_ENTITY_UPDATE
// GridEntityType.GRID_STAIRS
export function postGridEntityUpdateCrawlspace(gridEntity: GridEntity): void {
  // Ensure that the fast-travel entity has been initialized
  const gridIndex = gridEntity.GetGridIndex();
  const entry = g.run.room.fastTravel.crawlspaces.get(gridIndex);
  if (entry === undefined) {
    return;
  }

  // Keep it closed on every frame so that we can implement our own custom functionality
  gridEntity.State = TrapdoorState.CLOSED;

  fastTravel.checkShouldOpen(gridEntity, FAST_TRAVEL_ENTITY_TYPE);
  fastTravel.checkPlayerTouched(gridEntity, FAST_TRAVEL_ENTITY_TYPE, touched);
}

function shouldSpawnOpen(entity: GridEntity | EntityEffect) {
  const roomFrameCount = g.r.GetFrameCount();
  const roomClear = g.r.IsClear();
  const roomIndex = getRoomIndex();

  if (roomFrameCount === 0) {
    // If we just entered a new room with enemies in it, spawn the crawlspace closed so that the
    // player has to defeat the enemies first before using the crawlspace
    if (!roomClear) {
      return false;
    }

    // Always spawn crawlspaces closed in off-grid rooms to prevent softlocks
    // (the below distance check will fail and the crawlspace will be spawned open,
    // but then the player will be teleported away from the entrance of the room back on top of the
    // crawlspace, which will cause them to immediately re-enter it again)
    if (roomIndex < 0) {
      return false;
    }

    // If we just entered a new room that is already cleared,
    // spawn the crawlspace closed if we are standing close to it, and open otherwise
    return state.shouldOpen(entity, FAST_TRAVEL_ENTITY_TYPE);
  }

  // Crawlspaces created after a room has already initialized should spawn closed by default
  // e.g. crawlspaces created by We Need to Go Deeper! should spawn closed because the player will
  // be standing on top of them
  return false;
}

function touched(entity: GridEntity | EntityEffect) {
  const roomIndex = getRoomIndex();
  const previousRoomIndex = g.l.GetPreviousRoomIndex();

  // If we return to a room outside of the grid from a crawlspace,
  // the previous room index will be the crawlspace
  // We need to preserve the room index of the last non-negative room
  const previousRoomIndexToUse =
    g.run.level.fastTravel.previousRoomIndex === null
      ? previousRoomIndex
      : g.run.level.fastTravel.previousRoomIndex;

  // Save the previous room information so that we can return there after exiting the crawlspace
  // (for the special case where we return to a room outside of the grid)
  g.run.level.fastTravel.previousRoomIndex = previousRoomIndexToUse;

  // Vanilla crawlspaces uses these variables to return the player to the previous room
  // Even though we are re-implementing crawlspaces, we will use the same variables
  g.l.DungeonReturnRoomIndex = roomIndex;
  g.l.DungeonReturnPosition = entity.Position;

  // Go to the crawlspace
  teleport(GridRooms.ROOM_DUNGEON_IDX, Direction.DOWN, RoomTransitionAnim.WALK);
}
