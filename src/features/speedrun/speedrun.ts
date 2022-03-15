import {
  ISAAC_FRAMES_PER_SECOND,
  isEven,
  preventCollectibleRotate,
  removeCollectibleFromItemTracker,
  removeCollectiblePickupDelay,
  runInNGameFrames,
  sfxManager,
  sumArray,
} from "isaacscript-common";
import * as timer from "../../timer";
import { ChallengeCustom } from "../../types/ChallengeCustom";
import { CollectibleTypeCustom } from "../../types/CollectibleTypeCustom";
import { SoundEffectCustom } from "../../types/SoundEffectCustom";
import { getCharacterOrder } from "../changeCharOrder/v";
import { isSeededDeathActive } from "../mandatory/seededDeath/v";
import { CHALLENGE_DEFINITIONS, CUSTOM_CHALLENGES_SET } from "./constants";
import { speedrunGetCharacterNum } from "./exported";
import v from "./v";

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
  const renderFrameCount = Isaac.GetFrameCount();

  sfxManager.Play(SoundEffectCustom.SOUND_SPEEDRUN_FINISH);

  // Give them the Checkpoint custom item
  // (this is used by the AutoSplitter to know when to split)
  player.AddCollectible(CollectibleTypeCustom.COLLECTIBLE_CHECKPOINT);
  removeCollectibleFromItemTracker(
    CollectibleTypeCustom.COLLECTIBLE_CHECKPOINT,
  );

  // Record how long this run took
  if (v.persistent.startedCharacterFrame !== null) {
    const elapsedFrames = renderFrameCount - v.persistent.startedCharacterFrame;
    v.persistent.characterRunFrames.push(elapsedFrames);
  }

  // Show the run summary (including the average time per character)
  v.room.showEndOfRunText = true;

  // Finish the speedrun
  v.run.finished = true;

  if (v.persistent.startedSpeedrunFrame !== null) {
    v.run.finishedFrames = renderFrameCount - v.persistent.startedSpeedrunFrame;
  }

  v.persistent.resetAllVarsOnNextReset = true;

  // Fireworks will play on the next frame (from the PostUpdate callback)
}

export function getAverageTimePerCharacter(): string {
  const totalFrames = sumArray(v.persistent.characterRunFrames);
  const averageFrames = totalFrames / v.persistent.characterRunFrames.length;
  const averageSeconds = averageFrames / ISAAC_FRAMES_PER_SECOND;

  const [hours, minute1, minute2, second1, second2] =
    timer.convertSecondsToTimerValues(averageSeconds);

  if (hours > 0) {
    return "too long";
  }

  return `${minute1}${minute2}.${second1}${second2}`;
}

export function getCurrentCharacter(): PlayerType {
  const characterOrder = getCharacterOrderSafe();
  const arrayIndex = v.persistent.characterNum - 1;
  const character = characterOrder[arrayIndex];
  if (character === undefined) {
    error(
      `Failed to find the character at array index ${arrayIndex} for the character order of the current challenge.`,
    );
  }

  return character;
}

export function getFirstCharacter(): PlayerType {
  const characterOrder = getCharacterOrderSafe();
  const arrayIndex = 0;
  const character = characterOrder[arrayIndex];
  if (character === undefined) {
    error(
      `Failed to find the character at array index ${arrayIndex} for the character order of the current challenge.`,
    );
  }

  return character;
}

export function getCharacterOrderSafe(): PlayerType[] {
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
    error(
      `The character order for challenge ${abbreviation} had ${characterOrder.length} elements, but it needs to have ${numElements}.`,
    );
  }

  if (v.persistent.characterNum < 1) {
    error(
      `The character number of "${v.persistent.characterNum}" is less than 1.`,
    );
  }

  if (
    v.persistent.characterNum > characterOrder.length &&
    challenge !== ChallengeCustom.SEASON_2
  ) {
    error(
      `The character number of "${v.persistent.characterNum}" is greater than ${characterOrder.length} (i.e. the amount of characters in this speedrun).`,
    );
  }

  return characterOrder;
}

export function isOnFinalCharacter(): boolean {
  return v.persistent.characterNum === 7;
}

export function isOnFirstCharacter(): boolean {
  return v.persistent.characterNum === 1;
}

export function inSpeedrun(): boolean {
  const challenge = Isaac.GetChallenge();
  return CUSTOM_CHALLENGES_SET.has(challenge);
}

export function onSpeedrunWithDarkRoomGoal(): boolean {
  const challenge = Isaac.GetChallenge();

  if (challenge === ChallengeCustom.SEASON_2) {
    const characterNum = speedrunGetCharacterNum();
    return isEven(characterNum);
  }

  return false;
}

export function postSpawnCheckpoint(checkpoint: EntityPickup): void {
  removeCollectiblePickupDelay(checkpoint);
  preventCollectibleRotate(
    checkpoint,
    CollectibleTypeCustom.COLLECTIBLE_CHECKPOINT,
  );

  // If the player kills the final boss while the seeded death mechanic is active, they should not
  // be able to take the checkpoint
  if (isSeededDeathActive()) {
    // The collision class on the collectible will be updated 4 frames from now, so if we set a new
    // collision class now, it will be overwritten
    // Thus, we have to wait at least 4 frames

    // First, set the "Wait" property to an arbitrary value longer than 4 frames to prevent the
    // player from picking up the Checkpoint
    checkpoint.Wait = 10;

    const checkpointPtr = EntityPtr(checkpoint);
    runInNGameFrames(() => {
      if (checkpointPtr.Ref !== undefined && checkpointPtr.Ref.Exists()) {
        checkpoint.EntityCollisionClass = EntityCollisionClass.ENTCOLL_NONE;
      }
    }, 4);
  }
}
