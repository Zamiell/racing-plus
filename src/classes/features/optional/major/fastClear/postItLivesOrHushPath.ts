import {
  EffectVariant,
  EntityType,
  GridEntityType,
  HeavenLightDoorSubType,
  LevelStage,
  RoomType,
} from "isaac-typescript-definitions";
import {
  GRID_INDEX_CENTER_OF_1X1_ROOM,
  VectorZero,
  doesEntityExist,
  doesGridEntityExist,
  game,
  inRoomType,
  isRoomInsideGrid,
  log,
  onRepentanceStage,
  onStage,
  removeAllMatchingEntities,
  removeAllMatchingGridEntities,
  spawnEffect,
  spawnGridEntity,
} from "isaacscript-common";
import { ItLivesSituation } from "../../../../../enums/ItLivesSituation";
import { RaceGoal } from "../../../../../enums/RaceGoal";
import { RaceStatus } from "../../../../../enums/RaceStatus";
import { RacerStatus } from "../../../../../enums/RacerStatus";
import { g } from "../../../../../globals";
import {
  inSpeedrun,
  onSeason,
  onSpeedrunWithDarkRoomGoal,
} from "../../../../../speedrun/utilsSpeedrun";
import { getPlayerPhotoStatus } from "../../../../../utils";
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
  if (!inItLivesOrHushBossRoom()) {
    return;
  }

  const room = game.GetRoom();
  const roomClear = room.IsClear();

  if (!roomClear) {
    return;
  }

  const situation = getItLivesSituation();
  const positionCenter = room.GetGridPosition(GRID_INDEX_CENTER_OF_1X1_ROOM);
  const positionLeft = room.GetGridPosition(GRID_INDEX_CENTER_OF_1X1_ROOM - 1);
  const positionRight = room.GetGridPosition(GRID_INDEX_CENTER_OF_1X1_ROOM + 1);

  switch (situation) {
    case ItLivesSituation.NEITHER: {
      break;
    }

    case ItLivesSituation.HEAVEN_DOOR: {
      spawnHeavenDoorIfNotExists(positionCenter);
      break;
    }

    case ItLivesSituation.TRAPDOOR: {
      spawnTrapdoorIfNotExists(positionCenter);
      break;
    }

    case ItLivesSituation.BOTH: {
      spawnTrapdoorIfNotExists(positionLeft);
      spawnHeavenDoorIfNotExists(positionRight);
      break;
    }
  }
}

function spawnHeavenDoorIfNotExists(position: Vector) {
  const heavenDoorsExist = doesEntityExist(
    EntityType.EFFECT,
    EffectVariant.HEAVEN_LIGHT_DOOR,
  );
  if (heavenDoorsExist) {
    return;
  }

  spawnHeavenDoor(position);
  log(
    "Manually spawned a heaven door to prevent a soft-lock. (It Lives must not have been killed with fast-clear.)",
  );
}

function spawnTrapdoorIfNotExists(position: Vector) {
  const trapdoorsExist = doesGridEntityExist(GridEntityType.TRAPDOOR);
  if (trapdoorsExist) {
    return;
  }

  spawnTrapdoor(position);
  log(
    "Manually spawned a trapdoor to prevent a soft-lock. (It Lives! must not have been killed with fast-clear.)",
  );
}

/**
 * This cannot be in the `PRE_SPAWN_CLEAR_AWARD` callback because the trapdoor and the heaven door
 * are not yet spawned at that point.
 */
export function postItLivesOrHushPathPostFastClear(): void {
  if (inItLivesOrHushBossRoom()) {
    manuallySpawn();
  }
}

function inItLivesOrHushBossRoom() {
  return (
    onStage(LevelStage.WOMB_2, LevelStage.BLUE_WOMB)
    // Corpse does not have It Lives! / Hush.
    && !onRepentanceStage()
    && inRoomType(RoomType.BOSS)
    // If the player is fighting It Lives from a Reverse Emperor Card room, then the room will be
    // outside the grid. Paths are not supposed to spawn in this situation.
    && isRoomInsideGrid()
  );
}

function manuallySpawn() {
  // First, remove any existing trapdoors or heaven doors. Afterward, we will respawn them in an
  // appropriate way.
  removeAllMatchingEntities(EntityType.EFFECT, EffectVariant.HEAVEN_LIGHT_DOOR);
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

    return onSpeedrunWithDarkRoomGoal()
      ? ItLivesSituation.TRAPDOOR
      : ItLivesSituation.HEAVEN_DOOR;
  }

  if (
    g.race.status === RaceStatus.IN_PROGRESS
    && g.race.myStatus === RacerStatus.RACING
  ) {
    // - On races that have a specific direction, force that direction.
    // - On races that give the player an option between going up or down, intuit the desired
    //   direction from the Polaroid/Negative status.
    const itLivesSituationRace = getItLivesSituationRace(g.race.goal);
    if (itLivesSituationRace !== ItLivesSituation.BOTH) {
      return itLivesSituationRace;
    }
  }

  const { hasPolaroid, hasNegative } = getPlayerPhotoStatus();

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
        `It Lives or Hush killed on game frame ${gameFrameCount}; no paths will be spawned.`,
      );
      break;
    }

    case ItLivesSituation.HEAVEN_DOOR: {
      spawnHeavenDoor(positionCenter);
      log(`It Lives or Hush killed on game frame ${gameFrameCount}; going up.`);
      break;
    }

    case ItLivesSituation.TRAPDOOR: {
      spawnTrapdoor(positionCenter);
      log(
        `It Lives or Hush killed on game frame ${gameFrameCount}; going down.`,
      );
      break;
    }

    case ItLivesSituation.BOTH: {
      spawnTrapdoor(positionLeft);
      spawnHeavenDoor(positionRight);
      log(
        `It Lives or Hush killed on game frame ${gameFrameCount}; spawning both paths.`,
      );
      break;
    }
  }
}

/**
 * We spawn all heaven doors using the player as a spawner to distinguish between vanilla heaven
 * doors and custom heaven doors.
 */
function spawnHeavenDoor(position: Vector) {
  const player = Isaac.GetPlayer();
  spawnEffect(
    EffectVariant.HEAVEN_LIGHT_DOOR,
    HeavenLightDoorSubType.HEAVEN_DOOR,
    position,
    VectorZero,
    player,
  );
}

function spawnTrapdoor(position: Vector) {
  spawnGridEntity(GridEntityType.TRAPDOOR, position);
}
