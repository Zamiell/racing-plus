import { saveDataManager } from "isaacscript-common";
import g from "../../../../globals";
import { config } from "../../../../modConfigMenu";
import { FastTravelEntityDescription } from "./constants";
import { FastTravelState } from "./enums";

const v = {
  run: {
    /** These are Isaac frames, not game frames. */
    framesPassed: 0,

    state: FastTravelState.DISABLED,

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

      returnRoomIndex: null as int | null,
      returnRoomPosition: null as Vector | null,
      previousReturnRoomIndex: null as int | null,

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
  },

  room: {
    /**
     * Used to prevent changing rooms twice, since it takes a frame for the "StartRoomTransition"
     * method to take effect.
     */
    amChangingRooms: false,

    /** Equal to the game frame count that the room was cleared. */
    clearFrame: -1,

    /** Indexed by grid index. */
    crawlspaces: new Map<int, FastTravelEntityDescription>(),

    /** Indexed by grid index. */
    heavenDoors: new Map<int, FastTravelEntityDescription>(),

    movedAwayFromSecretShopLadder: false,

    /** Used to replace a crawlspace with a teleporter under certain conditions. */
    teleporter: {
      frame: null as int | null,
      position: Vector.Zero,
      spawned: false,
    },

    /** Indexed by grid index. */
    trapdoors: new Map<int, FastTravelEntityDescription>(),
  },
};
export default v;

export function init(): void {
  saveDataManager("fastTravel", v, featureEnabled);
}

function featureEnabled() {
  return config.fastTravel;
}

export function fastTravelSetClearFrame(): void {
  const gameFrameCount = g.g.GetFrameCount();

  v.room.clearFrame = gameFrameCount;
}

export function isFastTravelHappening(): boolean {
  return v.run.state > FastTravelState.DISABLED;
}
