import { arrayEmpty, saveDataManager } from "isaacscript-common";
import { RepentanceDoorState } from "../../types/RepentanceDoorState";

const v = {
  persistent: {
    characterNum: 1,
    liveSplitReset: false,

    /** Used to tell the difference between a normal reset and a fast-reset. */
    performedFastReset: false,

    startedFrame: null as int | null,
    startedCharFrame: null as int | null,
    characterRunFrames: [] as int[],
  },

  run: {
    fadeFrame: null as int | null,
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

  v.persistent.startedFrame = null;
  v.persistent.startedCharFrame = null;
  arrayEmpty(v.persistent.characterRunFrames);
}

export function resetFirstCharacterVars(): void {
  if (v.persistent.characterNum > 1) {
    return;
  }

  v.persistent.startedFrame = null;
  v.persistent.startedCharFrame = null;
  arrayEmpty(v.persistent.characterRunFrames);
}
