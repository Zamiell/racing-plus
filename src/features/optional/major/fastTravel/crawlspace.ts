// For testing, a seed with a black market is: 2SB2 M4R6

import {
  getPlayerCloserThan,
  getRoomIndex,
  getRoomStageID,
  getRoomVariant,
  inCrawlspace,
  inGenesisRoom,
  log,
  onFinalFloor,
  teleport,
} from "isaacscript-common";
import g from "../../../../globals";
import { movePlayersAndFamiliars } from "../../../../util";
import { removeGridEntity } from "../../../../utilGlobals";
import { FastTravelEntityType } from "./enums";
import * as fastTravel from "./fastTravel";
import * as state from "./state";
import v from "./v";

const GRID_INDEX_OF_GREAT_GIDEON_CRAWLSPACE = 37;

const GREAT_GIDEON_ROOM_VARIANTS = [5210, 5211, 5212, 5213, 5214];

const GRID_INDEX_OF_TOP_OF_LADDER = 2;
const TOP_OF_LADDER_POSITION = Vector(120, 160);

const TELEPORTER_ACTIVATION_DISTANCE = 20; // Exactly the same as a vanilla teleporter

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

const ONE_BY_ONE_ROOM_ENTER_MAP = new Map<Direction, int>([
  [Direction.LEFT, 73], // 0 (returning from the right door)
  [Direction.UP, 112], // 1 (returning from the bottom door)
  [Direction.RIGHT, 61], // 2 (returning from the left door)
  [Direction.DOWN, 22], // 3 (returning from the top door)
]);

const FAST_TRAVEL_ENTITY_TYPE = FastTravelEntityType.CRAWLSPACE;

// ModCallbacks.MC_POST_UPDATE (1)
export function postUpdate(): void {
  const gameFrameCount = g.g.GetFrameCount();

  if (
    v.room.teleporter.frame !== null &&
    gameFrameCount >= v.room.teleporter.frame
  ) {
    spawnTeleporter();
    v.room.teleporter.frame = null;
    v.room.teleporter.position = Vector.Zero;
    v.room.teleporter.spawned = true;
  }
}

function spawnTeleporter() {
  Isaac.GridSpawn(
    GridEntityType.GRID_TELEPORTER,
    0,
    v.room.teleporter.position,
    true,
  );
}

// ModCallbacks.MC_POST_NEW_ROOM (19)
export function postNewRoom(): void {
  checkEnteringCrawlspace();
  checkExitingCrawlspace();
  checkPostRoomTransitionSubvert();
}

function checkEnteringCrawlspace() {
  if (inCrawlspace() && v.level.crawlspace.amEntering) {
    v.level.crawlspace.amEntering = false;

    // When a player manually teleports into a crawlspace, they will not consistently be placed at the
    // top of the ladder
    // Thus, manually moving the player to the top of the ladder every time they enter a crawlspace
    movePlayersAndFamiliars(TOP_OF_LADDER_POSITION);
    log(
      "Manually repositioned a player to the top of the ladder after returning to a crawlspace after a Black Market.",
    );
  }
}

function checkExitingCrawlspace() {
  if (v.level.crawlspace.amExiting) {
    v.level.crawlspace.amExiting = false;

    if (v.level.crawlspace.returnRoomPosition === null) {
      return;
    }

    movePlayersAndFamiliars(v.level.crawlspace.returnRoomPosition);
  }
}

function checkPostRoomTransitionSubvert() {
  // If we subverted the room transition for a room outside of the grid,
  // we might not end up in a spot where the player expects
  // So, move to the most logical position
  const direction = v.level.crawlspace.subvertedRoomTransitionDirection;
  if (direction === Direction.NO_DIRECTION) {
    return;
  }

  const gridPosition = ONE_BY_ONE_ROOM_ENTER_MAP.get(direction);
  if (gridPosition !== undefined) {
    const player = Isaac.GetPlayer();
    if (player !== null) {
      player.Position = g.r.GetGridPosition(gridPosition);
      v.level.crawlspace.subvertedRoomTransitionDirection =
        Direction.NO_DIRECTION;
      log(
        "Changed the player's position after subverting the room transition animation for a room outside of the grid.",
      );
    }
  }
}

// ModCallbacks.MC_POST_PLAYER_UPDATE (31)
export function postPlayerUpdate(player: EntityPlayer): void {
  if (v.room.amChangingRooms) {
    return;
  }

  checkTopOfCrawlspaceLadder(player);
  checkExitSoftlock(player);
}

function checkTopOfCrawlspaceLadder(player: EntityPlayer) {
  const startingRoomIndex = g.l.GetStartingRoomIndex();

  if (
    inCrawlspace() &&
    g.r.GetGridIndex(player.Position) === GRID_INDEX_OF_TOP_OF_LADDER
  ) {
    v.room.amChangingRooms = true;
    v.level.crawlspace.amExiting = true;

    const returnRoomIndex =
      v.level.crawlspace.returnRoomIndex === null
        ? startingRoomIndex
        : v.level.crawlspace.returnRoomIndex;

    teleport(returnRoomIndex, Direction.UP, RoomTransitionAnim.WALK);
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
    v.level.crawlspace.previousReturnRoomIndex === null
  ) {
    return;
  }

  const direction = getExitDirection(roomType, player);
  if (direction !== undefined) {
    v.level.crawlspace.subvertedRoomTransitionDirection = direction;
    v.room.amChangingRooms = true;
    teleport(
      v.level.crawlspace.previousReturnRoomIndex,
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
// GridEntityType.GRID_STAIRS (18)
export function postGridEntityInitCrawlspace(gridEntity: GridEntity): void {
  // In some situations, crawlspaces should be replaced with a teleport pad
  if (shouldReplaceWithTeleportPad()) {
    replaceWithTeleportPad(gridEntity);
    return;
  }

  fastTravel.init(gridEntity, FAST_TRAVEL_ENTITY_TYPE, shouldSpawnOpen);
}

function shouldReplaceWithTeleportPad() {
  return onFinalFloor() && inGenesisRoom();
}

function replaceWithTeleportPad(gridEntity: GridEntity) {
  const gameFrameCount = g.g.GetFrameCount();

  removeGridEntity(gridEntity);

  // If we remove a crawlspace and spawn a teleporter on the same tile on the same frame,
  // the teleporter will immediately despawn for some reason
  // Work around this by simply spawning it on the next game frame
  v.room.teleporter.frame = gameFrameCount + 1;
  v.room.teleporter.position = gridEntity.Position;
}

// ModCallbacksCustom.MC_POST_GRID_ENTITY_UPDATE
// GridEntityType.GRID_STAIRS (18)
export function postGridEntityUpdateCrawlspace(gridEntity: GridEntity): void {
  // Ensure that the fast-travel entity has been initialized
  const gridIndex = gridEntity.GetGridIndex();
  const entry = v.room.crawlspaces.get(gridIndex);
  if (entry === undefined) {
    return;
  }

  // Keep it closed on every frame so that we can implement our own custom functionality
  gridEntity.State = TrapdoorState.CLOSED;

  fastTravel.checkShouldOpen(gridEntity, FAST_TRAVEL_ENTITY_TYPE);
  fastTravel.checkPlayerTouched(gridEntity, FAST_TRAVEL_ENTITY_TYPE, touched);
}

// ModCallbacksCustom.MC_POST_GRID_ENTITY_UPDATE
// GridEntityType.GRID_TELEPORTER (23)
export function postGridEntityUpdateTeleporter(gridEntity: GridEntity): void {
  if (!v.room.teleporter.spawned) {
    return;
  }

  const startingRoomIndex = g.l.GetStartingRoomIndex();

  const playerTouching = getPlayerCloserThan(
    gridEntity.Position,
    TELEPORTER_ACTIVATION_DISTANCE,
  );
  if (playerTouching !== null) {
    teleport(startingRoomIndex);
  }
}

// ModCallbacksCustom.MC_POST_GRID_ENTITY_REMOVE
// GridEntityType.GRID_STAIRS (18)
export function postGridEntityRemoveCrawlspace(gridIndex: int): void {
  state.deleteDescription(gridIndex, FAST_TRAVEL_ENTITY_TYPE);
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
  const gridEntity = entity as GridEntity;

  // First, do nothing in the special case of this being a Great Gideon crawlspace
  // (we don't want to handle this because it would require a lot more detection-based code)
  // The crawlspace will still work, it will just
  if (isGreatGideonCrawlspace(gridEntity)) {
    return;
  }

  const roomIndex = getRoomIndex();
  const previousRoomIndex = g.l.GetPreviousRoomIndex();

  // Save the current room information so that we can return here once we exit the top of the
  // crawlspace ladder
  v.level.crawlspace.returnRoomIndex = roomIndex;
  v.level.crawlspace.returnRoomPosition = entity.Position;

  // Additionally, save the previous room information so that we can avoid a softlock when returning
  // to a room outside the grid
  if (roomIndex < 0 && v.level.crawlspace.previousReturnRoomIndex === null) {
    v.level.crawlspace.previousReturnRoomIndex = previousRoomIndex;
    log(
      `Since we are entering a crawlspace from a room outside of the grid, storing the previous room index: ${v.level.crawlspace.previousReturnRoomIndex}`,
    );
  }

  // Go to the crawlspace
  teleport(GridRooms.ROOM_DUNGEON_IDX, Direction.DOWN, RoomTransitionAnim.WALK);
}

function isGreatGideonCrawlspace(gridEntity: GridEntity) {
  const gridIndex = gridEntity.GetGridIndex();

  return (
    isGreatGideonRoom() && gridIndex === GRID_INDEX_OF_GREAT_GIDEON_CRAWLSPACE
  );
}

function isGreatGideonRoom() {
  const roomStageID = getRoomStageID();
  const roomVariant = getRoomVariant();

  return (
    roomStageID === StageID.SPECIAL_ROOMS &&
    GREAT_GIDEON_ROOM_VARIANTS.includes(roomVariant)
  );
}
