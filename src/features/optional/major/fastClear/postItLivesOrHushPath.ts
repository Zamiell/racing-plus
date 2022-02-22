import {
  ensureAllCases,
  GRID_INDEX_CENTER_OF_1X1_ROOM,
  isOdd,
  isRoomInsideMap,
  log,
  removeAllMatchingEntities,
  removeAllMatchingGridEntities,
  spawnGridEntityWithVariant,
} from "isaacscript-common";
import g from "../../../../globals";
import { hasPolaroidOrNegative } from "../../../../util";
import { RaceGoal } from "../../../race/types/RaceGoal";
import { RacerStatus } from "../../../race/types/RacerStatus";
import { RaceStatus } from "../../../race/types/RaceStatus";
import { ChallengeCustom } from "../../../speedrun/enums";
import { speedrunGetCharacterNum } from "../../../speedrun/exported";

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
  const stage = g.l.GetStage();
  const roomType = g.r.GetType();

  if (stage !== 8 && stage !== 9) {
    return;
  }

  if (roomType !== RoomType.ROOM_BOSS) {
    return;
  }

  // Don't do anything if we just killed the It Lives! in an Emperor? Card room
  if (!isRoomInsideMap()) {
    return;
  }

  manuallySpawn();
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
  const challenge = Isaac.GetChallenge();

  // Speedrun seasons have set goals
  if (challenge === ChallengeCustom.SEASON_1) {
    return ItLivesSituation.HEAVEN_DOOR;
  }
  if (challenge === ChallengeCustom.SEASON_2) {
    const characterNum = speedrunGetCharacterNum();
    return isOdd(characterNum)
      ? ItLivesSituation.HEAVEN_DOOR
      : ItLivesSituation.TRAPDOOR;
  }

  if (
    g.race.status === RaceStatus.IN_PROGRESS &&
    g.race.myStatus === RacerStatus.RACING
  ) {
    return getItLivesSituationRace(g.race.goal);
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
      ensureAllCases(goal);
      return ItLivesSituation.NEITHER;
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
