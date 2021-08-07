import { saveDataManager } from "isaacscript-common";
import g from "../../../../globals";
import { config } from "../../../../modConfigMenu";
import { FastTravelEntityDescription } from "./constants";

const v = {
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
