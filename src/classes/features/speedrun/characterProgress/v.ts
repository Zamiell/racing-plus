import type { Challenge } from "isaac-typescript-definitions";
import { PlayerType } from "isaac-typescript-definitions";
import { onChallenge } from "isaacscript-common";
import { ChallengeCustom } from "../../../../enums/ChallengeCustom";
import { getRandomBabyPlayerType } from "../../../../utilsBabiesMod";
import { getCharacterOrder } from "../changeCharOrder/v";

/** Tainted Cain will never be in a legitimate speedrun. */
const DEFAULT_CHARACTER_ON_ERROR = PlayerType.CAIN_B;

// This is registered in "CharacterProgress.ts".
// eslint-disable-next-line isaacscript/require-v-registration
export const v = {
  persistent: {
    characterNum: 1,
    liveSplitReset: false,

    /** Used to tell the difference between a normal reset and a fast-reset. */
    performedFastReset: false,

    /** Used after a speedrun is finished. */
    resetAllVarsOnNextReset: false,

    currentlyPlayingChallenge: null as Challenge | null,
    timeOtherRunEnded: null as int | null,
  },

  run: {
    /** Used to fade out the screen after the player takes a Checkpoint. */
    fadeFrame: null as int | null,

    /** Used to reset the game after the player takes a Checkpoint. */
    resetFrame: null as int | null,
  },

  room: {
    /** Used to fix a bug with We Need to Go Deeper! */
    usedShovelFrame: null as int | null,
  },
};

export function characterProgressResetPersistentVars(): void {
  v.persistent.characterNum = 1;
  v.persistent.liveSplitReset = false;
  v.persistent.performedFastReset = false;
}

export function isOnFinalCharacter(): boolean {
  return v.persistent.characterNum === 7;
}

export function isOnFirstCharacter(): boolean {
  return v.persistent.characterNum === 1;
}

export function speedrunGetCharacterNum(): number {
  return v.persistent.characterNum;
}

export function speedrunSetFastReset(): void {
  v.persistent.performedFastReset = true;
}

export function speedrunSetCharacterNum(num: number): void {
  v.persistent.characterNum = num;
}

export function speedrunResetAllVarsOnNextReset(): void {
  v.persistent.resetAllVarsOnNextReset = true;
}

export function speedrunGetCurrentCharacter(): PlayerType {
  // Certain seasons have a set character.
  if (onChallenge(ChallengeCustom.SEASON_5)) {
    const randomBaby = getRandomBabyPlayerType();
    if (randomBaby !== undefined) {
      return randomBaby;
    }
  }

  const characterOrder = getCharacterOrder();
  if (characterOrder === undefined) {
    return DEFAULT_CHARACTER_ON_ERROR;
  }

  const arrayIndex = v.persistent.characterNum - 1;
  const character = characterOrder[arrayIndex];
  if (character === undefined) {
    return DEFAULT_CHARACTER_ON_ERROR;
  }

  return character;
}

export function getTimeOtherRunStarted(): int | undefined {
  return v.persistent.timeOtherRunEnded ?? undefined;
}

export function setTimeOtherRunStarted(): void {
  v.persistent.timeOtherRunEnded = Isaac.GetTime();
}

// Make some specific functions global for other mods to use.
declare let RacingPlusIsOnFirstCharacter: (() => boolean) | undefined;
// eslint-disable-next-line @typescript-eslint/no-unused-vars, complete/prefer-const
RacingPlusIsOnFirstCharacter = isOnFirstCharacter;
