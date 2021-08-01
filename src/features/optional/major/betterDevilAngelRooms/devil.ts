import { anyPlayerHasTrinket, getRandom } from "isaacscript-common";
import g from "../../../../globals";
import { incrementRNG } from "../../../../util";
import { NORMAL_ROOM_SUBTYPE } from "./constants";
import { getRoomSelection, spawnLuaRoom } from "./rooms";

const NUMBER_MAGNET_ROOM_SUBTYPE = 1;
const KRAMPUS_CHANCE = 0.4;

export default function devil(): void {
  const hasNumberMagnet = anyPlayerHasTrinket(
    TrinketType.TRINKET_NUMBER_MAGNET,
  );

  // First, find out if we should encounter Krampus instead of getting a normal Devil Room
  if (checkSpawnKrampus()) {
    return;
  }

  g.run.seededRooms.RNG.devilSelection = incrementRNG(
    g.run.seededRooms.RNG.devilSelection,
  );
  const roomSubType = hasNumberMagnet
    ? NUMBER_MAGNET_ROOM_SUBTYPE
    : NORMAL_ROOM_SUBTYPE;
  const luaRoom = getRoomSelection(
    true,
    g.run.seededRooms.RNG.devilSelection,
    roomSubType,
  );
  spawnLuaRoom(luaRoom, true);
}

function checkSpawnKrampus() {
  const devilRoomDeals = g.g.GetDevilRoomDeals();
  const centerPos = g.r.GetCenterPos();

  if (g.run.seededRooms.metKrampus || devilRoomDeals === 0) {
    return false;
  }

  g.run.seededRooms.RNG.krampus = incrementRNG(g.run.seededRooms.RNG.krampus);
  const krampusRoll = getRandom(g.run.seededRooms.RNG.krampus);
  if (krampusRoll > KRAMPUS_CHANCE) {
    return false;
  }

  g.run.seededRooms.metKrampus = true;
  Isaac.Spawn(
    EntityType.ENTITY_FALLEN,
    FallenVariant.KRAMPUS,
    0,
    centerPos,
    Vector.Zero,
    null,
  );

  // If we don't set the room clear state, we won't get a charge after Krampus is killed
  g.r.SetClear(false);

  return true;
}
