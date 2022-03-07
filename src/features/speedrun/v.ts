import { emptyArray, saveDataManager } from "isaacscript-common";
import { RepentanceDoorState } from "../../types/RepentanceDoorState";

const v = {
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
    previousRoomType: RoomType.ROOM_DEFAULT,
    repentanceDoorState: RepentanceDoorState.INITIAL,
  },

  room: {
    showEndOfRunText: false,

    /** Used to fix a bug with We Need to Go Deeper! */
    usedShovelFrame: null as int | null,
  },
};
export default v;

export function init(): void {
  saveDataManager("speedrun", v);
}

export function resetPersistentVars(): void {
  v.persistent.characterNum = 1;
  v.persistent.liveSplitReset = false;
  v.persistent.performedFastReset = false;

  v.persistent.startedSpeedrunFrame = null;
  v.persistent.startedCharacterFrame = null;
  emptyArray(v.persistent.characterRunFrames);
}

export function resetFirstCharacterVars(): void {
  if (v.persistent.characterNum > 1) {
    return;
  }

  v.persistent.startedSpeedrunFrame = null;
  v.persistent.startedCharacterFrame = null;
  emptyArray(v.persistent.characterRunFrames);
}
