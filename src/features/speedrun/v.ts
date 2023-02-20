import { Challenge, RoomType } from "isaac-typescript-definitions";
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
  },

  run: {
    /** Used to fade out the screen after the player takes a Checkpoint. */
    fadeFrame: null as int | null,

    /** Used to reset the game after the player takes a Checkpoint. */
    resetFrame: null as int | null,

    finished: false,
    finishedFrames: null as int | null,
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

export function speedrunResetPersistentVarsSpeedrun(): void {
  v.persistent.characterNum = 1;
  v.persistent.liveSplitReset = false;
  v.persistent.performedFastReset = false;
  v.persistent.startedSpeedrunFrame = null;
  v.persistent.startedCharacterFrame = null;
  emptyArray(v.persistent.characterRunFrames);
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

export function speedrunGetFinishedFrames(): number {
  return v.run.finishedFrames === null ? 0 : v.run.finishedFrames;
}

export function speedrunIsFinished(): boolean {
  return v.run.finished;
}

export function speedrunSetFastReset(): void {
  v.persistent.performedFastReset = true;
}
