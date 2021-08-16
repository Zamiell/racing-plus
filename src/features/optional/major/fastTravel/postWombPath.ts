import { ensureAllCases, log } from "isaacscript-common";
import g from "../../../../globals";
import { hasPolaroidOrNegative } from "../../../../util";
import { RaceGoal } from "../../../race/types/RaceData";
import { ChallengeCustom } from "../../../speedrun/enums";
import v from "./v";

enum ItLivesSituation {
  Neither,
  HeavenDoor,
  Trapdoor,
  Both,
}

export function postEntityKillMomsHeart(_entity: Entity): void {
  const gameFrameCount = g.g.GetFrameCount();
  const stage = g.l.GetStage();

  // Don't do anything if we just killed the Mom's Heart or It Lives! on Mausoleum, Gehenna,
  // or The Void
  if (stage !== 8) {
    return;
  }

  // Defeating It Lives! triggers the PostEntityKill callback twice for some reason,
  // so we need to keep track of whether this is the first or second trigger
  if (!v.room.itLivesKilled) {
    // This is the first trigger; wait for the second one
    v.room.itLivesKilled = true;
    return;
  }

  // First, record the frame that It Lives! died so that we can delete the vanilla trapdoor and
  // heaven door on the specific frame that they spawn
  v.room.itLivesKilledFrame = gameFrameCount;

  manuallySpawn();
}

export function postEntityKillHush(_entity: Entity): void {
  const gameFrameCount = g.g.GetFrameCount();

  // First, record the frame that It Lives! died so that we can delete the vanilla trapdoor and
  // heaven door on the specific frame that they spawn
  v.room.hushKilledFrame = gameFrameCount;

  manuallySpawn();
}

function manuallySpawn(): void {
  const situation = getItLivesSituation();
  doItLivesSituation(situation);
}

// Figure out if we need to spawn either a trapdoor, a heaven door, or both
function getItLivesSituation() {
  const challenge = Isaac.GetChallenge();

  // Speedrun seasons have set goals
  if (challenge === ChallengeCustom.SEASON_1) {
    return ItLivesSituation.HeavenDoor;
  }

  if (g.race.status === "in progress" && g.race.myStatus === "racing") {
    return getItLivesSituationRace(g.race.goal);
  }

  const [hasPolaroid, hasNegative] = hasPolaroidOrNegative();

  if (hasPolaroid && hasNegative) {
    // The player has both photos (which can occur if the player is Eden or is in a diversity race)
    // So, give the player a choice between the directions
    return ItLivesSituation.Both;
  }

  if (hasPolaroid) {
    // The player has The Polaroid, so send them to Cathedral
    return ItLivesSituation.HeavenDoor;
  }

  if (hasNegative) {
    // The player has The Negative, so send them to Sheol
    return ItLivesSituation.Trapdoor;
  }

  // The player does not have either The Polaroid or The Negative,
  // so give them a choice between the directions
  return ItLivesSituation.Both;
}

function getItLivesSituationRace(goal: RaceGoal) {
  switch (goal) {
    case "Blue Baby": {
      return ItLivesSituation.HeavenDoor;
    }

    case "The Lamb": {
      return ItLivesSituation.Trapdoor;
    }

    case "Mega Satan":
    case "Boss Rush":
    case "Mother":
    case "The Beast":
    case "custom": {
      // Give the player a choice between the photos for races to alternate objectives
      return ItLivesSituation.Both;
    }

    case "Hush":
    case "Delirium": {
      return ItLivesSituation.Neither;
    }

    default: {
      ensureAllCases(goal);
      return ItLivesSituation.Both;
    }
  }
}

function doItLivesSituation(situation: ItLivesSituation) {
  const stage = g.l.GetStage();

  // Mark to delete the vanilla paths
  v.room.deletePaths = true;

  let centerGridIndex = 67;
  let positionCenter = g.r.GetGridPosition(centerGridIndex);
  let positionLeft = g.r.GetGridPosition(centerGridIndex - 1);
  let positionRight = g.r.GetGridPosition(centerGridIndex + 1);
  if (stage === 9) {
    // The trapdoor / heaven door positions after Hush are not in the center of the room;
    // they are near the top wall
    centerGridIndex = 126;
    positionCenter = g.r.GetGridPosition(centerGridIndex);
    positionLeft = g.r.GetGridPosition(centerGridIndex - 1);
    positionRight = g.r.GetGridPosition(centerGridIndex + 1);
  }

  switch (situation) {
    case ItLivesSituation.Neither: {
      log("It Lives! or Hush killed; no paths will be spawned.");
      break;
    }

    case ItLivesSituation.HeavenDoor: {
      spawnHeavenDoor(positionCenter);
      log("It Lives! or Hush killed; going up.");
      break;
    }

    case ItLivesSituation.Trapdoor: {
      spawnTrapdoor(positionCenter);
      log("It Lives! or Hush killed; going down.");
      break;
    }

    case ItLivesSituation.Both: {
      spawnTrapdoor(positionLeft);
      spawnHeavenDoor(positionRight);
      log("It Lives! or Hush killed; spawning both paths.");
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
    0,
    position,
    Vector.Zero,
    null,
  );
}

function spawnTrapdoor(position: Vector) {
  Isaac.GridSpawn(GridEntityType.GRID_TRAPDOOR, 0, position, true);
}
