import { anyPlayerHasTrinket, getDoors, getRandom } from "isaacscript-common";
import g from "../../../../globals";
import { incrementRNG } from "../../../../util";
import { NORMAL_ROOM_SUBTYPE } from "./constants";
import { getRoomDebug, getRoomSelection, spawnLuaRoom } from "./rooms";
import v from "./v";

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

  v.run.seeds.devilSelection = incrementRNG(v.run.seeds.devilSelection);
  const roomSubType = hasNumberMagnet
    ? NUMBER_MAGNET_ROOM_SUBTYPE
    : NORMAL_ROOM_SUBTYPE;
  let luaRoom = getRoomSelection(true, v.run.seeds.devilSelection, roomSubType);

  if (v.run.debugRoomNum !== null) {
    luaRoom = getRoomDebug(true, v.run.debugRoomNum, roomSubType);
    v.run.debugRoomNum = null;
  }

  spawnLuaRoom(luaRoom, true);

  if (hasNumberMagnet) {
    prepareRoomSinceEnemiesSpawned();
  }
}

function checkSpawnKrampus() {
  const devilRoomDeals = g.g.GetDevilRoomDeals();
  const centerPos = g.r.GetCenterPos();

  if (v.run.metKrampus || devilRoomDeals === 0) {
    return false;
  }

  v.run.seeds.krampus = incrementRNG(v.run.seeds.krampus);
  const krampusRoll = getRandom(v.run.seeds.krampus);
  if (krampusRoll > KRAMPUS_CHANCE) {
    return false;
  }

  v.run.metKrampus = true;
  Isaac.Spawn(
    EntityType.ENTITY_FALLEN,
    FallenVariant.KRAMPUS,
    0,
    centerPos,
    Vector.Zero,
    null,
  );

  prepareRoomSinceEnemiesSpawned();

  return true;
}

function prepareRoomSinceEnemiesSpawned() {
  // If we don't set the room clear state, we won't get a charge after the enemies are killed
  g.r.SetClear(false);

  // We manually opened the doors earlier, so manually set them back to being closed
  for (const door of getDoors()) {
    door.State = DoorState.STATE_CLOSED;
    const sprite = door.GetSprite();
    sprite.Play("Close", true);
  }
}
