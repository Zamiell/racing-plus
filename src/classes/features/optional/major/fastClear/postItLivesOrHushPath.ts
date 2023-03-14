import {
  EffectVariant,
  EntityType,
  GridEntityType,
  HeavenLightDoorSubType,
  LevelStage,
  RoomType,
  TrapdoorVariant,
} from "isaac-typescript-definitions";
import {
  doesEntityExist,
  game,
  getGridEntities,
  GRID_INDEX_CENTER_OF_1X1_ROOM,
  inRoomType,
  isRoomInsideGrid,
  log,
  onRepentanceStage,
  onStage,
  removeAllMatchingEntities,
  removeAllMatchingGridEntities,
  spawnEffect,
  spawnGridEntityWithVariant,
} from "isaacscript-common";
import { ItLivesSituation } from "../../../../../enums/ItLivesSituation";
import { RaceGoal } from "../../../../../enums/RaceGoal";
import { RacerStatus } from "../../../../../enums/RacerStatus";
import { RaceStatus } from "../../../../../enums/RaceStatus";
import { g } from "../../../../../globals";
import {
  inSpeedrun,
  onSeason,
  onSpeedrunWithDarkRoomGoal,
} from "../../../../../speedrun/utilsSpeedrun";
import { getPhotoStatus } from "../../../../../utils";
import { season3GetItLivesSituation } from "../../../speedrun/Season3";

/**
 * The trapdoor / heaven door positions after Hush are not in the center of the room; they are near
 * the top wall.
 */
const GRID_INDEX_CENTER_OF_HUSH_ROOM = 126;

// ModCallback.POST_NEW_ROOM (19)
export function postItLivesOrHushPathPostNewRoom(): void {
  checkItLivesWrongPath();
}

/**
 * Killing It Lives should always trigger fast-clear. If for some reason it does not, then the
 * correct path will never be spawned, and the player can be potentially soft-locked.
 *
 * Check for this situation and spawn the appropriate path if needed.
 */
function checkItLivesWrongPath() {
  const room = game.GetRoom();

  if (!inItLivesOrHushBossRoom()) {
    return;
  }

  const roomClear = room.IsClear();
  if (!roomClear) {
    return;
  }

  const situation = getItLivesSituation();
  const positionCenter = room.GetGridPosition(GRID_INDEX_CENTER_OF_1X1_ROOM);

  switch (situation) {
    case ItLivesSituation.NEITHER: {
      break;
    }

    case ItLivesSituation.HEAVEN_DOOR: {
      const heavenDoorsExist = doesEntityExist(
        EntityType.EFFECT,
        EffectVariant.HEAVEN_LIGHT_DOOR,
      );
      if (!heavenDoorsExist) {
        spawnHeavenDoor(positionCenter);
        log(
          "Manually spawned a heaven door to prevent a soft-lock. (It Lives must not have been killed with fast-clear.)",
        );
      }

      break;
    }

    case ItLivesSituation.TRAPDOOR: {
      const trapdoors = getGridEntities(GridEntityType.TRAPDOOR);
      if (trapdoors.length === 0) {
        spawnTrapdoor(positionCenter);
        log(
          "Manually spawned a trapdoor to prevent a soft-lock. (It Lives! must not have been killed with fast-clear.)",
        );
      }

      break;
    }

    case ItLivesSituation.BOTH: {
      // In vanilla, both paths appear by default, so we don't have to do anything. The exception is
      // if we are on a custom challenge that allows both paths, but ignore this edge-case.
      break;
    }
  }
}

/** Triggered when a room is fast-cleared. */
export function postItLivesOrHushPathPostFastClear(): void {
  if (inItLivesOrHushBossRoom()) {
    manuallySpawn();
  }
}

function inItLivesOrHushBossRoom() {
  return (
    onStage(LevelStage.WOMB_2, LevelStage.BLUE_WOMB) &&
    // Corpse does not have It Lives! / Hush.
    !onRepentanceStage() &&
    inRoomType(RoomType.BOSS) &&
    // If the player is fighting It Lives from a Reverse Emperor Card room, then the room will be
    // outside the grid. Paths are not supposed to spawn in this situation.
    isRoomInsideGrid()
  );
}

function manuallySpawn() {
  // First, remove any existing trapdoors or heaven doors. Afterward, we will respawn them in an
  // appropriate way.
  removeAllMatchingEntities(
    EntityType.EFFECT,
    EffectVariant.HEAVEN_LIGHT_DOOR,
    HeavenLightDoorSubType.HEAVEN_DOOR,
  );
  removeAllMatchingGridEntities(GridEntityType.TRAPDOOR);

  const situation = getItLivesSituation();
  doItLivesSituation(situation);
}

// Figure out if we need to spawn either a trapdoor, a heaven door, or both.
function getItLivesSituation(): ItLivesSituation {
  // Speedrun seasons have set goals.
  if (inSpeedrun()) {
    if (onSeason(3)) {
      return season3GetItLivesSituation();
    }

    const itLivesSituation = onSpeedrunWithDarkRoomGoal()
      ? ItLivesSituation.TRAPDOOR
      : ItLivesSituation.HEAVEN_DOOR;
    return itLivesSituation;
  }

  if (
    g.race.status === RaceStatus.IN_PROGRESS &&
    g.race.myStatus === RacerStatus.RACING
  ) {
    // - On races that have a specific direction, force that direction.
    // - On races that give the player an option between going up or down, intuit the desired
    //   direction from the Polaroid/Negative status.
    const itLivesSituationRace = getItLivesSituationRace(g.race.goal);
    if (itLivesSituationRace !== ItLivesSituation.BOTH) {
      return itLivesSituationRace;
    }
  }

  const { hasPolaroid, hasNegative } = getPhotoStatus();

  if (hasPolaroid && hasNegative) {
    // The player has both photos (which can occur if the player is Eden or is in a diversity race).
    // So, give the player a choice between the directions.
    return ItLivesSituation.BOTH;
  }

  if (hasPolaroid) {
    // The player has The Polaroid, so send them to Cathedral.
    return ItLivesSituation.HEAVEN_DOOR;
  }

  if (hasNegative) {
    // The player has The Negative, so send them to Sheol.
    return ItLivesSituation.TRAPDOOR;
  }

  // The player does not have either The Polaroid or The Negative, so give them a choice between the
  // directions.
  return ItLivesSituation.BOTH;
}

function getItLivesSituationRace(goal: RaceGoal): ItLivesSituation {
  switch (goal) {
    case RaceGoal.BLUE_BABY: {
      return ItLivesSituation.HEAVEN_DOOR;
    }

    case RaceGoal.THE_LAMB: {
      return ItLivesSituation.TRAPDOOR;
    }

    case RaceGoal.MEGA_SATAN:
    case RaceGoal.BOSS_RUSH:
    case RaceGoal.MOTHER:
    case RaceGoal.THE_BEAST:
    case RaceGoal.CUSTOM: {
      // Give the player a choice between the photos for races to alternate objectives.
      return ItLivesSituation.BOTH;
    }

    case RaceGoal.HUSH:
    case RaceGoal.DELIRIUM: {
      return ItLivesSituation.NEITHER;
    }
  }
}

function doItLivesSituation(situation: ItLivesSituation) {
  const gameFrameCount = game.GetFrameCount();
  const room = game.GetRoom();

  let positionCenter = room.GetGridPosition(GRID_INDEX_CENTER_OF_1X1_ROOM);
  let positionLeft = room.GetGridPosition(GRID_INDEX_CENTER_OF_1X1_ROOM - 1);
  let positionRight = room.GetGridPosition(GRID_INDEX_CENTER_OF_1X1_ROOM + 1);
  if (onStage(LevelStage.BLUE_WOMB)) {
    positionCenter = room.GetGridPosition(GRID_INDEX_CENTER_OF_HUSH_ROOM);
    positionLeft = room.GetGridPosition(GRID_INDEX_CENTER_OF_HUSH_ROOM - 1);
    positionRight = room.GetGridPosition(GRID_INDEX_CENTER_OF_HUSH_ROOM + 1);
  }

  switch (situation) {
    case ItLivesSituation.NEITHER: {
      log(
        `It Lives! or Hush killed on game frame ${gameFrameCount}; no paths will be spawned.`,
      );
      break;
    }

    case ItLivesSituation.HEAVEN_DOOR: {
      spawnHeavenDoor(positionCenter);
      log(
        `It Lives! or Hush killed on game frame ${gameFrameCount}; going up.`,
      );
      break;
    }

    case ItLivesSituation.TRAPDOOR: {
      spawnTrapdoor(positionCenter);
      log(
        `It Lives! or Hush killed on game frame ${gameFrameCount}; going down.`,
      );
      break;
    }

    case ItLivesSituation.BOTH: {
      spawnTrapdoor(positionLeft);
      spawnHeavenDoor(positionRight);
      log(
        `It Lives! or Hush killed on game frame ${gameFrameCount}; spawning both paths.`,
      );
      break;
    }
  }
}

function spawnHeavenDoor(position: Vector) {
  spawnEffect(
    EffectVariant.HEAVEN_LIGHT_DOOR,
    HeavenLightDoorSubType.HEAVEN_DOOR,
    position,
  );
}

function spawnTrapdoor(position: Vector) {
  const room = game.GetRoom();
  const gridIndex = room.GetGridIndex(position);
  spawnGridEntityWithVariant(
    GridEntityType.TRAPDOOR,
    TrapdoorVariant.NORMAL,
    gridIndex,
  );
}