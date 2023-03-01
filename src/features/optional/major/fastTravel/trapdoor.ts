import {
  GameStateFlag,
  GridRoom,
  LevelStage,
  RoomType,
  SeedEffect,
  TrapdoorState,
} from "isaac-typescript-definitions";
import {
  asNumber,
  game,
  getRoomGridIndex,
  inRoomType,
  inSecretExit,
  isPostBossVoidPortal,
  log,
  onRepentanceStage,
  onSheol,
  onStage,
  onStageOrLower,
  removeGridEntity,
} from "isaacscript-common";
import {
  season3HasOnlyBossRushLeft,
  season3HasOnlyHushLeft,
  season3HasOnlyMotherLeft,
} from "../../../../classes/features/speedrun/season3/v";
import { FastTravelEntityType } from "../../../../enums/FastTravelEntityType";
import { RaceGoal } from "../../../../enums/RaceGoal";
import { RacerStatus } from "../../../../enums/RacerStatus";
import { RaceStatus } from "../../../../enums/RaceStatus";
import { g } from "../../../../globals";
import { onSeason } from "../../../../speedrun/utilsSpeedrun";
import { FAST_TRAVEL_DEBUG } from "./constants";
import * as fastTravel from "./fastTravel";
import { setFadingToBlack } from "./setNewState";
import * as state from "./state";
import { v } from "./v";

const FAST_TRAVEL_ENTITY_TYPE = FastTravelEntityType.TRAPDOOR;

// ModCallbackCustom.POST_GRID_ENTITY_INIT
// GridEntityType.TRAPDOOR (17)
export function postGridEntityInitTrapdoor(gridEntity: GridEntity): void {
  // In some situations, trapdoors should be removed entirely.
  if (shouldRemove()) {
    removeGridEntity(gridEntity, false);
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
  const seeds = game.GetSeeds();
  const repentanceStage = onRepentanceStage();

  if (isPostBossVoidPortal(gridEntity)) {
    return true;
  }

  // There is no way to manually travel to the "Infinite Basements" Easter Egg floors, so just
  // disable the fast-travel feature if this is the case.
  if (seeds.HasSeedEffect(SeedEffect.INFINITE_BASEMENT)) {
    return true;
  }

  // Don't replace the trap door that leads to Mother.
  if (onStage(LevelStage.WOMB_2) && repentanceStage) {
    return true;
  }

  return false;
}

function shouldRemove() {
  const gameFrameCount = game.GetFrameCount();
  const mausoleumHeartKilled = game.GetStateFlag(
    GameStateFlag.MAUSOLEUM_HEART_KILLED,
  );
  const backwardPath = game.GetStateFlag(GameStateFlag.BACKWARDS_PATH);
  const level = game.GetLevel();
  const stage = level.GetStage();
  const roomGridIndex = getRoomGridIndex();
  const repentanceStage = onRepentanceStage();
  const secretExit = inSecretExit();

  // If the goal of the race/speedrun is the Boss Rush, delete any Womb trapdoors on Depths 2.
  if (
    g.race.status === RaceStatus.IN_PROGRESS &&
    g.race.myStatus === RacerStatus.RACING &&
    g.race.goal === RaceGoal.BOSS_RUSH &&
    onStage(LevelStage.DEPTHS_2)
  ) {
    log(
      `Removed a vanilla trapdoor on Depths 2 (for a race Boss Rush goal) on game frame: ${gameFrameCount}`,
    );
    return true;
  }

  if (
    onSeason(3) &&
    season3HasOnlyBossRushLeft() &&
    onStage(LevelStage.DEPTHS_2)
  ) {
    log(
      `Removed a vanilla trapdoor on Depths 2 (for a Season 3 Boss Rush goal) on game frame: ${gameFrameCount}`,
    );
    return true;
  }

  // If the goal of the race/speedrun is Hush, delete the trapdoor that spawns after It Lives!
  if (
    g.race.status === RaceStatus.IN_PROGRESS &&
    g.race.myStatus === RacerStatus.RACING &&
    g.race.goal === RaceGoal.HUSH &&
    onStage(LevelStage.WOMB_2) &&
    roomGridIndex !== asNumber(GridRoom.BLUE_WOMB)
  ) {
    log(
      `Removed a vanilla trapdoor after Mom (for a race Hush goal) on game frame: ${gameFrameCount}`,
    );
    return true;
  }

  if (
    onSeason(3) &&
    season3HasOnlyHushLeft() &&
    onStage(LevelStage.WOMB_2) &&
    roomGridIndex !== asNumber(GridRoom.BLUE_WOMB)
  ) {
    log(
      `Removed a vanilla trapdoor after Mom (for a Season 3 Hush goal) on game frame: ${gameFrameCount}`,
    );
    return true;
  }

  // If the goal of the race is Hush, delete the trapdoor that spawns after Hush.
  if (
    g.race.status === RaceStatus.IN_PROGRESS &&
    g.race.myStatus === RacerStatus.RACING &&
    g.race.goal === RaceGoal.HUSH &&
    onStage(LevelStage.BLUE_WOMB) &&
    roomGridIndex !== asNumber(GridRoom.THE_VOID)
  ) {
    log(
      `Removed a vanilla trapdoor after Hush (for a race Hush goal) on game frame: ${gameFrameCount}`,
    );
    return true;
  }

  // If the goal of the race is Mother, remove trapdoors after bosses on most floors. (But leave
  // trapdoors created by shovels and in I AM ERROR rooms.)
  if (
    g.race.status === RaceStatus.IN_PROGRESS &&
    g.race.myStatus === RacerStatus.RACING &&
    g.race.goal === RaceGoal.MOTHER &&
    inRoomType(RoomType.BOSS)
  ) {
    if (onStageOrLower(LevelStage.DEPTHS_1) && !repentanceStage) {
      log(
        `Removed a vanilla trapdoor on non-Repentance stage ${stage} (for a race Mother goal) on game frame: ${gameFrameCount}`,
      );
      return true;
    }

    if (onStage(LevelStage.BASEMENT_2, LevelStage.CAVES_2) && repentanceStage) {
      log(
        `Removed a vanilla trapdoor Downpour/Dross or Mines/Ashpit (for a race Mother goal) on game frame: ${gameFrameCount}`,
      );
      return true;
    }

    if (
      onStage(LevelStage.DEPTHS_2) &&
      repentanceStage &&
      !mausoleumHeartKilled
    ) {
      log(
        `Removed a vanilla trapdoor on Mausoleum/Gehenna 2 (for a race Mother goal) on game frame: ${gameFrameCount}`,
      );
      return true;
    }
  }

  // In season 3, delete the trapdoors to the normal path when the only goal remaining is Mother.
  if (
    onSeason(3) &&
    season3HasOnlyMotherLeft() &&
    onStage(LevelStage.BASEMENT_2, LevelStage.CAVES_2) &&
    !inSecretExit()
  ) {
    log(
      `Removed a vanilla trapdoor (for a Season 3 Mother goal) on game frame: ${gameFrameCount}`,
    );
    return true;
  }

  // Delete the trapdoors on the Ascent. (In vanilla, they stay closed, but instead of emulating
  // this functionality it is simpler to delete them.)
  if (onStageOrLower(LevelStage.WOMB_1) && backwardPath && !secretExit) {
    log(
      `Removed a vanilla trapdoor on the Ascent on game frame: ${gameFrameCount}`,
    );
    return true;
  }

  return false;
}

function shouldSpawnOpen(entity: GridEntity | EntityEffect) {
  const room = game.GetRoom();
  const roomFrameCount = room.GetFrameCount();
  const roomClear = room.IsClear();

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
  if (roomFrameCount > 0) {
    return false;
  }

  // If we just entered a new room with enemies in it, spawn the trapdoor closed so that the player
  // has to defeat the enemies first before using the trapdoor.
  if (!roomClear) {
    return false;
  }

  // If we just entered a new room that is already cleared, spawn the trapdoor closed if we are
  // standing close to it, and open otherwise.
  return state.shouldOpen(entity, FAST_TRAVEL_ENTITY_TYPE);
}

function touched(entity: GridEntity | EntityEffect, player: EntityPlayer) {
  if (FAST_TRAVEL_DEBUG) {
    log("Touched a trapdoor.");
  }

  setFadingToBlack(player, entity.Position, false);
}
