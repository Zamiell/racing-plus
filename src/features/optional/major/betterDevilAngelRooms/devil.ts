import {
  anyPlayerHasTrinket,
  deployJSONRoom,
  emptyRoom,
  getJSONRoomOfVariant,
  getJSONRoomsOfSubType,
  getRandom,
  getRandomJSONRoom,
  JSONRoom,
  nextSeed,
  setRoomUncleared,
} from "isaacscript-common";
import g from "../../../../globals";
import * as devilRooms from "./devilRooms.json";
import v from "./v";

const NORMAL_ROOM_SUBTYPE = 0;
const NUMBER_MAGNET_ROOM_SUBTYPE = 1;
const KRAMPUS_CHANCE = 0.4;

export function devil(): void {
  const hasNumberMagnet = anyPlayerHasTrinket(
    TrinketType.TRINKET_NUMBER_MAGNET,
  );

  // First, find out if we should encounter Krampus instead of getting a normal Devil Room
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
    v.run.seeds.devilSelection = nextSeed(v.run.seeds.devilSelection);
    jsonRoom = getRandomJSONRoom(
      jsonRoomsOfSubType,
      v.run.seeds.devilSelection,
    );
  } else {
    const roomVariant = v.run.debugRoomNum;
    v.run.debugRoomNum = null;

    const debugJSONRoom = getJSONRoomOfVariant(jsonRoomsOfSubType, roomVariant);
    if (debugJSONRoom === undefined) {
      error(`Failed to find JSON room of variant: ${roomVariant}`);
    }
    jsonRoom = debugJSONRoom;
  }

  v.run.seeds.devilEntities = nextSeed(v.run.seeds.devilEntities);
  v.run.seeds.devilEntities = deployJSONRoom(
    jsonRoom,
    v.run.seeds.devilEntities,
  );
}

function checkSpawnKrampus() {
  const devilRoomDeals = g.g.GetDevilRoomDeals();
  const centerPos = g.r.GetCenterPos();

  if (v.run.metKrampus || devilRoomDeals === 0) {
    return false;
  }

  v.run.seeds.krampus = nextSeed(v.run.seeds.krampus);
  const krampusRoll = getRandom(v.run.seeds.krampus);
  if (krampusRoll > KRAMPUS_CHANCE) {
    return false;
  }

  v.run.metKrampus = true;

  emptyRoom(true);

  v.run.seeds.krampus = nextSeed(v.run.seeds.krampus);
  g.g.Spawn(
    EntityType.ENTITY_FALLEN,
    FallenVariant.KRAMPUS,
    centerPos,
    Vector.Zero,
    undefined,
    0,
    v.run.seeds.krampus,
  );

  setRoomUncleared();

  return true;
}
