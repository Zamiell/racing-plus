import {
  deployJSONRoom,
  getJSONRoomOfVariant,
  getRandomJSONRoom,
  JSONRoom,
  nextSeed,
} from "isaacscript-common";
import * as angelRooms from "./angelRooms.json";
import v from "./v";

export function angel(): void {
  const jsonRooms = angelRooms.rooms.room;

  let jsonRoom: JSONRoom;
  if (v.run.debugRoomNum === null) {
    v.run.seeds.angelSelection = nextSeed(v.run.seeds.angelSelection);
    jsonRoom = getRandomJSONRoom(jsonRooms, v.run.seeds.angelSelection);
  } else {
    const roomVariant = v.run.debugRoomNum;
    v.run.debugRoomNum = null;

    const debugJSONRoom = getJSONRoomOfVariant(jsonRooms, roomVariant);
    if (debugJSONRoom === null) {
      error(`Failed to find JSON room of variant: ${roomVariant}`);
    }
    jsonRoom = debugJSONRoom;
  }

  v.run.seeds.angelEntities = nextSeed(v.run.seeds.angelEntities);
  v.run.seeds.angelEntities = deployJSONRoom(
    jsonRoom,
    v.run.seeds.angelEntities,
  );
}
