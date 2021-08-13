import {
  getRoomIndex,
  log,
  onRepentanceStage,
  onSheol,
} from "isaacscript-common";
import g from "../../../../globals";
import { isPostBossVoidPortal } from "../../../../util";
import { removeGridEntity } from "../../../../utilGlobals";
import * as raceGoalConditions from "../../../race/goalConditions";
import { FastTravelEntityType } from "./enums";
import * as fastTravel from "./fastTravel";
import { setFadingToBlack } from "./setNewState";
import * as state from "./state";
import v from "./v";

const FAST_TRAVEL_ENTITY_TYPE = FastTravelEntityType.Trapdoor;
const FRAME_DELAY_AFTER_KILLING_IT_LIVES = 11;
const FRAME_DELAY_AFTER_KILLING_HUSH = 12;

// ModCallbacksCustom.MC_POST_GRID_ENTITY_INIT
// GridEntityType.GRID_TRAPDOOR
export function postGridEntityInitTrapdoor(gridEntity: GridEntity): void {
  // In some situations, trapdoors should be removed entirely
  if (shouldRemove()) {
    removeGridEntity(gridEntity);
    return;
  }

  if (shouldIgnore(gridEntity)) {
    return;
  }

  fastTravel.init(gridEntity, FAST_TRAVEL_ENTITY_TYPE, shouldSpawnOpen);
}

// ModCallbacksCustom.MC_POST_GRID_ENTITY_UPDATE
// GridEntityType.GRID_TRAPDOOR
export function postGridEntityUpdateTrapdoor(gridEntity: GridEntity): void {
  if (shouldIgnore(gridEntity)) {
    return;
  }

  // Ensure that the fast-travel entity has been initialized
  const gridIndex = gridEntity.GetGridIndex();
  const entry = v.room.trapdoors.get(gridIndex);
  if (entry === undefined) {
    return;
  }

  // Keep it closed on every frame so that we can implement our own custom functionality
  gridEntity.State = TrapdoorState.CLOSED;

  checkDoubleTrapdoorOverlapBug(gridEntity);
  fastTravel.checkShouldOpen(gridEntity, FAST_TRAVEL_ENTITY_TYPE);
  fastTravel.checkPlayerTouched(gridEntity, FAST_TRAVEL_ENTITY_TYPE, touched);
}

// ModCallbacksCustom.MC_POST_GRID_ENTITY_REMOVE
// GridEntityType.GRID_TRAPDOOR
export function postGridEntityRemoveTrapdoor(gridIndex: int): void {
  state.deleteDescription(gridIndex, FAST_TRAVEL_ENTITY_TYPE);
}

function shouldIgnore(gridEntity: GridEntity) {
  const stage = g.l.GetStage();

  if (isPostBossVoidPortal(gridEntity)) {
    return true;
  }

  // There is no way to manually travel to the "Infinite Basements" Easter Egg floors,
  // so just disable the fast-travel feature if this is the case
  if (g.seeds.HasSeedEffect(SeedEffect.SEED_INFINITE_BASEMENT)) {
    return true;
  }

  // Don't replace the trap door that leads to Mother
  if (stage === 8 && onRepentanceStage()) {
    return true;
  }

  return false;
}

function shouldRemove() {
  const gameFrameCount = g.g.GetFrameCount();
  const stage = g.l.GetStage();
  const roomIndex = getRoomIndex();
  const roomType = g.r.GetType();
  const mausoleumHeartKilled = g.g.GetStateFlag(
    GameStateFlag.STATE_MAUSOLEUM_HEART_KILLED,
  );
  const isBackwardPath = g.g.GetStateFlag(GameStateFlag.STATE_BACKWARDS_PATH);
  const isValidMotherGoalRoom = raceGoalConditions.isValidMotherGoalRoom();
  const isValidBeastGoalRoom = raceGoalConditions.isValidBeastGoalRoom();

  // If a specific amount of frames have passed since killing It Lives!,
  // then delete the vanilla trapdoor (since we manually spawned one already)
  if (
    v.room.deletePaths &&
    v.room.itLivesKilledFrame !== null &&
    gameFrameCount ===
      v.room.itLivesKilledFrame + FRAME_DELAY_AFTER_KILLING_IT_LIVES
  ) {
    log("Removed a vanilla trapdoor after It Lives!");
    return true;
  }

  // If a specific amount of frames have passed since killing Hush,
  // then delete the vanilla trapdoor (since we manually spawned one already)
  if (
    v.room.deletePaths &&
    v.room.hushKilledFrame !== 0 &&
    gameFrameCount === v.room.hushKilledFrame + FRAME_DELAY_AFTER_KILLING_HUSH
  ) {
    log("Removed a vanilla trapdoor after Hush.");
    return true;
  }

  // If the goal of the race is the Boss Rush, delete the Womb trapdoor that spawns after Mom
  if (
    g.race.status === "in progress" &&
    g.race.myStatus === "racing" &&
    g.race.goal === "Boss Rush" &&
    stage === 6
  ) {
    log("Removed a vanilla trapdoor after Mom.");
    return true;
  }

  // If the goal of the race is Hush, delete the trapdoor that spawns after It Lives!
  if (
    g.race.status === "in progress" &&
    g.race.myStatus === "racing" &&
    g.race.goal === "Hush" &&
    stage === 8 &&
    roomIndex !== GridRooms.ROOM_BLUE_WOOM_IDX
  ) {
    log("Removed a vanilla trapdoor after Mom.");
    return true;
  }

  // If the goal of the race is Hush, delete the trapdoor that spawns after Hush
  if (
    g.race.status === "in progress" &&
    g.race.myStatus === "racing" &&
    g.race.goal === "Hush" &&
    stage === 9 &&
    roomIndex !== GridRooms.ROOM_THE_VOID_IDX
  ) {
    log("Removed a vanilla trapdoor after It Lives! (for a Hush goal).");
    return true;
  }

  // If the goal of the race is Mother, remove trapdoors on odd floors
  // (i.e. trapdoors that go to non-Repentance floors)
  // But make an exception for I AM ERROR rooms to prevent softlocks
  if (
    g.race.status === "in progress" &&
    g.race.myStatus === "racing" &&
    g.race.goal === "Mother"
  ) {
    // Basement 1 --> Downpour 1
    if (stage === 1 && !onRepentanceStage() && !isValidMotherGoalRoom) {
      log("Removed a vanilla trapdoor on Basement 1 (for a Mother goal).");
      return true;
    }

    // Downpour 2 --> Mines 1
    if (stage === 2 && onRepentanceStage() && !isValidMotherGoalRoom) {
      log("Removed a vanilla trapdoor on Downpour 2 (for a Mother goal).");
      return true;
    }

    // Mines 2 --> Mausoleum 1
    if (stage === 4 && onRepentanceStage() && !isValidMotherGoalRoom) {
      log("Removed a vanilla trapdoor on Mines 2 (for a Mother goal).");
      return true;
    }

    // Mausoleum 2 --> Corpse 1
    if (
      stage === 6 &&
      onRepentanceStage() &&
      !mausoleumHeartKilled &&
      roomType !== RoomType.ROOM_ERROR &&
      roomType !== RoomType.ROOM_BLACK_MARKET
    ) {
      log("Removed a vanilla trapdoor on Mausoleum 2 (for a Mother goal).");
      return true;
    }
  }

  // If the goal of the race is The Beast, delete trapdoors spawned with We Need To Go Deeper!
  if (
    g.race.status === "in progress" &&
    g.race.myStatus === "racing" &&
    g.race.goal === "The Beast" &&
    stage === 6 &&
    !isValidBeastGoalRoom
  ) {
    log("Removed a vanilla trapdoor on Depths 2 (for The Beast goal).");
    return true;
  }

  // Delete the trapdoors on the Ascent
  // There are some cases when trapdoors still appear, like double troubles
  if (
    stage < 7 &&
    isBackwardPath &&
    roomIndex !== GridRooms.ROOM_SECRET_EXIT_IDX
  ) {
    log("Removed a vanilla trapdoor on the Ascent.");
    return true;
  }

  return false;
}

function shouldSpawnOpen(entity: GridEntity | EntityEffect) {
  const roomFrameCount = g.r.GetFrameCount();
  const roomClear = g.r.IsClear();

  if (roomFrameCount === 0) {
    // If we just entered a new room with enemies in it, spawn the trapdoor closed so that the
    // player has to defeat the enemies first before using the trapdoor
    if (!roomClear) {
      return false;
    }

    // If we just entered a new room that is already cleared,
    // spawn the trapdoor closed if we are standing close to it, and open otherwise
    return state.shouldOpen(entity, FAST_TRAVEL_ENTITY_TYPE);
  }

  // After defeating Satan, the trapdoor should always spawn open
  // (because there is no reason to remain in Sheol)
  if (onSheol()) {
    return true;
  }

  // Trapdoors created after a room has already initialized should spawn closed by default
  // e.g. trapdoors created after bosses should spawn closed so that players do not accidentally
  // jump into them
  // e.g. trapdoors created by We Need to Go Deeper! should spawn closed because the player will
  // be standing on top of them
  return false;
}

function touched(entity: GridEntity | EntityEffect, player: EntityPlayer) {
  setFadingToBlack(entity, player, false);
}

// If we manually spawn a trapdoor on the same square that a vanilla trapdoor spawns after defeating
// It Lives! or Hush, then the manually spawned trapdoor will get overwritten by the vanilla one
// In this case, the PostGridEntityInit callback will never fire (because the same grid entity type
// continually exists on every frame), so the trapdoor will never be initialized
// Manually initialize the grid entity if this is the case
function checkDoubleTrapdoorOverlapBug(gridEntity: GridEntity) {
  const gameFrameCount = g.g.GetFrameCount();

  if (
    v.room.deletePaths &&
    v.room.itLivesKilledFrame !== null &&
    gameFrameCount ===
      v.room.itLivesKilledFrame + FRAME_DELAY_AFTER_KILLING_IT_LIVES
  ) {
    log(
      `Re-initializing a ${FastTravelEntityType[FAST_TRAVEL_ENTITY_TYPE]} after killing It Lives!`,
    );
    fastTravel.init(gridEntity, FAST_TRAVEL_ENTITY_TYPE, shouldSpawnOpen);
  }

  if (
    v.room.deletePaths &&
    v.room.hushKilledFrame !== 0 &&
    gameFrameCount === v.room.hushKilledFrame + FRAME_DELAY_AFTER_KILLING_HUSH
  ) {
    log(
      `Re-initializing a ${FastTravelEntityType[FAST_TRAVEL_ENTITY_TYPE]} after killing Hush.`,
    );
    fastTravel.init(gridEntity, FAST_TRAVEL_ENTITY_TYPE, shouldSpawnOpen);
  }
}
