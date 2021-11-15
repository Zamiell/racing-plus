import {
  getRoomIndex,
  log,
  onRepentanceStage,
  onSheol,
  removeGridEntity,
} from "isaacscript-common";
import g from "../../../../globals";
import { isPostBossVoidPortal } from "../../../../util";
import { RaceGoal } from "../../../race/types/RaceGoal";
import { RacerStatus } from "../../../race/types/RacerStatus";
import { RaceStatus } from "../../../race/types/RaceStatus";
import { FastTravelEntityType } from "./enums";
import * as fastTravel from "./fastTravel";
import { setFadingToBlack } from "./setNewState";
import * as state from "./state";
import v from "./v";

const FAST_TRAVEL_ENTITY_TYPE = FastTravelEntityType.TRAPDOOR;

// ModCallbacksCustom.MC_POST_GRID_ENTITY_INIT
// GridEntityType.GRID_TRAPDOOR (17)
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
// GridEntityType.GRID_TRAPDOOR (17)
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

  fastTravel.checkShouldOpen(gridEntity, FAST_TRAVEL_ENTITY_TYPE);
  fastTravel.checkPlayerTouched(gridEntity, FAST_TRAVEL_ENTITY_TYPE, touched);
}

// ModCallbacksCustom.MC_POST_GRID_ENTITY_REMOVE
// GridEntityType.GRID_TRAPDOOR (17)
export function postGridEntityRemoveTrapdoor(gridIndex: int): void {
  state.deleteDescription(gridIndex, FAST_TRAVEL_ENTITY_TYPE);
}

function shouldIgnore(gridEntity: GridEntity) {
  const stage = g.l.GetStage();
  const repentanceStage = onRepentanceStage();

  if (isPostBossVoidPortal(gridEntity)) {
    return true;
  }

  // There is no way to manually travel to the "Infinite Basements" Easter Egg floors,
  // so just disable the fast-travel feature if this is the case
  if (g.seeds.HasSeedEffect(SeedEffect.SEED_INFINITE_BASEMENT)) {
    return true;
  }

  // Don't replace the trap door that leads to Mother
  if (stage === 8 && repentanceStage) {
    return true;
  }

  return false;
}

function shouldRemove() {
  const gameFrameCount = g.g.GetFrameCount();
  const mausoleumHeartKilled = g.g.GetStateFlag(
    GameStateFlag.STATE_MAUSOLEUM_HEART_KILLED,
  );
  const backwardPath = g.g.GetStateFlag(GameStateFlag.STATE_BACKWARDS_PATH);
  const stage = g.l.GetStage();
  const roomType = g.r.GetType();
  const roomIndex = getRoomIndex();
  const repentanceStage = onRepentanceStage();

  // If the goal of the race is the Boss Rush, delete any Womb trapdoors on Depths 2
  if (
    g.race.status === RaceStatus.IN_PROGRESS &&
    g.race.myStatus === RacerStatus.RACING &&
    g.race.goal === RaceGoal.BOSS_RUSH &&
    stage === 6
  ) {
    log(
      `Removed a vanilla trapdoor on Depths 2 (for a Boss Rush goal) on game frame: ${gameFrameCount}`,
    );
    return true;
  }

  // If the goal of the race is Hush, delete the trapdoor that spawns after It Lives!
  if (
    g.race.status === RaceStatus.IN_PROGRESS &&
    g.race.myStatus === RacerStatus.RACING &&
    g.race.goal === RaceGoal.HUSH &&
    stage === 8 &&
    roomIndex !== GridRooms.ROOM_BLUE_WOOM_IDX
  ) {
    log(
      `Removed a vanilla trapdoor after Mom on game frame: ${gameFrameCount}`,
    );
    return true;
  }

  // If the goal of the race is Hush, delete the trapdoor that spawns after Hush
  if (
    g.race.status === RaceStatus.IN_PROGRESS &&
    g.race.myStatus === RacerStatus.RACING &&
    g.race.goal === RaceGoal.HUSH &&
    stage === 9 &&
    roomIndex !== GridRooms.ROOM_THE_VOID_IDX
  ) {
    log(
      `Removed a vanilla trapdoor after Hush (for a Hush goal) on game frame: ${gameFrameCount}`,
    );
    return true;
  }

  // If the goal of the race is Mother, remove trapdoors after bosses on most floors
  // (but leave trapdoors created by shovels and in I AM ERROR rooms)
  if (
    g.race.status === RaceStatus.IN_PROGRESS &&
    g.race.myStatus === RacerStatus.RACING &&
    g.race.goal === RaceGoal.MOTHER &&
    roomType === RoomType.ROOM_BOSS
  ) {
    if (
      (stage === 1 ||
        stage === 2 ||
        stage === 3 ||
        stage === 4 ||
        stage === 5) &&
      !repentanceStage
    ) {
      log(
        `Removed a vanilla trapdoor after a boss on non-Repentance stage ${stage} (for a Mother goal) on game frame: ${gameFrameCount}`,
      );
      return true;
    }

    if ((stage === 2 || stage === 4) && repentanceStage) {
      log(
        `Removed a vanilla trapdoor after a boss on an even Repentance stage (for a Mother goal) on game frame: ${gameFrameCount}`,
      );
      return true;
    }

    if (stage === 6 && repentanceStage && !mausoleumHeartKilled) {
      log(
        `Removed a vanilla trapdoor after a boss on an even Repentance stage (for a Mother goal) on game frame: ${gameFrameCount}`,
      );
      return true;
    }
  }

  // Delete the trapdoors on the Ascent
  // (in vanilla, they stay closed, but instead of emulating this functionality it is simpler to
  // delete them)
  if (
    stage < 7 &&
    backwardPath &&
    roomIndex !== GridRooms.ROOM_SECRET_EXIT_IDX
  ) {
    log(
      `Removed a vanilla trapdoor on the Ascent on game frame: ${gameFrameCount}`,
    );
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
  setFadingToBlack(player, entity.Position, false);
}
