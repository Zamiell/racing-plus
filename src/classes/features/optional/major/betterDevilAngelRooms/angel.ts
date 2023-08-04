import type { JSONRoom } from "isaacscript-common";
import { getJSONRoomOfVariant, getRandomJSONRoom } from "isaacscript-common";
import * as angelRooms from "../../../../../json/angelRooms.json";
import { mod } from "../../../../../mod";
import { v } from "./v";

export function setupSeededAngelRoom(): void {
  const jsonRooms = angelRooms.rooms.room;

  let jsonRoom: JSONRoom;
  if (v.run.debugRoomNum === null) {
    jsonRoom = getRandomJSONRoom(jsonRooms, v.run.rng.angelSelection);
  } else {
    const roomVariant = v.run.debugRoomNum;
    v.run.debugRoomNum = null;

    const debugJSONRoom = getJSONRoomOfVariant(jsonRooms, roomVariant);
    if (debugJSONRoom === undefined) {
      error(`Failed to find JSON room of variant: ${roomVariant}`);
    }
    jsonRoom = debugJSONRoom;
  }

  mod.deployJSONRoom(jsonRoom, v.run.rng.angelEntities);
}
