import {
  GameStateFlag,
  GridRoom,
  LevelStage,
  RoomType,
  SeedEffect,
  TrapdoorState,
} from "isaac-typescript-definitions";
import {
  getRoomGridIndex,
  isPostBossVoidPortal,
  log,
  onRepentanceStage,
  onSheol,
  removeGrid,
} from "isaacscript-common";
import { FastTravelEntityType } from "../../../../enums/FastTravelEntityType";
import { RaceGoal } from "../../../../enums/RaceGoal";
import { RacerStatus } from "../../../../enums/RacerStatus";
import { RaceStatus } from "../../../../enums/RaceStatus";
import g from "../../../../globals";
import { FAST_TRAVEL_DEBUG } from "./constants";
import * as fastTravel from "./fastTravel";
import { setFadingToBlack } from "./setNewState";
import * as state from "./state";
import v from "./v";

const FAST_TRAVEL_ENTITY_TYPE = FastTravelEntityType.TRAPDOOR;

// ModCallbackCustom.POST_GRID_ENTITY_INIT
// GridEntityType.TRAPDOOR (17)
export function postGridEntityInitTrapdoor(gridEntity: GridEntity): void {
  // In some situations, trapdoors should be removed entirely.
  if (shouldRemove()) {
    removeGrid(gridEntity);
    return;
  }

  if (shouldIgnore(gridEntity)) {
    return;
  }

  fastTravel.init(gridEntity, FAST_TRAVEL_ENTITY_TYPE, shouldSpawnOpen);
}

// ModCallbackCustom.POST_GRID_ENTITY_UPDATE
// GridEntityType.TRAPDOOR (17)
export function postGridEntityUpdateTrapdoor(gridEntity: GridEntity): void {
  if (shouldIgnore(gridEntity)) {
    return;
  }

  // Ensure that the fast-travel entity has been initialized.
  const gridIndex = gridEntity.GetGridIndex();
  const entry = v.room.trapdoors.get(gridIndex);
  if (entry === undefined) {
    return;
  }

  // Keep it closed on every frame so that we can implement our own custom functionality.
  gridEntity.State = TrapdoorState.CLOSED;

  fastTravel.checkShouldOpen(gridEntity, FAST_TRAVEL_ENTITY_TYPE);
  fastTravel.checkPlayerTouched(gridEntity, FAST_TRAVEL_ENTITY_TYPE, touched);
}

// ModCallbackCustom.POST_GRID_ENTITY_REMOVE
// GridEntityType.TRAPDOOR (17)
export function postGridEntityRemoveTrapdoor(gridIndex: int): void {
  state.deleteDescription(gridIndex, FAST_TRAVEL_ENTITY_TYPE);
}

function shouldIgnore(gridEntity: GridEntity) {
  const stage = g.l.GetStage();
  const repentanceStage = onRepentanceStage();

  if (isPostBossVoidPortal(gridEntity)) {
    return true;
  }

  // There is no way to manually travel to the "Infinite Basements" Easter Egg floors, so just
  // disable the fast-travel feature if this is the case.
  if (g.seeds.HasSeedEffect(SeedEffect.INFINITE_BASEMENT)) {
    return true;
  }

  // Don't replace the trap door that leads to Mother.
  if (stage === LevelStage.WOMB_2 && repentanceStage) {
    return true;
  }

  return false;
}

function shouldRemove() {
  const gameFrameCount = g.g.GetFrameCount();
  const mausoleumHeartKilled = g.g.GetStateFlag(
    GameStateFlag.MAUSOLEUM_HEART_KILLED,
  );
  const backwardPath = g.g.GetStateFlag(GameStateFlag.BACKWARDS_PATH);
  const stage = g.l.GetStage();
  const roomType = g.r.GetType();
  const roomGridIndex = getRoomGridIndex();
  const repentanceStage = onRepentanceStage();

  // If the goal of the race is the Boss Rush, delete any Womb trapdoors on Depths 2.
  if (
    g.race.status === RaceStatus.IN_PROGRESS &&
    g.race.myStatus === RacerStatus.RACING &&
    g.race.goal === RaceGoal.BOSS_RUSH &&
    stage === LevelStage.DEPTHS_2
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
    stage === LevelStage.WOMB_2 &&
    roomGridIndex !== (GridRoom.BLUE_WOMB as int)
  ) {
    log(
      `Removed a vanilla trapdoor after Mom on game frame: ${gameFrameCount}`,
    );
    return true;
  }

  // If the goal of the race is Hush, delete the trapdoor that spawns after Hush.
  if (
    g.race.status === RaceStatus.IN_PROGRESS &&
    g.race.myStatus === RacerStatus.RACING &&
    g.race.goal === RaceGoal.HUSH &&
    stage === LevelStage.BLUE_WOMB &&
    roomGridIndex !== (GridRoom.THE_VOID as int)
  ) {
    log(
      `Removed a vanilla trapdoor after Hush (for a Hush goal) on game frame: ${gameFrameCount}`,
    );
    return true;
  }

  // If the goal of the race is Mother, remove trapdoors after bosses on most floors. (But leave
  // trapdoors created by shovels and in I AM ERROR rooms.)
  if (
    g.race.status === RaceStatus.IN_PROGRESS &&
    g.race.myStatus === RacerStatus.RACING &&
    g.race.goal === RaceGoal.MOTHER &&
    roomType === RoomType.BOSS
  ) {
    if (
      (stage === LevelStage.BASEMENT_1 ||
        stage === LevelStage.BASEMENT_2 ||
        stage === LevelStage.CAVES_1 ||
        stage === LevelStage.CAVES_2 ||
        stage === LevelStage.DEPTHS_1) &&
      !repentanceStage
    ) {
      log(
        `Removed a vanilla trapdoor after a boss on non-Repentance stage ${stage} (for a Mother goal) on game frame: ${gameFrameCount}`,
      );
      return true;
    }

    if (
      (stage === LevelStage.BASEMENT_2 || stage === LevelStage.CAVES_2) &&
      repentanceStage
    ) {
      log(
        `Removed a vanilla trapdoor after a boss on an even Repentance stage (for a Mother goal) on game frame: ${gameFrameCount}`,
      );
      return true;
    }

    if (
      stage === LevelStage.DEPTHS_2 &&
      repentanceStage &&
      !mausoleumHeartKilled
    ) {
      log(
        `Removed a vanilla trapdoor after a boss on an even Repentance stage (for a Mother goal) on game frame: ${gameFrameCount}`,
      );
      return true;
    }
  }

  // Delete the trapdoors on the Ascent. (In vanilla, they stay closed, but instead of emulating
  // this functionality it is simpler to delete them.)
  if (
    stage < LevelStage.WOMB_1 &&
    backwardPath &&
    roomGridIndex !== (GridRoom.SECRET_EXIT as int)
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
    // player has to defeat the enemies first before using the trapdoor.
    if (!roomClear) {
      return false;
    }

    // If we just entered a new room that is already cleared, spawn the trapdoor closed if we are
    // standing close to it, and open otherwise.
    return state.shouldOpen(entity, FAST_TRAVEL_ENTITY_TYPE);
  }

  // After defeating Satan, the trapdoor should always spawn open (because there is no reason to
  // remain in Sheol).
  if (onSheol()) {
    return true;
  }

  // Trapdoors created after a room has already initialized should spawn closed by default:
  // - Trapdoors created after bosses should spawn closed so that players do not accidentally jump
  //   into them.
  // - Trapdoors created by We Need to Go Deeper should spawn closed because the player will be
  //   standing on top of them.
  return false;
}

function touched(entity: GridEntity | EntityEffect, player: EntityPlayer) {
  if (FAST_TRAVEL_DEBUG) {
    log("Touched a trapdoor.");
  }

  setFadingToBlack(player, entity.Position, false);
}
