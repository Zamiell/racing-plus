import { FastTravelEntityDescription } from "../features/optional/major/fastTravel/constants";

export default class GlobalsRunRoom {
  clear: boolean;
  /** Equal to the game frame count that the room was cleared. */
  clearFrame = -1;

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

  constructor(clear: boolean) {
    this.clear = clear;
  }
}
