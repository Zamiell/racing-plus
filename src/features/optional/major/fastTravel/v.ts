import { saveDataManager } from "isaacscript-common";
import g from "../../../../globals";
import { config } from "../../../../modConfigMenu";
import { FastTravelEntityDescription } from "./constants";

const v = {
  run: {
    /**
     * We need to track the Repentance floors that we visited so that we can return to them during
     * the Backwards path.
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
  },

  level: {
    /**
     * We need to manually keep track if the player takes damage for the purposes of the Perfection
     * trinket.
     */
    tookDamage: false,

    /**
     * Used for keeping track of whether or not we are in a Black Market so that we can position
     * the player properly.
     */
    blackMarket: false,

    /**
     * Used for the purposes of fixing the softlock when a player returns from a crawlspace to a
     * room outside of the grid.
     */
    previousRoomIndex: null as int | null,

    /**
     * Used to reposition the player after we subvert their touching of a loading zone and
     * manually teleport them to the right room.
     */
    subvertedRoomTransitionDirection: Direction.NO_DIRECTION,
  },

  room: {
    /**
     * Used to prevent double teleporting, since it takes a frame for the "StartRoomTransition"
     * method to take effect.
     */
    amChangingRooms: false,

    /** Equal to the game frame count that the room was cleared. */
    clearFrame: -1,

    /** Indexed by grid index. */
    crawlspaces: new LuaTable<int, FastTravelEntityDescription>(),

    /** Used to prevent the vanilla paths from spawning after defeating It Lives! or Hush. */
    deletePaths: false,

    /** Indexed by grid index. */
    heavenDoors: new LuaTable<int, FastTravelEntityDescription>(),

    /** Used so that we can delete the vanilla paths on the appropriate frame. */
    hushKilledFrame: 0,

    /**
     * Defeating It Lives! triggers the PostEntityKill callback twice for some reason,
     * so we need to keep track of whether this is the first or second trigger.
     */
    itLivesKilled: false,

    /**
     * Used so that we can delete the vanilla paths on the appropriate frame.
     */
    itLivesKilledFrame: 0,

    /** Indexed by grid index. */
    trapdoors: new LuaTable<int, FastTravelEntityDescription>(),
  },
};
export default v;

export function init(): void {
  saveDataManager("fastTravel", v, featureEnabled);
}

function featureEnabled() {
  return config.fastTravel;
}

export function setClearFrame(): void {
  const gameFrameCount = g.g.GetFrameCount();

  v.room.clearFrame = gameFrameCount;
}
