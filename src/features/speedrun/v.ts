import { log, saveDataManager } from "isaacscript-common";
import g from "../../globals";
import RepentanceDoorState from "../../types/RepentanceDoorState";

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

  level: {
    previousRoomType: RoomType.ROOM_DEFAULT,
    repentanceDoorState: RepentanceDoorState.INITIAL,
  },

  run: {
    fadeFrame: null as int | null,
    resetFrame: null as int | null,

    finished: false,
    finishedFrames: null as int | null,

    firstPlayerControllerIndex: null as int | null,
  },

  room: {
    showEndOfRunText: false,
  },
};
export default v;

declare let speedrun: any; // eslint-disable-line @typescript-eslint/no-explicit-any
speedrun = v; // eslint-disable-line

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

  v.persistent.startedFrame = null;
  v.persistent.startedCharFrame = null;
  v.persistent.characterRunFrames = [];
}

export function resetFirstCharacterVars(): void {
  if (v.persistent.characterNum > 1) {
    return;
  }

  v.persistent.startedFrame = null;
  v.persistent.startedCharFrame = null;
  v.persistent.characterRunFrames = [];
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

export function speedrunSetNext(goBack = false): void {
  v.persistent.performedFastReset = true; // Otherwise we will go back to the beginning again
  const adjustment = goBack ? -1 : 1;
  v.persistent.characterNum += adjustment;
  g.run.restart = true;
  log(
    `Manually switching to the next character for the speedrun: ${v.persistent.characterNum}`,
  );
}
