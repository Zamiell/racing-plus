import {
  EntityType,
  FallenVariant,
  TrinketType,
} from "isaac-typescript-definitions";
import {
  anyPlayerHasTrinket,
  deployJSONRoom,
  emptyRoom,
  getJSONRoomOfVariant,
  getJSONRoomsOfSubType,
  getRandom,
  getRandomJSONRoom,
  JSONRoom,
  setRoomUncleared,
  spawnWithSeed,
} from "isaacscript-common";
import g from "../../../../globals";
import { getEffectiveDevilDeals } from "../../../../utils";
import * as devilRooms from "./devilRooms.json";
import v from "./v";

const NORMAL_ROOM_SUBTYPE = 0;
const NUMBER_MAGNET_ROOM_SUBTYPE = 1;
const KRAMPUS_CHANCE = 0.4; // Matches vanilla

export function devil(): void {
  const hasNumberMagnet = anyPlayerHasTrinket(TrinketType.NUMBER_MAGNET);

  // First, find out if we should encounter Krampus instead of getting a normal Devil Room.
  if (!hasNumberMagnet && checkSpawnKrampus()) {
    return;
  }

  const jsonRooms = devilRooms.rooms.room;
  const subType = hasNumberMagnet
    ? NUMBER_MAGNET_ROOM_SUBTYPE
    : NORMAL_ROOM_SUBTYPE;
  const jsonRoomsOfSubType = getJSONRoomsOfSubType(jsonRooms, subType);

  let jsonRoom: JSONRoom;
  if (v.run.debugRoomNum === null) {
    jsonRoom = getRandomJSONRoom(jsonRoomsOfSubType, v.run.rng.devilSelection);
  } else {
    const roomVariant = v.run.debugRoomNum;
    v.run.debugRoomNum = null;

    const debugJSONRoom = getJSONRoomOfVariant(jsonRoomsOfSubType, roomVariant);
    if (debugJSONRoom === undefined) {
      error(`Failed to find JSON room of variant: ${roomVariant}`);
    }
    jsonRoom = debugJSONRoom;
  }

  deployJSONRoom(jsonRoom, v.run.rng.devilEntities);
}

function checkSpawnKrampus() {
  const centerPos = g.r.GetCenterPos();
  const effectiveDevilDeals = getEffectiveDevilDeals();

  if (
    v.run.metKrampus ||
    effectiveDevilDeals === 0 ||
    // Number Magnet prevents Krampus from appearing.
    anyPlayerHasTrinket(TrinketType.NUMBER_MAGNET)
  ) {
    return false;
  }

  const krampusRoll = getRandom(v.run.rng.krampus);
  if (krampusRoll > KRAMPUS_CHANCE) {
    return false;
  }

  v.run.metKrampus = true;
  emptyRoom(true);

  const seed = v.run.rng.krampus.Next();
  spawnWithSeed(EntityType.FALLEN, FallenVariant.KRAMPUS, 0, centerPos, seed);

  setRoomUncleared();

  return true;
}
