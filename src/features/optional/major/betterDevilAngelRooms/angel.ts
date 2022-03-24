import {
  deployJSONRoom,
  getJSONRoomOfVariant,
  getRandomJSONRoom,
  JSONRoom,
} from "isaacscript-common";
import * as angelRooms from "./angelRooms.json";
import v from "./v";

export function angel(): void {
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

  deployJSONRoom(jsonRoom, v.run.rng.angelEntities);
}
