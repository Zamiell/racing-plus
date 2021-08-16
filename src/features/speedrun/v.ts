import { saveDataManager } from "isaacscript-common";

const v = {
  persistent: {
    characterNum: 1,
    liveSplitReset: false,

    /** Used to tell the difference between a normal reset and a fast-reset. */
    performedFastReset: false,

    startedTime: null as null | int,
    startedFrame: null as null | int,
    startedCharTime: null as null | int,
    characterRunTimes: [] as int[],
  },

  run: {
    fadeFrame: null as null | int,
    resetFrame: null as null | int,

    finished: false,
    finishedTime: null as null | int,
    finishedFrames: null as null | int,
  },

  room: {
    showEndOfRunText: false,
  },
};
export default v;

export function init(): void {
  saveDataManager("speedrun", v, featureEnabled);
}

function featureEnabled() {
  const challenge = Isaac.GetChallenge();
  return challenge !== Challenge.CHALLENGE_NULL;
}

export function resetPersistentVars(): void {
  v.persistent.characterNum = 1;
  v.persistent.liveSplitReset = false;
  v.persistent.performedFastReset = false;
  v.persistent.startedTime = null;
  v.persistent.startedFrame = null;
  v.persistent.startedCharTime = null;
  v.persistent.characterRunTimes = [];
}

export function resetFirstCharacterVars(): void {
  if (v.persistent.characterNum > 1) {
    return;
  }

  v.persistent.startedTime = 0;
  v.persistent.startedFrame = 0;
  v.persistent.startedCharTime = 0;
  v.persistent.characterRunTimes = [];
}

export function speedrunSetFastReset(): void {
  v.persistent.performedFastReset = true;
}

export function speedrunGetFinishedFrames(): number {
  return v.run.finishedFrames === null ? 0 : v.run.finishedFrames;
}

export function speedrunIsFinished(): boolean {
  return v.run.finished;
}
