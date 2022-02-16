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

    // Season 2
    selectedCharacters: [] as PlayerType[],
    remainingCharacters: [] as PlayerType[],
    /** Never start the same character twice in a row. */
    lastSelectedCharacter: null as PlayerType | null,

    selectedBuildIndexes: [] as int[],
    remainingBuildIndexes: [] as int[],
    /** Never start the same build twice in a row. */
    lastSelectedBuildIndex: null as int | null,

    /**
     * The time that the randomly selected character & build were assigned. This is set to 0 when
     * the Basement 2 boss is defeated.
     */
    timeAssigned: null as int | null,
  },

  run: {
    fadeFrame: null as int | null,
    resetFrame: null as int | null,

    finished: false,
    finishedFrames: null as int | null,

    errors: {
      gameRecentlyOpened: false,
    },
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
