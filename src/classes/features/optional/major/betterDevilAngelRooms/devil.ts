import {
  EntityType,
  FallenVariant,
  RoomType,
  TrinketType,
} from "isaac-typescript-definitions";
import type { JSONRoom } from "isaacscript-common";
import {
  anyPlayerHasTrinket,
  emptyRoom,
  game,
  getJSONRoomOfVariant,
  getJSONRoomsOfSubType,
  getRandom,
  getRandomJSONRoom,
  inRoomType,
  setRoomUncleared,
  spawnWithSeed,
} from "isaacscript-common";
import * as devilRooms from "../../../../../json/devilRooms.json";
import { mod } from "../../../../../mod";
import { getEffectiveDevilDeals } from "../../../../../utils";
import { v } from "./v";

const NORMAL_ROOM_SUBTYPE = 0;
const NUMBER_MAGNET_ROOM_SUBTYPE = 1;
const KRAMPUS_CHANCE = 0.4; // Matches vanilla

export function setupSeededDevilRoom(): void {
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

  mod.deployJSONRoom(jsonRoom, v.run.rng.devilEntities);
}

function checkSpawnKrampus() {
  const room = game.GetRoom();
  const centerPos = room.GetCenterPos();
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
  v.level.spawnedKrampusOnThisFloor = true;

  emptyRoom();
  mod.preventGridEntityRespawn();

  const seed = v.run.rng.krampus.Next();
  spawnWithSeed(EntityType.FALLEN, FallenVariant.KRAMPUS, 0, centerPos, seed);

  setRoomUncleared();

  return true;
}

export function checkRespawnKrampus(): void {
  const room = game.GetRoom();
  const centerPos = room.GetCenterPos();

  if (!inRoomType(RoomType.DEVIL)) {
    return;
  }

  if (v.level.spawnedKrampusOnThisFloor && !v.level.killedKrampusOnThisFloor) {
    const seed = v.run.rng.krampus.GetSeed();
    spawnWithSeed(EntityType.FALLEN, FallenVariant.KRAMPUS, 0, centerPos, seed);

    setRoomUncleared();
  }
}
