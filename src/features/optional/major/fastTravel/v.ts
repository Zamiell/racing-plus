import { saveDataManager } from "isaacscript-common";
import g from "../../../../globals";
import { config } from "../../../../modConfigMenu";
import { FAST_TRAVEL_FEATURE_NAME } from "./constants";
import { FastTravelEntityDescription } from "./types/FastTravelEntityDescription";
import { FastTravelState } from "./types/FastTravelState";

const v = {
  run: {
    state: FastTravelState.DISABLED,
    renderFramesPassed: 0,

    upwards: false,
    blueWomb: false,
    theVoid: false,

    perfection: {
      floorsWithoutDamage: 0,
      spawned: false,
    },

    /**
     * We need to track the Repentance floors that we visited so that we can return to them during
     * the Ascent.
     */
    repentanceFloorsVisited: {
      downpour1: false,
      dross1: false,
      downpour2: false,
      dross2: false,
      mines1: false,
      ashpit1: false,
      mines2: false,
      ashpit2: false,
    },

    /**
     * Repentance secret exits are located in the room outside the grid.
     * (e.g. GridRooms.ROOM_SECRET_EXIT_IDX)
     */
    repentanceSecretExit: false,

    reseed: false,
  },

  level: {
    crawlspace: {
      amEntering: false,

      /**
       * If the player is returning from the top of the crawlspace ladder back to the previous room.
       */
      amExiting: false,

      returnRoomGridIndex: null as int | null,
      returnRoomPosition: null as Vector | null,
      previousReturnRoomGridIndex: null as int | null,

      /**
       * Used to reposition the player after we subvert their touching of a loading zone and
       * manually teleport them to the right room.
       */
      subvertedRoomTransitionDirection: Direction.NO_DIRECTION,
    },

    /**
     * We need to manually keep track if the player takes damage for the purposes of the Perfection
     * trinket.
     */
    tookDamage: false,

    /** Used by other mod features to resume fast-travel when fast-travel is interrupted. */
    resumeGameFrame: null as int | null,
  },

  room: {
    /**
     * Used to prevent changing rooms twice, since it takes a frame for the "StartRoomTransition"
     * method to take effect.
     */
    amChangingRooms: false,

    /** Equal to the game frame count that the room was cleared. */
    clearFrame: null as int | null,

    /** Indexed by grid index. */
    crawlspaces: new Map<int, FastTravelEntityDescription>(),

    /** Indexed by grid index. */
    heavenDoors: new Map<int, FastTravelEntityDescription>(),

    movedAwayFromSecretShopLadder: false,

    /** Used when replacing a crawlspace with a teleporter. */
    teleporterSpawned: false,

    /** Indexed by grid index. */
    trapdoors: new Map<int, FastTravelEntityDescription>(),
  },
};
export default v;

export function init(): void {
  saveDataManager(FAST_TRAVEL_FEATURE_NAME, v, featureEnabled);
}

function featureEnabled() {
  return config.fastTravel;
}

export function isFastTravelHappening(): boolean {
  return v.run.state > FastTravelState.DISABLED;
}

export function setFastTravelClearFrame(): void {
  const gameFrameCount = g.g.GetFrameCount();

  v.room.clearFrame = gameFrameCount;
}

export function setFastTravelResumeGameFrame(resumeGameFrame: int): void {
  v.level.resumeGameFrame = resumeGameFrame;
}

export function setFastTravelTookDamage(): void {
  v.level.tookDamage = true;
}
