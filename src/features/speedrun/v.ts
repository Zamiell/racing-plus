import { Challenge, PlayerType, RoomType } from "isaac-typescript-definitions";
import { emptyArray } from "isaacscript-common";
import { RepentanceDoorState } from "../../enums/RepentanceDoorState";
import { mod } from "../../mod";

export const v = {
  persistent: {
    characterNum: 1,
    liveSplitReset: false,

    /** Used to tell the difference between a normal reset and a fast-reset. */
    performedFastReset: false,

    startedSpeedrunFrame: null as int | null,
    startedCharacterFrame: null as int | null,
    characterRunFrames: [] as int[],

    /** Used after a speedrun is finished. */
    resetAllVarsOnNextReset: false,

    currentlyPlayingChallenge: null as Challenge | null,

    randomCharacterOrder: {
      selectedCharacters: [] as PlayerType[],
      remainingCharacters: [] as PlayerType[],
      /** Never start the same character twice in a row. */
      lastSelectedCharacter: null as PlayerType | null,
      /** This is set to 0 when the Basement 2 boss is defeated. */
      timeCharacterAssigned: null as int | null,
      /** The time that the bans were set in the "Change Char Order" custom challenge. */
      timeBansSet: null as int | null,
    },
  },

  run: {
    /** Used to fade out the screen after the player takes a Checkpoint. */
    fadeFrame: null as int | null,

    /** Used to reset the game after the player takes a Checkpoint. */
    resetFrame: null as int | null,

    finished: false,
    finishedFrames: null as int | null,

    /** Used for the random character order feature. */
    errors: {
      gameRecentlyOpened: false,
      consoleRecentlyUsed: false,
      bansRecentlySet: false,
    },
  },

  level: {
    previousRoomType: RoomType.DEFAULT,
    repentanceDoorState: RepentanceDoorState.INITIAL,
  },

  room: {
    showEndOfRunText: false,

    /** Used to fix a bug with We Need to Go Deeper! */
    usedShovelFrame: null as int | null,
  },
};

export function init(): void {
  mod.saveDataManager("speedrun", v);
}

export function speedrunResetPersistentVars(): void {
  v.persistent.characterNum = 1;
  v.persistent.liveSplitReset = false;
  v.persistent.performedFastReset = false;
  v.persistent.startedSpeedrunFrame = null;
  v.persistent.startedCharacterFrame = null;
  emptyArray(v.persistent.characterRunFrames);

  emptyArray(v.persistent.randomCharacterOrder.selectedCharacters);
  emptyArray(v.persistent.randomCharacterOrder.remainingCharacters);
  v.persistent.randomCharacterOrder.lastSelectedCharacter = null;
  v.persistent.randomCharacterOrder.timeCharacterAssigned = null;
  // `timeBansSet` is not reset since it has to do with the Change Char Order challenge.
}

export function speedrunResetFirstCharacterVars(): void {
  if (v.persistent.characterNum > 1) {
    return;
  }

  v.persistent.startedSpeedrunFrame = null;
  v.persistent.startedCharacterFrame = null;
  emptyArray(v.persistent.characterRunFrames);
}

export function speedrunShouldShowEndOfRunText(): boolean {
  return v.room.showEndOfRunText;
}

export function speedrunGetCharacterNum(): number {
  return v.persistent.characterNum;
}

/** Used for the random character order feature. */
export function speedrunGetCurrentSelectedCharacter(): PlayerType | undefined {
  return v.persistent.randomCharacterOrder.selectedCharacters[
    v.persistent.characterNum - 1
  ];
}

export function speedrunGetFinishedFrames(): number {
  return v.run.finishedFrames === null ? 0 : v.run.finishedFrames;
}

export function speedrunIsFinished(): boolean {
  return v.run.finished;
}

export function speedrunSetFastReset(): void {
  v.persistent.performedFastReset = true;
}

/** The errors set in this function must correspond to the `v.run.errors` object. */
export function speedrunHasErrors(): boolean {
  return (
    v.run.errors.gameRecentlyOpened ||
    v.run.errors.consoleRecentlyUsed ||
    v.run.errors.bansRecentlySet
  );
}

export function speedrunSetBansTime(): void {
  v.persistent.randomCharacterOrder.timeBansSet = Isaac.GetTime();
}
