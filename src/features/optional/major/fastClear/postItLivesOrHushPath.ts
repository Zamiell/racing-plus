import {
  countEntities,
  ensureAllCases,
  getGridEntities,
  GRID_INDEX_CENTER_OF_1X1_ROOM,
  isRoomInsideMap,
  log,
  removeAllMatchingEntities,
  removeAllMatchingGridEntities,
  spawnGridEntityWithVariant,
} from "isaacscript-common";
import g from "../../../../globals";
import { hasPolaroidOrNegative } from "../../../../utils";
import { RaceGoal } from "../../../race/types/RaceGoal";
import { RacerStatus } from "../../../race/types/RacerStatus";
import { RaceStatus } from "../../../race/types/RaceStatus";
import { speedrunGetCharacterNum } from "../../../speedrun/exported";
import {
  inSpeedrun,
  onSpeedrunWithDarkRoomGoal,
} from "../../../speedrun/speedrun";

enum ItLivesSituation {
  NEITHER,
  HEAVEN_DOOR,
  TRAPDOOR,
  BOTH,
}

// The trapdoor / heaven door positions after Hush are not in the center of the room;
// they are near the top wall
const GRID_INDEX_CENTER_OF_HUSH_ROOM = 126;

export function checkPostItLivesOrHushPath(): void {
  if (inItLivesOrHushBossRoom()) {
    manuallySpawn();
  }
}

function inItLivesOrHushBossRoom() {
  const stage = g.l.GetStage();
  const roomType = g.r.GetType();

  return (
    (stage === 8 || stage === 9) &&
    roomType === RoomType.ROOM_BOSS &&
    // If the player is fighting It Lives! from an Emperor? Card room,
    // then the room will be outside the grid
    // Paths are not supposed to spawn in this situation
    isRoomInsideMap()
  );
}

function manuallySpawn() {
  // First, remove any existing trapdoors or heaven doors;
  // afterward, we will respawn them in an appropriate way
  removeAllMatchingEntities(
    EntityType.ENTITY_EFFECT,
    EffectVariant.HEAVEN_LIGHT_DOOR,
    HeavenLightDoorSubType.HEAVEN_DOOR,
  );
  removeAllMatchingGridEntities(GridEntityType.GRID_TRAPDOOR);

  const situation = getItLivesSituation();
  doItLivesSituation(situation);
}

// Figure out if we need to spawn either a trapdoor, a heaven door, or both
function getItLivesSituation() {
  // Speedrun seasons have set goals
  if (inSpeedrun()) {
    const itLivesSituation = onSpeedrunWithDarkRoomGoal()
      ? ItLivesSituation.TRAPDOOR
      : ItLivesSituation.HEAVEN_DOOR;
    log(
      `Season 2 - It Lives! situation, character number: ${speedrunGetCharacterNum()}, situation: ${
        ItLivesSituation[itLivesSituation]
      } (${itLivesSituation})`,
    );
    return itLivesSituation;
  }

  if (
    g.race.status === RaceStatus.IN_PROGRESS &&
    g.race.myStatus === RacerStatus.RACING
  ) {
    // On races that have a specific direction, force that direction
    // On races that give the player an option between going up or down, intuit the desired
    // direction from the Polaroid/Negative status
    const itLivesSituationRace = getItLivesSituationRace(g.race.goal);
    if (itLivesSituationRace !== ItLivesSituation.BOTH) {
      return itLivesSituationRace;
    }
  }

  const [hasPolaroid, hasNegative] = hasPolaroidOrNegative();

  if (hasPolaroid && hasNegative) {
    // The player has both photos (which can occur if the player is Eden or is in a diversity race)
    // So, give the player a choice between the directions
    return ItLivesSituation.BOTH;
  }

  if (hasPolaroid) {
    // The player has The Polaroid, so send them to Cathedral
    return ItLivesSituation.HEAVEN_DOOR;
  }

  if (hasNegative) {
    // The player has The Negative, so send them to Sheol
    return ItLivesSituation.TRAPDOOR;
  }

  // The player does not have either The Polaroid or The Negative,
  // so give them a choice between the directions
  return ItLivesSituation.BOTH;
}

function getItLivesSituationRace(goal: RaceGoal) {
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
      // Give the player a choice between the photos for races to alternate objectives
      return ItLivesSituation.BOTH;
    }

    case RaceGoal.HUSH:
    case RaceGoal.DELIRIUM: {
      return ItLivesSituation.NEITHER;
    }

    default: {
      return ensureAllCases(goal);
    }
  }
}

function doItLivesSituation(situation: ItLivesSituation) {
  const gameFrameCount = g.g.GetFrameCount();
  const stage = g.l.GetStage();

  let positionCenter = g.r.GetGridPosition(GRID_INDEX_CENTER_OF_1X1_ROOM);
  let positionLeft = g.r.GetGridPosition(GRID_INDEX_CENTER_OF_1X1_ROOM - 1);
  let positionRight = g.r.GetGridPosition(GRID_INDEX_CENTER_OF_1X1_ROOM + 1);
  if (stage === 9) {
    positionCenter = g.r.GetGridPosition(GRID_INDEX_CENTER_OF_HUSH_ROOM);
    positionLeft = g.r.GetGridPosition(GRID_INDEX_CENTER_OF_HUSH_ROOM - 1);
    positionRight = g.r.GetGridPosition(GRID_INDEX_CENTER_OF_HUSH_ROOM + 1);
  }

  switch (situation) {
    case ItLivesSituation.NEITHER: {
      log(
        `It Lives! or Hush killed on game frame ${gameFrameCount}; no paths will be spawned.`,
      );
      return;
    }

    case ItLivesSituation.HEAVEN_DOOR: {
      spawnHeavenDoor(positionCenter);
      log(
        `It Lives! or Hush killed on game frame ${gameFrameCount}; going up.`,
      );
      return;
    }

    case ItLivesSituation.TRAPDOOR: {
      spawnTrapdoor(positionCenter);
      log(
        `It Lives! or Hush killed on game frame ${gameFrameCount}; going down.`,
      );
      return;
    }

    case ItLivesSituation.BOTH: {
      spawnTrapdoor(positionLeft);
      spawnHeavenDoor(positionRight);
      log(
        `It Lives! or Hush killed on game frame ${gameFrameCount}; spawning both paths.`,
      );
      return;
    }

    default: {
      ensureAllCases(situation);
    }
  }
}

function spawnHeavenDoor(position: Vector) {
  Isaac.Spawn(
    EntityType.ENTITY_EFFECT,
    EffectVariant.HEAVEN_LIGHT_DOOR,
    HeavenLightDoorSubType.HEAVEN_DOOR,
    position,
    Vector.Zero,
    undefined,
  );
}

function spawnTrapdoor(position: Vector) {
  const gridIndex = g.r.GetGridIndex(position);
  spawnGridEntityWithVariant(
    GridEntityType.GRID_TRAPDOOR,
    TrapdoorVariant.NORMAL,
    gridIndex,
  );
}

// ModCallbacks.MC_POST_NEW_ROOM (19)
export function postNewRoom(): void {
  checkItLivesWrongPath();
}

/**
 * Killing It Lives! should always trigger fast-clear. If for some reason it does not, then the
 * correct path will never be spawned, and the player can be potentially soft-locked.
 *
 * Check for this situation and spawn the appropriate path if needed.
 */
function checkItLivesWrongPath() {
  if (!inItLivesOrHushBossRoom()) {
    return;
  }

  const situation = getItLivesSituation();
  const positionCenter = g.r.GetGridPosition(GRID_INDEX_CENTER_OF_1X1_ROOM);

  switch (situation) {
    case ItLivesSituation.NEITHER: {
      return;
    }

    case ItLivesSituation.HEAVEN_DOOR: {
      const numHeavenDoors = countEntities(
        EntityType.ENTITY_EFFECT,
        EffectVariant.HEAVEN_LIGHT_DOOR,
      );
      if (numHeavenDoors === 0) {
        spawnHeavenDoor(positionCenter);
        log(
          "Manually spawned a heaven door to prevent a soft-lock. (It Lives! must not have been killed with fast-clear.)",
        );
      }

      return;
    }

    case ItLivesSituation.TRAPDOOR: {
      const trapdoors = getGridEntities(GridEntityType.GRID_TRAPDOOR);
      if (trapdoors.length === 0) {
        spawnTrapdoor(positionCenter);
        log(
          "Manually spawned a trapdoor to prevent a soft-lock. (It Lives! must not have been killed with fast-clear.)",
        );
      }

      return;
    }

    case ItLivesSituation.BOTH: {
      // In vanilla, both paths appear by default, so we don't have to do anything
      // The exception is if we are on a custom challenge that allows both paths,
      // but ignore this edge-case
      return;
    }

    default: {
      ensureAllCases(situation);
    }
  }
}
