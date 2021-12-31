// For testing, a seed with a black market is: 2SB2 M4R6

import {
  DISTANCE_OF_GRID_TILE,
  getPlayerCloserThan,
  getRoomSafeGridIndex,
  inBeastRoom,
  inCrawlspace,
  isRoomInsideMap,
  log,
  removeGridEntity,
  runNextFrame,
  teleport,
} from "isaacscript-common";
import g from "../../../../globals";
import { inBeastDebugRoom, movePlayersAndFamiliars } from "../../../../util";
import { DEBUG } from "./constants";
import { FastTravelEntityState, FastTravelEntityType } from "./enums";
import * as fastTravel from "./fastTravel";
import * as state from "./state";
import v from "./v";

const GRID_INDEX_TOP_OF_CRAWLSPACE_LADDER = 2;
const GRID_INDEX_SECRET_SHOP_LADDER = 25;
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

// ModCallbacks.MC_POST_PEFFECT_UPDATE (4)
export function postPEffectUpdate(player: EntityPlayer): void {
  if (v.room.amChangingRooms) {
    return;
  }

  checkMovedAwayFromSecretShopLadder(player);
  checkTopOfCrawlspaceLadder(player);
  checkExitSoftlock(player);
}

function checkMovedAwayFromSecretShopLadder(player: EntityPlayer) {
  const roomSafeGridIndex = getRoomSafeGridIndex();
  if (roomSafeGridIndex !== GridRooms.ROOM_SECRET_SHOP_IDX) {
    return;
  }

  const ladderPosition = g.r.GetGridPosition(GRID_INDEX_SECRET_SHOP_LADDER);
  if (player.Position.Distance(ladderPosition) > DISTANCE_OF_GRID_TILE) {
    v.room.movedAwayFromSecretShopLadder = true;
  }
}

function checkTopOfCrawlspaceLadder(player: EntityPlayer) {
  const startingRoomGridIndex = g.l.GetStartingRoomIndex();
  const roomSafeGridIndex = getRoomSafeGridIndex();

  // The Beast room shares the grid index of a crawlspace
  if (inBeastRoom() || inBeastDebugRoom()) {
    return;
  }

  if (
    roomSafeGridIndex !== GridRooms.ROOM_DUNGEON_IDX &&
    roomSafeGridIndex !== GridRooms.ROOM_SECRET_SHOP_IDX
  ) {
    return;
  }

  if (
    roomSafeGridIndex === GridRooms.ROOM_SECRET_SHOP_IDX &&
    !v.room.movedAwayFromSecretShopLadder
  ) {
    return;
  }

  if (playerIsTouchingExitSquare(player)) {
    v.room.amChangingRooms = true;
    v.level.crawlspace.amExiting = true;

    const returnRoomGridIndex =
      v.level.crawlspace.returnRoomGridIndex === null
        ? startingRoomGridIndex
        : v.level.crawlspace.returnRoomGridIndex;

    teleport(returnRoomGridIndex, Direction.UP, RoomTransitionAnim.WALK);
  }
}

function playerIsTouchingExitSquare(player: EntityPlayer) {
  const roomSafeGridIndex = getRoomSafeGridIndex();

  if (roomSafeGridIndex === GridRooms.ROOM_DUNGEON_IDX) {
    const gridIndexOfPlayer = g.r.GetGridIndex(player.Position);
    return gridIndexOfPlayer === GRID_INDEX_TOP_OF_CRAWLSPACE_LADDER;
  }

  const ladderPosition = g.r.GetGridPosition(GRID_INDEX_SECRET_SHOP_LADDER);
  return (
    // The vanilla hitbox seems to be half of a grid square,
    // so we need to specify our hitbox to be bigger than this
    // (0.6 is not big enough to consistently work when coming from the left side)
    player.Position.Distance(ladderPosition) < DISTANCE_OF_GRID_TILE * 0.75
  );
}

function checkExitSoftlock(player: EntityPlayer) {
  // By default, if you return from a crawlspace to a room outside of the grid (e.g. the Boss Rush),
  // then leaving the room will cause you to go back to the crawlspace again
  // (because the game is programmed to send you to the previous room)
  // Fix this by checking to see if the player is about to touch a loading zone and if so,
  // subvert their interaction
  const previousRoomGridIndex = g.l.GetPreviousRoomIndex(); // We need the unsafe version here
  const roomType = g.r.GetType();

  if (
    previousRoomGridIndex !== GridRooms.ROOM_DUNGEON_IDX ||
    v.level.crawlspace.previousReturnRoomGridIndex === null
  ) {
    return;
  }

  const direction = getExitDirection(roomType, player);
  if (direction !== undefined) {
    v.level.crawlspace.subvertedRoomTransitionDirection = direction;
    v.room.amChangingRooms = true;
    teleport(
      v.level.crawlspace.previousReturnRoomGridIndex,
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

// ModCallbacks.MC_POST_NEW_ROOM (19)
export function postNewRoom(): void {
  checkEnteringCrawlspace();
  checkExitingCrawlspace();
  checkPostRoomTransitionSubvert();
}

function checkEnteringCrawlspace() {
  if (inCrawlspace() && v.level.crawlspace.amEntering) {
    v.level.crawlspace.amEntering = false;

    // When a player manually teleports into a crawlspace, they will not consistently be placed at
    // the top of the ladder
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

  const roomShape = g.r.GetRoomShape();
  if (roomShape !== RoomShape.ROOMSHAPE_1x1) {
    return;
  }

  const gridPosition = ONE_BY_ONE_ROOM_ENTER_MAP.get(direction);
  if (gridPosition === undefined) {
    return;
  }

  const player = Isaac.GetPlayer();
  player.Position = g.r.GetGridPosition(gridPosition);
  v.level.crawlspace.subvertedRoomTransitionDirection = Direction.NO_DIRECTION;
  log(
    "Changed the player's position after subverting the room transition animation for a room outside of the grid.",
  );
}

// ModCallbacksCustom.MC_POST_GRID_ENTITY_INIT
// GridEntityType.GRID_STAIRS (18)
export function postGridEntityInitCrawlspace(gridEntity: GridEntity): void {
  const variant = gridEntity.GetVariant();

  // We re-implement crawlspaces that lead to the beginning of the floor as a teleport pad since it
  // is easier to understand
  if (variant === StairsVariant.PASSAGE_TO_BEGINNING_OF_FLOOR) {
    replaceWithTeleportPad(gridEntity);
    return;
  }

  // Ignore other special crawlspaces
  if (
    variant !== StairsVariant.NORMAL &&
    variant !== StairsVariant.SECRET_SHOP
  ) {
    return;
  }

  fastTravel.init(gridEntity, FAST_TRAVEL_ENTITY_TYPE, shouldSpawnOpen);
}

function replaceWithTeleportPad(gridEntity: GridEntity) {
  removeGridEntity(gridEntity);

  // If we remove a crawlspace and spawn a teleporter on the same tile on the same frame,
  // the teleporter will immediately despawn for some reason
  // Work around this by simply spawning it on the next game frame
  runNextFrame(() => {
    Isaac.GridSpawn(
      GridEntityType.GRID_TELEPORTER,
      0,
      gridEntity.Position,
      true,
    );

    v.room.teleporterSpawned = true;
  });
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

  checkShouldClose(gridEntity);
  fastTravel.checkShouldOpen(gridEntity, FAST_TRAVEL_ENTITY_TYPE);
  fastTravel.checkPlayerTouched(gridEntity, FAST_TRAVEL_ENTITY_TYPE, touched);
}

// TODO remove this after the next vanilla patch in 2022 when Crawlspaces are decoupled from sprites
function checkShouldClose(gridEntity: GridEntity) {
  const entityState = state.get(gridEntity, FAST_TRAVEL_ENTITY_TYPE);
  if (
    entityState === FastTravelEntityState.OPEN &&
    fastTravel.anyPlayerUsingPony()
  ) {
    state.close(gridEntity, FAST_TRAVEL_ENTITY_TYPE);
  }
}

// ModCallbacksCustom.MC_POST_GRID_ENTITY_UPDATE
// GridEntityType.GRID_TELEPORTER (23)
export function postGridEntityUpdateTeleporter(gridEntity: GridEntity): void {
  if (!v.room.teleporterSpawned) {
    return;
  }

  const startingRoomGridIndex = g.l.GetStartingRoomIndex();

  const playerTouching = getPlayerCloserThan(
    gridEntity.Position,
    TELEPORTER_ACTIVATION_DISTANCE,
  );
  if (playerTouching !== undefined) {
    teleport(startingRoomGridIndex);
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
    if (!isRoomInsideMap()) {
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
  const variant = gridEntity.GetVariant();
  const roomSafeGridIndex = getRoomSafeGridIndex();
  const previousRoomGridIndex = g.l.GetPreviousRoomIndex();

  if (DEBUG) {
    log("Touched a crawlspace.");
  }

  // Save the current room information so that we can return here once we exit the top of the
  // crawlspace ladder
  v.level.crawlspace.returnRoomGridIndex = roomSafeGridIndex;
  v.level.crawlspace.returnRoomPosition = entity.Position;

  // Additionally, save the previous room information so that we can avoid a softlock when returning
  // to a room outside the grid
  if (
    !isRoomInsideMap() &&
    v.level.crawlspace.previousReturnRoomGridIndex === null
  ) {
    v.level.crawlspace.previousReturnRoomGridIndex = previousRoomGridIndex;
    log(
      `Since we are entering a crawlspace from a room outside of the grid, storing the previous room index: ${v.level.crawlspace.previousReturnRoomGridIndex}`,
    );
  }

  // Enter the crawlspace room
  const destinationRoomGridIndex =
    variant === StairsVariant.SECRET_SHOP
      ? GridRooms.ROOM_SECRET_SHOP_IDX
      : GridRooms.ROOM_DUNGEON_IDX;
  teleport(destinationRoomGridIndex, Direction.DOWN, RoomTransitionAnim.WALK);
}
