import { saveDataManager } from "isaacscript-common";
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

    // For season 2
    timeItemAssigned: null as int | null,
    vetoList: [] as CollectibleType[],
    vetoTimer: null as int | null,
    vetoSprites: [] as Sprite[],
    remainingStartingBuilds: [] as CollectibleType[],
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
  },

  room: {
    showEndOfRunText: false,
  },
};
export default v;

declare let speedrun: typeof v;
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
