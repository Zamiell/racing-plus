import { FastTravelEntityDescription } from "../features/optional/major/fastTravel/constants";
import FastClearNPCDescription from "./FastClearNPCDescription";

export default class GlobalsRunRoom {
  clear: boolean;

  /** Equal to the game frame count that the room was cleared. */
  clearFrame = -1;

  /** Used to prevent the vanilla paths from spawning after defeating It Lives! */
  deletePaths = false;

  fastClearNPCQueue: FastClearNPCDescription[] = [];

  fastTravel = {
    trapdoors: new LuaTable<int, FastTravelEntityDescription>(),
    crawlspaces: new LuaTable<int, FastTravelEntityDescription>(),
    heavenDoors: new LuaTable<int, FastTravelEntityDescription>(),

    /**
     * Used to prevent double teleporting, since it takes a frame for the "StartRoomTransition"
     * method to take effect.
     */
    amChangingRooms: false,
  };

  /**
   * Used so that we can delete the vanilla paths on the appropriate frame.
   */
  hushKilledFrame = 0;

  /**
   * Used to power the custom PostGridEntityInit callback.
   * Indexes are grid indexes. Values are grid entity types.
   */
  initializedGridEntities = new LuaTable<int, int>();

  /**
   * Defeating It Lives! triggers the PostEntityKill callback twice for some reason,
   * so we need to keep track of whether this is the first or second trigger.
   */
  itLivesKilled = false;

  /**
   * Used so that we can delete the vanilla paths on the appropriate frame.
   */
  itLivesKilledFrame = 0;

  manuallySpawnedPhotos = false;
  showEndOfRunText = false;
  vanillaPhotosLeftToSpawn = 0;

  constructor(clear: boolean) {
    this.clear = clear;
  }
}
