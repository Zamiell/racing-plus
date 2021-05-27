import g from "../../../../globals";
import {
  anyPlayerCloserThan,
  getRoomIndex,
  log,
  movePlayersAndFamiliars,
  teleport,
} from "../../../../misc";
import { EffectVariantCustom } from "../../../../types/enums";
import { TRAPDOOR_OPEN_DISTANCE } from "./constants";
import * as fastTravel from "./fastTravel";

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

export function postGridEntityUpdateCrawlspace(
  gridEntity: GridEntity,
  gridIndex: int,
): void {
  replace(gridEntity, gridIndex);
}

function replace(gridEntity: GridEntity, gridIndex: int) {
  const roomIndex = getRoomIndex();

  // Remove the original entity
  g.r.RemoveGridEntity(gridIndex, 0, false); // entity.Destroy() does not work

  // Spawn a custom entity to emulate the original
  fastTravel.spawn(
    EffectVariantCustom.CRAWLSPACE_FAST_TRAVEL,
    gridEntity.Position,
    shouldSpawnOpen,
  );

  // The custom entity will not respawn if we leave the room,
  // so we need to keep track of it for the remainder of the floor
  g.run.level.fastTravel.replacedCrawlspaces.push({
    room: roomIndex,
    position: gridEntity.Position,
  });
}

export function shouldSpawnOpen(crawlspaceEffect: EntityEffect): boolean {
  return !anyPlayerCloserThan(
    crawlspaceEffect.Position,
    TRAPDOOR_OPEN_DISTANCE,
  );
}

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
  const roomIndex = getRoomIndex();

  if (
    roomIndex === GridRooms.ROOM_DUNGEON_IDX &&
    // If we are returning from a Black Market, then being at the right-most door is the correct
    // position and we should not do anything further
    !g.run.level.fastTravel.crawlspace.blackMarket
  ) {
    movePlayersAndFamiliars(TOP_OF_LADDER_POSITION);
  }
}

function checkBlackMarket() {
  const roomIndex = getRoomIndex();
  g.run.level.fastTravel.crawlspace.blackMarket =
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
  const direction =
    g.run.level.fastTravel.crawlspace.subvertedRoomTransitionDirection;
  if (direction !== Direction.NO_DIRECTION) {
    const gridPosition = BOSS_ROOM_ENTER_MAP.get(direction);
    if (gridPosition !== undefined) {
      g.p.Position = g.r.GetGridPosition(gridPosition);
      g.run.level.fastTravel.crawlspace.subvertedRoomTransitionDirection =
        Direction.NO_DIRECTION;
      log(
        "Changed the player's position after subverting the room transition animation for a room outside of the grid.",
      );
    }
  }
}

// ModCallbacks.MC_POST_EFFECT_UPDATE (55)
export function postEffectUpdateCrawlspace(effect: EntityEffect): void {
  fastTravel.checkShouldOpen(effect);
  fastTravel.checkPlayerTouched(effect, touched);
}

function touched(effect: EntityEffect) {
  const roomIndex = getRoomIndex();
  const previousRoomIndex = g.l.GetPreviousRoomIndex();

  // If we return to a room outside of the grid from a crawlspace,
  // the previous room index will be the crawlspace
  // We need to preserve the room index of the last non-negative room
  const previousRoomIndexToUse =
    g.run.level.fastTravel.crawlspace.previousRoomIndex === null
      ? previousRoomIndex
      : g.run.level.fastTravel.crawlspace.previousRoomIndex;

  // Save the previous room information so that we can return there after exiting the crawlspace
  // (for the special case where we return to a room outside of the grid)
  g.run.level.fastTravel.crawlspace.previousRoomIndex = previousRoomIndexToUse;

  // Vanilla crawlspaces uses these variables to return the player to the previous room
  // Even though we are re-implementing crawlspaces, we will use the same variables
  g.l.DungeonReturnRoomIndex = roomIndex;
  g.l.DungeonReturnPosition = effect.Position;

  // Go to the crawlspace
  Isaac.DebugString("DEBUG - TELEPORTING");
  teleport(GridRooms.ROOM_DUNGEON_IDX, Direction.DOWN, RoomTransitionAnim.WALK);
}

// ModCallbacks.MC_POST_PLAYER_UPDATE (31)
export function postPlayerUpdate(player: EntityPlayer): void {
  if (g.run.room.fastTravel.crawlspace.amTeleporting) {
    return;
  }

  checkTopOfCrawlspaceLadder(player);
  checkExitSoftlock(player);
}

export function checkTopOfCrawlspaceLadder(player: EntityPlayer): void {
  const roomType = g.r.GetType();
  const playerGridIndex = g.r.GetGridIndex(player.Position);

  if (
    roomType === RoomType.ROOM_DUNGEON &&
    playerGridIndex === GRID_INDEX_OF_TOP_OF_LADDER
  ) {
    g.run.room.fastTravel.crawlspace.amTeleporting = true;
    teleport(g.l.DungeonReturnRoomIndex, Direction.UP, RoomTransitionAnim.WALK);
  }
}

export function checkExitSoftlock(player: EntityPlayer): void {
  // By default, if you return from a crawlspace to a room outside of the grid (e.g. the Boss Rush),
  // then leaving the room will cause you to go back to the crawlspace again
  // (because the game is programmed to send you to the previous room)
  // Fix this by checking to see if the player is about to touch a loading zone and if so,
  // subvert their interaction
  const previousRoomIndex = g.l.GetPreviousRoomIndex(); // We need the unsafe version here
  const roomType = g.r.GetType();

  if (
    previousRoomIndex !== GridRooms.ROOM_DUNGEON_IDX ||
    g.run.level.fastTravel.crawlspace.previousRoomIndex === null
  ) {
    return;
  }

  const direction = getExitDirection(roomType, player);
  if (direction !== undefined) {
    g.run.level.fastTravel.crawlspace.subvertedRoomTransitionDirection =
      direction;
    g.run.room.fastTravel.crawlspace.amTeleporting = true;
    teleport(
      g.run.level.fastTravel.crawlspace.previousRoomIndex,
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
