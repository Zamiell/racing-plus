import { Challenge } from "isaac-typescript-definitions";

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
