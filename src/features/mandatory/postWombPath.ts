import g from "../../globals";
import { ensureAllCases, hasPolaroidOrNegative } from "../../misc";
import { RaceGoal } from "../race/types/RaceData";
import { ChallengeCustom } from "../speedrun/enums";

enum ItLivesSituation {
  Neither,
  HeavenDoor,
  Trapdoor,
  Both,
}

export function postEntityKillMomsHeart(_entity: Entity): void {
  const gameFrameCount = g.g.GetFrameCount();
  const stage = g.l.GetStage();

  // Don't do anything if we just killed the Mom's Heart on Mausoleum / Gehenna
  if (stage !== 8) {
    return;
  }

  // Defeating It Lives! triggers the PostEntityKill callback twice for some reason,
  // so we need to keep track of whether this is the first or second trigger
  if (!g.run.room.itLivesKilled) {
    // This is the first trigger; wait for the second one
    g.run.room.itLivesKilled = true;
    return;
  }

  // First, record the frame that It Lives! died so that we can delete the vanilla trapdoor and
  // heaven door on the specific frame that they spawn
  g.run.room.itLivesKilledFrame = gameFrameCount;

  manuallySpawn();
}

export function postEntityKillHush(_entity: Entity): void {
  const gameFrameCount = g.g.GetFrameCount();

  // First, record the frame that It Lives! died so that we can delete the vanilla trapdoor and
  // heaven door on the specific frame that they spawn
  g.run.room.hushKilledFrame = gameFrameCount;

  manuallySpawn();
}

export function manuallySpawn(): void {
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

  // Define positions for the trapdoor and heaven door (recorded from vanilla)
  let posCenter = Vector(320, 280);
  if (stage === 9) {
    // The positions are different for the Blue Womb; they are more near the top wall
    posCenter = Vector(600, 280);
  }

  switch (situation) {
    case ItLivesSituation.Neither: {
      Isaac.DebugString("It Lives! or Hush killed; no paths will be spawned.");
      break;
    }

    case ItLivesSituation.HeavenDoor: {
      // Spawn a heaven door (1000.39)
      // It will get replaced with the fast-travel version on this frame
      Isaac.Spawn(
        EntityType.ENTITY_EFFECT,
        EffectVariant.HEAVEN_LIGHT_DOOR,
        0,
        posCenter,
        Vector.Zero,
        null,
      );
      Isaac.DebugString("It Lives! or Hush killed; going up.");
      break;
    }

    case ItLivesSituation.Trapdoor: {
      // Spawn a trapdoor (it will get replaced with the fast-travel version on this frame)
      Isaac.GridSpawn(GridEntityType.GRID_TRAPDOOR, 0, posCenter, true);
      Isaac.DebugString("It Lives! or Hush killed; going down.");
      break;
    }

    case ItLivesSituation.Both: {
      Isaac.DebugString(
        "It Lives! or Hush killed; letting the vanilla paths spawn (since we need to go both up and down).",
      );
      break;
    }

    default: {
      ensureAllCases(situation);
    }
  }

  if (situation !== ItLivesSituation.Both) {
    g.run.room.deletePaths = true;
  }
}
