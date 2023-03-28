// For testing, a seed with a Black Market is: 2SB2 M4R6

import {
  CrawlSpaceState,
  CrawlSpaceVariant,
  Direction,
  EffectVariant,
  GridRoom,
  RoomShape,
  RoomTransitionAnim,
  RoomType,
  TeleporterState,
} from "isaac-typescript-definitions";
import {
  DISTANCE_OF_GRID_TILE,
  LadderSubTypeCustom,
  ReadonlyMap,
  asNumber,
  game,
  getCrawlSpaces,
  getEffects,
  getRoomGridIndex,
  inCrawlSpace,
  inSecretShop,
  isRoomInsideGrid,
  log,
  removeGridEntity,
  spawnEffect,
  spawnTeleporter,
  teleport,
} from "isaacscript-common";
import { FastTravelEntityState } from "../../../../../enums/FastTravelEntityState";
import { FastTravelEntityType } from "../../../../../enums/FastTravelEntityType";
import { mod } from "../../../../../mod";
import { movePlayersAndFamiliars } from "../../../../../utils";
import { FAST_TRAVEL_DEBUG } from "./constants";
import {
  checkFastTravelEntityShouldOpen,
  checkPlayerTouchedFastTravelEntity,
  initFastTravelEntity,
} from "./fastTravelEntity";
import {
  deleteFastTravelEntityDescription,
  fastTravelEntityClose,
  getFastTravelEntityState,
  shouldOpenFastTravelEntity,
} from "./state";
import { v } from "./v";

const GRID_INDEX_TOP_OF_CRAWLSPACE_LADDER = 2;
const GRID_INDEX_SECRET_SHOP_LADDER = 25;
const TOP_OF_LADDER_POSITION = Vector(120, 160);

/** Chosen to not overlap with the vanilla `LadderSubTypeCustom` entries. */
const CUSTOM_SECRET_SHOP_LADDER_SUB_TYPE = 200 as LadderSubTypeCustom;

const DEVIL_ANGEL_EXIT_MAP = new ReadonlyMap<int, Direction>([
  [7, Direction.UP], // Top door
  [74, Direction.RIGHT], // Right door
  [127, Direction.DOWN], // Bottom door
  [60, Direction.LEFT], // Left door
]);

/**
 * Even though the Boss Rush is a 2x2 room, it is not possible for doors to spawn in other locations
 * than these 4 spots.
 */
const BOSS_RUSH_EXIT_MAP = new ReadonlyMap<int, Direction>([
  [7, Direction.UP], // Top left door
  [112, Direction.LEFT], // Left top door
  [139, Direction.RIGHT], // Right top door
  [427, Direction.DOWN], // Bottom left door
]);

const ONE_BY_ONE_ROOM_ENTER_MAP = new ReadonlyMap<Direction, int>([
  [Direction.LEFT, 73], // 0 (returning from the right door)
  [Direction.UP, 112], // 1 (returning from the bottom door)
  [Direction.RIGHT, 61], // 2 (returning from the left door)
  [Direction.DOWN, 22], // 3 (returning from the top door)
]);

const FAST_TRAVEL_ENTITY_TYPE = FastTravelEntityType.CRAWLSPACE;

// ModCallbackCustom.POST_GRID_ENTITY_INIT
// GridEntityType.CRAWL_SPACE (18)
export function crawlSpacePostGridEntityInitCrawlSpace(
  gridEntity: GridEntity,
): void {
  const variant = gridEntity.GetVariant() as CrawlSpaceVariant;

  // We re-implement crawl spaces that lead to the beginning of the floor as a teleport pad since it
  // is easier to understand.
  if (variant === CrawlSpaceVariant.PASSAGE_TO_BEGINNING_OF_FLOOR) {
    replaceWithTeleportPad(gridEntity);
    return;
  }

  // Ignore other special crawl spaces.
  if (
    variant !== CrawlSpaceVariant.NORMAL &&
    variant !== CrawlSpaceVariant.SECRET_SHOP
  ) {
    return;
  }

  initFastTravelEntity(gridEntity, FAST_TRAVEL_ENTITY_TYPE, shouldSpawnOpen);
}

function replaceWithTeleportPad(gridEntity: GridEntity) {
  removeGridEntity(gridEntity, false);

  // If we remove a crawl space and spawn a teleporter on the same tile on the same frame, the
  // teleporter will immediately despawn for some reason. Work around this by simply spawning it on
  // the next game frame.
  const gridIndex = gridEntity.GetGridIndex();
  mod.runNextGameFrame(() => {
    spawnTeleporter(gridIndex);
    v.room.teleporterSpawned = true;
  });
}

// ModCallbackCustom.POST_GRID_ENTITY_UPDATE
// GridEntityType.CRAWL_SPACE (18)
export function crawlSpacePostGridEntityUpdateCrawlSpace(
  gridEntity: GridEntity,
): void {
  // Ensure that the fast-travel entity has been initialized.
  const gridIndex = gridEntity.GetGridIndex();
  const entry = v.room.crawlSpaces.get(gridIndex);
  if (entry === undefined) {
    return;
  }

  // Keep it closed on every frame so that we can implement our own custom functionality.
  gridEntity.State = CrawlSpaceState.CLOSED;

  checkShouldClose(gridEntity);
  checkFastTravelEntityShouldOpen(gridEntity, FAST_TRAVEL_ENTITY_TYPE);
  checkPlayerTouchedFastTravelEntity(
    gridEntity,
    FAST_TRAVEL_ENTITY_TYPE,
    touched,
  );
}

// TODO: Remove this after the next vanilla patch in 2022 when crawl spaces are decoupled from
// sprites.
function checkShouldClose(gridEntity: GridEntity) {
  const entityState = getFastTravelEntityState(
    gridEntity,
    FAST_TRAVEL_ENTITY_TYPE,
  );
  if (entityState === FastTravelEntityState.OPEN && mod.anyPlayerUsingPony()) {
    fastTravelEntityClose(gridEntity, FAST_TRAVEL_ENTITY_TYPE);
  }
}

// ModCallbackCustom.POST_GRID_ENTITY_STATE_CHANGED
// GridEntityType.TELEPORTER (23)
export function crawlSpacePostGridEntityStateChangedTeleporter(
  _gridEntity: GridEntity,
  _oldState: int,
  newState: int,
): void {
  if (!v.room.teleporterSpawned) {
    return;
  }

  if (newState === asNumber(TeleporterState.DISABLED)) {
    const level = game.GetLevel();
    const startingRoomGridIndex = level.GetStartingRoomIndex();
    teleport(startingRoomGridIndex);
  }
}

// ModCallbackCustom.POST_GRID_ENTITY_REMOVE
// GridEntityType.CRAWL_SPACE (18)
export function crawlSpacePostGridEntityRemoveCrawlSpace(gridIndex: int): void {
  deleteFastTravelEntityDescription(gridIndex, FAST_TRAVEL_ENTITY_TYPE);
}

function shouldSpawnOpen(entity: GridEntity | EntityEffect) {
  const room = game.GetRoom();
  const roomFrameCount = room.GetFrameCount();
  const roomClear = room.IsClear();

  // Crawl spaces created after a room has already initialized should spawn closed by default. For
  // example, crawl spaces created by We Need to Go Deeper should spawn closed because the player
  // will be standing on top of them.
  if (roomFrameCount > 0) {
    return false;
  }

  // If we just entered a new room with enemies in it, spawn the crawl space closed so that the
  // player has to defeat the enemies first before using the crawl space.
  if (!roomClear) {
    return false;
  }

  // Always spawn crawl spaces closed in off-grid rooms to prevent softlocks. (The below distance
  // check will fail and the crawl space will be spawned open, but then the player will be
  // teleported away from the entrance of the room back on top of the crawl space, which will cause
  // them to immediately re-enter it again.)
  if (!isRoomInsideGrid()) {
    return false;
  }

  // If we just entered a new room that is already cleared, spawn the crawl space closed if we are
  // standing close to it, and open otherwise.
  return shouldOpenFastTravelEntity(entity, FAST_TRAVEL_ENTITY_TYPE);
}

function touched(entity: GridEntity | EntityEffect) {
  const gridEntity = entity as GridEntity;
  const variant = gridEntity.GetVariant() as CrawlSpaceVariant;
  const level = game.GetLevel();
  const previousRoomGridIndex = level.GetPreviousRoomIndex();
  const roomGridIndex = getRoomGridIndex();

  if (FAST_TRAVEL_DEBUG) {
    log("Touched a crawl space.");
  }

  // Save the current room information so that we can return here once we exit the top of the crawl
  // space ladder.
  v.level.crawlSpace.returnRoomGridIndex = roomGridIndex;
  v.level.crawlSpace.returnRoomPosition = entity.Position;

  // Additionally, save the previous room information so that we can avoid a softlock when returning
  // to a room outside the grid.
  if (
    !isRoomInsideGrid() &&
    v.level.crawlSpace.previousReturnRoomGridIndex === null
  ) {
    v.level.crawlSpace.previousReturnRoomGridIndex = previousRoomGridIndex;
    log(
      `Since we are entering a crawl space from a room outside of the grid, storing the previous room index: ${v.level.crawlSpace.previousReturnRoomGridIndex}`,
    );
  }

  // Enter the crawl space room.
  const destinationRoomGridIndex =
    variant === CrawlSpaceVariant.SECRET_SHOP
      ? GridRoom.SECRET_SHOP
      : GridRoom.DUNGEON;
  teleport(destinationRoomGridIndex, Direction.DOWN, RoomTransitionAnim.WALK);
}

// ModCallbackCustom.POST_NEW_ROOM_REORDERED
export function crawlSpacePostNewRoomReordered(): void {
  checkEnteringSecretShop();
  checkEnteringCrawlSpace();
  checkExitingCrawlSpace();
  checkPostRoomTransitionSubvert();
}

function checkEnteringSecretShop() {
  if (!inSecretShop()) {
    return;
  }

  // The vanilla loading zone is tied to the presence of the Tall Ladder effect.
  const ladders = getEffects(EffectVariant.TALL_LADDER);
  const ladder = ladders[0];
  if (ladder === undefined) {
    return;
  }

  ladder.Remove();

  // Spawn a new effect with the old ladder's graphics. (We use a normal ladder to represent the
  // custom tall ladder since a normal ladder is a vanilla effect that is non-interacting.)
  const sprite = ladder.GetSprite();
  const filename = sprite.GetFilename();
  const animation = sprite.GetAnimation();
  const customLadder = spawnEffect(
    EffectVariant.LADDER,
    CUSTOM_SECRET_SHOP_LADDER_SUB_TYPE,
    ladder.Position,
  );
  const customSprite = customLadder.GetSprite();
  customSprite.Load(filename, true);
  customSprite.Play(animation, true);
}

function checkEnteringCrawlSpace() {
  if (!inCrawlSpace()) {
    return;
  }

  if (!v.level.crawlSpace.amEntering) {
    return;
  }
  v.level.crawlSpace.amEntering = false;

  // When a player manually teleports into a crawl space, they will not consistently be placed at
  // the top of the ladder. Thus, manually moving the player to the top of the ladder every time
  // they enter a crawl space.
  movePlayersAndFamiliars(TOP_OF_LADDER_POSITION);
  log(
    "Manually repositioned a player to the top of the ladder after returning to a crawl space after a Black Market.",
  );
}

function checkExitingCrawlSpace() {
  if (!v.level.crawlSpace.amExiting) {
    return;
  }
  v.level.crawlSpace.amExiting = false;

  if (v.level.crawlSpace.returnRoomPosition !== null) {
    movePlayersAndFamiliars(v.level.crawlSpace.returnRoomPosition);
  }

  // Since the player was manually moved, the crawlspace could have spawned in an open state.
  // Account for this by manually setting every crawl space to be closed.
  const crawlSpaces = getCrawlSpaces();
  for (const crawlSpace of crawlSpaces) {
    fastTravelEntityClose(crawlSpace, FAST_TRAVEL_ENTITY_TYPE);
  }
}

function checkPostRoomTransitionSubvert() {
  const room = game.GetRoom();

  // If we subverted the room transition for a room outside of the grid, we might not end up in a
  // spot where the player expects. So, move to the most logical position.
  const direction = v.level.crawlSpace.subvertedRoomTransitionDirection;
  if (direction === Direction.NO_DIRECTION) {
    return;
  }

  const roomShape = room.GetRoomShape();
  if (roomShape !== RoomShape.SHAPE_1x1) {
    return;
  }

  const gridPosition = ONE_BY_ONE_ROOM_ENTER_MAP.get(direction);
  if (gridPosition === undefined) {
    return;
  }

  const player = Isaac.GetPlayer();
  player.Position = room.GetGridPosition(gridPosition);
  v.level.crawlSpace.subvertedRoomTransitionDirection = Direction.NO_DIRECTION;
  log(
    "Changed the player's position after subverting the room transition animation for a room outside of the grid.",
  );
}

// ModCallbackCustom.POST_PEFFECT_UPDATE_REORDERED
export function crawlSpacePostPEffectUpdateReordered(
  player: EntityPlayer,
): void {
  if (v.room.amChangingRooms) {
    return;
  }

  checkMovedAwayFromSecretShopLadder(player);
  checkTouchingLadderExitTile(player);
  checkExitSoftlock(player);
}

function checkMovedAwayFromSecretShopLadder(player: EntityPlayer) {
  if (!inSecretShop()) {
    return;
  }

  const room = game.GetRoom();
  const ladderPosition = room.GetGridPosition(GRID_INDEX_SECRET_SHOP_LADDER);
  if (player.Position.Distance(ladderPosition) > DISTANCE_OF_GRID_TILE) {
    v.room.movedAwayFromSecretShopLadder = true;
  }
}

function checkTouchingLadderExitTile(player: EntityPlayer) {
  if (!inCrawlSpace() && !inSecretShop()) {
    return;
  }

  if (inSecretShop() && !v.room.movedAwayFromSecretShopLadder) {
    return;
  }

  if (!playerIsTouchingExitTile(player)) {
    return;
  }

  const level = game.GetLevel();
  const startingRoomGridIndex = level.GetStartingRoomIndex();

  v.room.amChangingRooms = true;
  v.level.crawlSpace.amExiting = true;

  const returnRoomGridIndex =
    v.level.crawlSpace.returnRoomGridIndex === null
      ? startingRoomGridIndex
      : v.level.crawlSpace.returnRoomGridIndex;

  teleport(returnRoomGridIndex, Direction.UP, RoomTransitionAnim.WALK);
}

function playerIsTouchingExitTile(player: EntityPlayer) {
  const room = game.GetRoom();

  // First, handle the special case of being in a secret shop, where you exit from the top right
  // corner of the room.
  if (inSecretShop()) {
    const ladderPosition = room.GetGridPosition(GRID_INDEX_SECRET_SHOP_LADDER);
    return (
      // The vanilla hitbox seems to be half of a grid square. (We do not have to worry about
      // colliding with the vanilla hitbox because it no longer exists once we have removed the
      // vanilla ladder effect.)
      player.Position.Distance(ladderPosition) < DISTANCE_OF_GRID_TILE * 0.5
    );
  }

  // Handle the case of being in a normal crawlspace, where you exit from the top left corner of the
  // room.
  const gridIndexOfPlayer = room.GetGridIndex(player.Position);
  return gridIndexOfPlayer === GRID_INDEX_TOP_OF_CRAWLSPACE_LADDER;
}

/**
 * By default, if you return from a crawl space to a room outside of the grid (e.g. the Boss Rush),
 * leaving the room will cause you to go back to the crawl space again (because the game is
 * programmed to send you to the previous room).
 *
 * Fix this by checking to see if the player is about to touch a loading zone and if so, subvert
 * their interaction.
 */
function checkExitSoftlock(player: EntityPlayer) {
  const level = game.GetLevel();
  const previousRoomGridIndex = level.GetPreviousRoomIndex(); // We need the unsafe version here.
  const room = game.GetRoom();
  const roomType = room.GetType();

  if (
    previousRoomGridIndex !== asNumber(GridRoom.DUNGEON) ||
    v.level.crawlSpace.previousReturnRoomGridIndex === null
  ) {
    return;
  }

  const direction = getExitDirection(roomType, player);
  if (direction !== undefined) {
    v.level.crawlSpace.subvertedRoomTransitionDirection = direction;
    v.room.amChangingRooms = true;
    teleport(
      v.level.crawlSpace.previousReturnRoomGridIndex,
      direction,
      RoomTransitionAnim.WALK,
    );
    log(
      "Subverted exiting a room outside of the grid to avoid a crawl-space-related softlock.",
    );
  }
}

function getExitDirection(
  roomType: RoomType,
  player: EntityPlayer,
): Direction | undefined {
  const room = game.GetRoom();
  const playerGridIndex = room.GetGridIndex(player.Position);

  switch (roomType) {
    case RoomType.DEVIL:
    case RoomType.ANGEL: {
      return DEVIL_ANGEL_EXIT_MAP.get(playerGridIndex);
    }

    case RoomType.BOSS_RUSH: {
      return BOSS_RUSH_EXIT_MAP.get(playerGridIndex);
    }

    default: {
      return undefined;
    }
  }
}
