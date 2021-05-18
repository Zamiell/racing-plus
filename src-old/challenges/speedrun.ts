import g from "../globals";
import * as timer from "../timer";
import { CollectibleTypeCustom, SoundEffectCustom } from "../types/enums";
import { CHALLENGE_DEFINITIONS, SEASON_5_CHARACTER_NAME } from "./constants";
import { ChallengeCustom } from "./enums";
import { inSpeedrun } from "./misc";

// Called from the PostUpdate callback (the "CheckEntities.NonGrid()" function)
export function finishedSpeedrun(): void {
  // Local variables
  const challenge = Isaac.GetChallenge();

  // Give them the Checkpoint custom item
  // (this is used by the AutoSplitter to know when to split)
  g.p.AddCollectible(CollectibleTypeCustom.COLLECTIBLE_CHECKPOINT, 0, false);

  // Record how long this run took
  const elapsedTime = Isaac.GetTime() - g.speedrun.startedCharTime;
  g.speedrun.characterRunTimes.push(elapsedTime);

  // Show the run summary (including the average time per character)
  g.run.endOfRunText = true;

  // Finish the speedrun
  g.speedrun.finished = true;
  g.speedrun.finishedTime = Isaac.GetTime() - g.speedrun.startedTime;
  g.speedrun.finishedFrames = Isaac.GetFrameCount() - g.speedrun.startedFrame;

  // Play a sound effect
  g.sfx.Play(SoundEffectCustom.SOUND_SPEEDRUN_FINISH, 1.5, 0, false, 1);

  // Perform season-specific things, if any
  switch (challenge) {
    case ChallengeCustom.R7_SEASON_5: {
      g.season5.selectedStartingItems = [];
      break;
    }

    case ChallengeCustom.R7_SEASON_6: {
      g.season6.selectedStartingBuilds = [];
      break;
    }

    case ChallengeCustom.R7_SEASON_9: {
      g.season9.selectedStartingBuildIndexes = [];
      break;
    }

    default: {
      break;
    }
  }

  // Fireworks will play on the next frame (from the PostUpdate callback)
}

// Don't move to the first character of the speedrun if we die
export function postGameEnd(gameOver: boolean): void {
  if (!gameOver) {
    return;
  }

  if (!inSpeedrun()) {
    return;
  }

  g.speedrun.fastReset = true;
  Isaac.DebugString("Game over detected.");
}

export function checkValidCharOrder(): boolean {
  // Local variables
  const challenge = Isaac.GetChallenge();

  // There is no character order for season 5
  if (challenge === ChallengeCustom.R7_SEASON_5) {
    return true;
  }

  // Otherwise, we get the character order from the Racing+ Data mod's "save#.dat" file
  if (RacingPlusData === null) {
    return false;
  }

  const challengeDefinition = CHALLENGE_DEFINITIONS.get(challenge);
  if (challengeDefinition === undefined) {
    Isaac.DebugString(
      `Error: Failed to find challenge ${challenge} in the challenge definitions.`,
    );
    return false;
  }

  const [abbreviation, numElements] = challengeDefinition;
  if (abbreviation === undefined || numElements === undefined) {
    return false;
  }

  const key = `charOrder-${abbreviation}`;
  const characterOrder = RacingPlusData.Get(key) as int[] | null;
  if (characterOrder === null) {
    return false;
  }

  if (type(characterOrder) !== "table") {
    Isaac.DebugString(
      `Error: The RacingPlusData value for the key of "${key}" was not a table.`,
    );
    return false;
  }

  if (characterOrder.length !== numElements) {
    Isaac.DebugString(
      `Error: The RacingPlusData value for the key of "${key}" did not have ${numElements} like it was supposed to.`,
    );
    return false;
  }

  return true;
}

export function getCurrentCharacter(): int {
  // Local variables
  const challenge = Isaac.GetChallenge();

  // In season 5, we always return the character ID of "Random Baby"
  if (challenge === ChallengeCustom.R7_SEASON_5) {
    // "randomBabyType" cannot be a constant because The Babies Mod loads after Racing+
    const randomBabyType = Isaac.GetPlayerTypeByName(SEASON_5_CHARACTER_NAME);

    if (randomBabyType === -1) {
      return 0;
    }

    return randomBabyType;
  }

  // Otherwise, we get the value from the Racing+ Data mod's "save#.dat" file
  if (RacingPlusData === null) {
    return 0;
  }

  const challengeDefinition = CHALLENGE_DEFINITIONS.get(challenge);
  if (challengeDefinition === undefined) {
    Isaac.DebugString(
      `Error: Failed to find challenge ${challenge} in the challenge definitions.`,
    );
    return 0;
  }

  const [abbreviation, numElements] = challengeDefinition;
  if (abbreviation === undefined || numElements === undefined) {
    return 0;
  }

  const key = `charOrder-${abbreviation}`;
  const characterOrder = RacingPlusData.Get(key) as int[] | null;
  if (characterOrder === null) {
    return 0;
  }

  if (characterOrder === null) {
    return 0;
  }
  if (type(characterOrder) !== "table") {
    return 0;
  }

  const characterID = characterOrder[g.speedrun.characterNum];
  if (characterID === undefined) {
    return 0;
  }

  return characterID;
}

export function isOnFinalCharacter(): boolean {
  // Local variables
  const challenge = Isaac.GetChallenge();

  if (challenge === ChallengeCustom.R15_VANILLA) {
    return g.speedrun.characterNum === 15;
  }

  if (challenge === ChallengeCustom.R9_SEASON_1) {
    return g.speedrun.characterNum === 9;
  }

  if (challenge === ChallengeCustom.R14_SEASON_1) {
    return g.speedrun.characterNum === 14;
  }

  return g.speedrun.characterNum === 7;
}

export function getAverageTimePerCharacter(): string {
  let totalMilliseconds = 0;
  for (const milliseconds of g.speedrun.characterRunTimes) {
    totalMilliseconds += milliseconds;
  }
  const averageMilliseconds =
    totalMilliseconds / g.speedrun.characterRunTimes.length;
  const averageSeconds = averageMilliseconds / 1000;

  // Ignore the hours
  const [
    hours,
    minute1,
    minute2,
    second1,
    second2,
  ] = timer.convertSecondsToStrings(averageSeconds);

  if (hours > 0) {
    return "too long";
  }

  return `${minute1}${minute2}.${second1}${second2}`;
}
