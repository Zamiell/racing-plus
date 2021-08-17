import { arraySum, log } from "isaacscript-common";
import g from "../../globals";
import * as timer from "../../timer";
import { CollectibleTypeCustom } from "../../types/enums";
import { getCharacterOrder } from "../changeCharOrder/v";
import { CHALLENGE_DEFINITIONS } from "./constants";
import v from "./v";

const ISAAC_FRAMES_PER_SECOND = 60;

export function checkValidCharOrder(): boolean {
  const challenge = Isaac.GetChallenge();
  const challengeDefinition = CHALLENGE_DEFINITIONS.get(challenge);
  if (challengeDefinition === undefined) {
    return false;
  }

  const [abbreviation, numElements] = challengeDefinition;
  if (abbreviation === undefined || numElements === undefined) {
    return false;
  }

  const characterOrder = getCharacterOrder(abbreviation);
  if (characterOrder === undefined) {
    return false;
  }

  if (type(characterOrder) !== "table") {
    return false;
  }

  return characterOrder.length === numElements;
}

export function finish(player: EntityPlayer): void {
  const isaacFrameCount = Isaac.GetFrameCount();

  // Play a sound effect
  // (custom sounds do not function properly in the current patch)
  // g.sfx.Play(SoundEffectCustom.SOUND_SPEEDRUN_FINISH, 1.5, 0, false, 1);

  // Give them the Checkpoint custom item
  // (this is used by the AutoSplitter to know when to split)
  player.AddCollectible(CollectibleTypeCustom.COLLECTIBLE_CHECKPOINT);

  // Record how long this run took
  if (v.persistent.startedCharFrame !== null) {
    const elapsedFrames = isaacFrameCount - v.persistent.startedCharFrame;
    v.persistent.characterRunFrames.push(elapsedFrames);
  }

  // Show the run summary (including the average time per character)
  v.room.showEndOfRunText = true;

  // Finish the speedrun
  v.run.finished = true;
  v.persistent.characterNum = 1;

  if (v.persistent.startedFrame !== null) {
    v.run.finishedFrames = isaacFrameCount - v.persistent.startedFrame;
  }

  // Fireworks will play on the next frame (from the PostUpdate callback)
}

export function getAverageTimePerCharacter(): string {
  const totalFrames = arraySum(v.persistent.characterRunFrames);
  const averageFrames = totalFrames / v.persistent.characterRunFrames.length;
  const averageSeconds = averageFrames / ISAAC_FRAMES_PER_SECOND;

  const [hours, minute1, minute2, second1, second2] =
    timer.convertSecondsToTimerValues(averageSeconds);

  if (hours > 0) {
    return "too long";
  }

  return `${minute1}${minute2}.${second1}${second2}`;
}

export function getCurrentCharacter(): int {
  const challenge = Isaac.GetChallenge();
  const challengeDefinition = CHALLENGE_DEFINITIONS.get(challenge);
  if (challengeDefinition === undefined) {
    error(
      `Failed to find challenge ${challenge} in the challenge definitions.`,
    );
  }

  const [abbreviation, numElements] = challengeDefinition;
  if (abbreviation === undefined || numElements === undefined) {
    error(
      `Failed to find parse the challenge definition for challenge: ${challenge}`,
    );
  }

  const characterOrder = getCharacterOrder(abbreviation);
  if (characterOrder === undefined) {
    error(`Failed to get the character order for challenge: ${abbreviation}`);
  }

  if (type(characterOrder) !== "table") {
    error(
      `The character order for was not a table for challenge: ${abbreviation}`,
    );
  }

  if (characterOrder.length !== numElements) {
    traceback();
    error(
      `The character order for challenge ${abbreviation} had ${characterOrder.length} elements, but it needs to have ${numElements}.`,
    );
  }

  if (v.persistent.characterNum < 1) {
    error(
      `The character number of "${v.persistent.characterNum}" is less than 1.`,
    );
  }

  if (v.persistent.characterNum > characterOrder.length) {
    error(
      `The character number of "${v.persistent.characterNum}" is greater than ${characterOrder.length} (i.e. the amount of characters in this speedrun).`,
    );
  }

  const arrayIndex = v.persistent.characterNum - 1;
  const character = characterOrder[arrayIndex];
  if (character === undefined) {
    error(
      `Failed to find the character at array index ${arrayIndex} for the character order of challenge: ${abbreviation}`,
    );
  }

  return character;
}

export function goBackToFirstCharacter(): boolean {
  if (v.persistent.performedFastReset) {
    v.persistent.performedFastReset = false;
    return false;
  }

  if (isOnFirstCharacter()) {
    return false;
  }

  // They held R for a slow reset, and they are not on the first character,
  // so they want to restart from the first character
  v.persistent.characterNum = 1;
  g.run.restart = true;
  log("Restarting because we want to start from the first character again.");

  // Tell the LiveSplit AutoSplitter to reset
  v.persistent.liveSplitReset = true;

  return true;
}

export function inSpeedrun(): boolean {
  const challenge = Isaac.GetChallenge();
  for (const key of CHALLENGE_DEFINITIONS.keys()) {
    if (key === challenge) {
      return true;
    }
  }

  return false;
}

export function isOnFinalCharacter(): boolean {
  return v.persistent.characterNum === 7;
}

export function isOnFirstCharacter(): boolean {
  return v.persistent.characterNum === 1;
}

export function setCorrectCharacter(): boolean {
  const player = Isaac.GetPlayer();
  const character = player.GetPlayerType();
  const currentCharacter = getCurrentCharacter();

  if (character !== currentCharacter) {
    v.persistent.performedFastReset = true;
    g.run.restart = true;
    log(
      `Restarting because we are on character ${character} and we need to be on character ${currentCharacter}.`,
    );

    return true;
  }

  return false;
}

export function shouldShowEndOfRunTextSpeedrun(): boolean {
  return v.room.showEndOfRunText;
}
