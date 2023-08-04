import { Direction } from "isaac-typescript-definitions";
import { FastTravelState } from "../../../../../enums/FastTravelState";
import type { FastTravelEntityDescription } from "../../../../../interfaces/FastTravelEntityDescription";

// This is registered in "FastTravel.ts".
// eslint-disable-next-line isaacscript/require-v-registration
export const v = {
  run: {
    state: FastTravelState.DISABLED,
    renderFramesPassed: 0,

    travelDirection: Direction.NO_DIRECTION,

    perfection: {
      floorsWithoutDamage: 0,
      spawned: false,
    },

    /**
     * Repentance secret exits are located in the room outside the grid.
     * (e.g. GridRoom.SECRET_EXIT)
     */
    repentanceSecretExit: false,
  },

  level: {
    crawlSpace: {
      amEntering: false,

      /**
       * If the player is returning from the top of the crawl space ladder back to the previous
       * room.
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
    // -----------------------
    // Fast-travel Entity Maps
    // -----------------------

    /** Indexed by grid index. */
    crawlSpaces: new Map<int, FastTravelEntityDescription>(),

    /** Indexed by grid index. */
    heavenDoors: new Map<int, FastTravelEntityDescription>(),

    /** Indexed by grid index. */
    trapdoors: new Map<int, FastTravelEntityDescription>(),

    // -----
    // Other
    // -----

    /**
     * Used to prevent changing rooms twice, since it takes a frame for the "StartRoomTransition"
     * method to take effect.
     */
    amChangingRooms: false,

    /** Equal to the game frame count that the room was cleared. */
    clearFrame: null as int | null,

    movedAwayFromSecretShopLadder: false,

    /** Used when replacing a crawl space with a teleporter. */
    teleporterSpawned: false,
  },
};

export function isFastTravelHappening(): boolean {
  return v.run.state > FastTravelState.DISABLED;
}

export function setFastTravelResumeGameFrame(resumeGameFrame: int): void {
  v.level.resumeGameFrame = resumeGameFrame;
}

export function setFastTravelTookDamage(): void {
  v.level.tookDamage = true;
}
