// We use Basement Renovator to create custom Devil Rooms and Angel Rooms
// These are saved into separate XML files called "devilRooms.xml" and "angelRooms.xml"
// Then, we use the "convert-xml-to-lua.lua" script to convert the XML to a Lua table that can be
// imported as a module

import {
  getGridEntities,
  getRandomFloat,
  gridToPos,
  log,
} from "isaacscript-common";
import g from "../../../../globals";
import JSONRoom, { JSONSpawn } from "../../../../types/JSONRoom";
import { incrementRNG } from "../../../../util";
import { spawnCollectible } from "../../../../utilGlobals";
import * as angelRooms from "./angelRooms.json";
import { NORMAL_ROOM_SUBTYPE } from "./constants";
import convertXMLGridEntityType from "./convertXMLGridEntityType";
import * as devilRooms from "./devilRooms.json";
import v from "./v";

const GRID_SQUARES_PER_ROW = 15;

const PERSISTENT_ENTITY_TYPES = [EntityType.ENTITY_WALL_HUGGER];

export function getRoomSelection(
  devil: boolean,
  seed: int,
  subType = NORMAL_ROOM_SUBTYPE,
): JSONRoom {
  const roomsJSON = devil ? devilRooms : angelRooms;
  const rooms = roomsJSON.rooms.room;
  const luaRoomsWithSubType = getRoomsWithSubType(rooms, subType);

  // Since each room has an individual weight, we need to get a random weighted selection
  // Algorithm from: https://stackoverflow.com/questions/1761626/weighted-random-numbers
  const totalWeight = getTotalWeight(luaRoomsWithSubType);
  const chosenWeight = getRandomFloat(0, totalWeight, seed);
  return getRoomWithChosenWeight(luaRoomsWithSubType, chosenWeight);
}

function getRoomsWithSubType(rooms: JSONRoom[], subType: int) {
  const matchingRooms: JSONRoom[] = [];

  for (const room of rooms) {
    const roomSubTypeString = room["@subtype"];
    const roomSubType = tonumber(roomSubTypeString);
    if (roomSubType === undefined) {
      error(`Failed to parse the subtype of a room: ${roomSubTypeString}`);
    }

    if (roomSubType === subType) {
      matchingRooms.push(room);
    }
  }

  return matchingRooms;
}

function getTotalWeight(luaRooms: JSONRoom[]) {
  let totalWeight = 0;
  for (const luaRoom of luaRooms) {
    const roomWeightString = luaRoom["@weight"];
    const roomWeight = tonumber(roomWeightString);
    if (roomWeight === undefined) {
      error(`Failed to parse the weight of a room: ${roomWeightString}.`);
    }

    totalWeight += roomWeight;
  }

  return totalWeight;
}

function getRoomWithChosenWeight(luaRooms: JSONRoom[], chosenWeight: float) {
  for (const luaRoom of luaRooms) {
    const roomWeightString = luaRoom["@weight"];
    const roomWeight = tonumber(roomWeightString);
    if (roomWeight === undefined) {
      error(`Failed to parse the weight of a room: ${roomWeightString}`);
    }

    if (chosenWeight < roomWeight) {
      return luaRoom;
    }

    chosenWeight -= roomWeight;
  }

  error(`Failed to get a room with chosen weight: ${chosenWeight}`);
  return luaRooms[0];
}

export function spawnLuaRoom(luaRoom: JSONRoom, devil: boolean): void {
  const roomName = luaRoom["@name"];
  const roomVariant = luaRoom["@variant"];
  const roomType = devil ? "Devil" : "Angel";
  const spawns = luaRoom.spawn;

  log(`Selected ${roomType} Room #${roomVariant}: ${roomName}`);
  spawnAllEntities(spawns, devil);
  fixPitGraphics();
}

function spawnAllEntities(spawns: JSONSpawn[], devil: boolean) {
  for (const spawn of spawns) {
    const xString = spawn["@x"];
    const x = tonumber(xString);
    if (x === undefined) {
      error(
        `Failed to convert the following x coordinate for a spawn a number: ${xString}`,
      );
    }

    const yString = spawn["@y"];
    const y = tonumber(yString);
    if (y === undefined) {
      error(
        `Failed to convert the following y coordinate for a spawn a number: ${yString}`,
      );
    }

    const entityTypeString = spawn.entity["@type"];
    const entityType = tonumber(entityTypeString);
    if (entityType === undefined) {
      error(
        `Failed to convert the entity type to a number: ${entityTypeString}`,
      );
    }

    const variantString = spawn.entity["@variant"];
    const variant = tonumber(variantString);
    if (variant === undefined) {
      error(`Failed to convert the entity variant to a number: ${variant}`);
    }

    const subtypeString = spawn.entity["@subtype"];
    const subtype = tonumber(subtypeString);
    if (subtype === undefined) {
      error(`Failed to convert the entity subtype to a number: ${subtype}`);
    }

    if (entityType >= 1000) {
      spawnGridEntity(entityType, variant, x, y);
    } else {
      spawnNormalEntity(entityType, variant, subtype, x, y, devil);
    }
  }
}

function spawnGridEntity(
  xmlEntityType: int,
  xmlEntityVariant: int,
  x: int,
  y: int,
) {
  const gridEntityArray = convertXMLGridEntityType(
    xmlEntityType,
    xmlEntityVariant,
  );
  if (gridEntityArray === null) {
    return;
  }
  const [entityType, variant] = gridEntityArray;
  const position = gridToPos(x, y);
  const gridEntity = Isaac.GridSpawn(entityType, variant, position, true);

  // For some reason, spawned pits start with a collision class of COLLISION_NONE,
  // so we have to manually set it
  if (entityType === GridEntityType.GRID_PIT) {
    // const gridIndex = g.r.GetGridIndex(gridEntity.Position);
    // g.r.SetGridPath(gridIndex, GridPath.PIT);
    const pit = gridEntity.ToPit();
    if (pit !== null) {
      pit.UpdateCollision();
    }
  }

  // Prevent poops from playing an appear animation, since it is distracting
  if (entityType === GridEntityType.GRID_POOP) {
    const sprite = gridEntity.GetSprite();
    sprite.Play("State1", true);
    sprite.SetLastFrame();
  }
}

function spawnNormalEntity(
  entityType: int,
  variant: int,
  subtype: int,
  x: int,
  y: int,
  devil: boolean,
) {
  const position = gridToPos(x, y);
  const seed = getEntitySeed(devil);

  let entity;
  if (
    entityType === EntityType.ENTITY_PICKUP &&
    variant === PickupVariant.PICKUP_COLLECTIBLE
  ) {
    const shouldBeOptionsItem = !devil;
    entity = spawnCollectible(subtype, position, seed, shouldBeOptionsItem);
  } else {
    entity = g.g.Spawn(
      entityType,
      variant,
      position,
      Vector.Zero,
      null,
      subtype,
      seed,
    );
  }

  if (entity !== null) {
    storePersistentEntity(entity);
  }
}

function getEntitySeed(devil: boolean) {
  if (devil) {
    v.run.seeds.devilEntities = incrementRNG(v.run.seeds.devilEntities);
    return v.run.seeds.devilEntities;
  }

  v.run.seeds.angelEntities = incrementRNG(v.run.seeds.angelEntities);
  return v.run.seeds.angelEntities;
}

function storePersistentEntity(entity: Entity) {
  if (PERSISTENT_ENTITY_TYPES.includes(entity.Type)) {
    const gridIndex = g.r.GetGridIndex(entity.Position);
    const persistentEntity = {
      gridIndex,
      type: entity.Type,
      variant: entity.Variant,
      subType: entity.SubType,
    };
    v.level.persistentEntities.push(persistentEntity);
  }
}

// By default, when spawning multiple pits next to each other, the graphics will not "meld" together
// Thus, now that all of the entities in the room are spawned, we must iterate over the pits in the
// room and manually fix their sprites, if necessary
function fixPitGraphics() {
  const pitMap = getPitMap();

  for (const [gridIndex, gridEntity] of pitMap) {
    const gridIndexLeft = gridIndex - 1;
    const L = pitMap.has(gridIndexLeft);
    const gridIndexRight = gridIndex + 1;
    const R = pitMap.has(gridIndexRight);
    const gridIndexUp = gridIndex - GRID_SQUARES_PER_ROW;
    const U = pitMap.has(gridIndexUp);
    const gridIndexDown = gridIndex + GRID_SQUARES_PER_ROW;
    const D = pitMap.has(gridIndexDown);
    const gridIndexUpLeft = gridIndex - GRID_SQUARES_PER_ROW - 1;
    const UL = pitMap.has(gridIndexUpLeft);
    const gridIndexUpRight = gridIndex - GRID_SQUARES_PER_ROW + 1;
    const UR = pitMap.has(gridIndexUpRight);
    const gridIndexDownLeft = gridIndex + GRID_SQUARES_PER_ROW - 1;
    const DL = pitMap.has(gridIndexDownLeft);
    const gridIndexDownRight = gridIndex + GRID_SQUARES_PER_ROW + 1;
    const DR = pitMap.has(gridIndexDownRight);

    const pitFrame = getPitFrame(L, R, U, D, UL, UR, DL, DR);
    const sprite = gridEntity.GetSprite();
    sprite.SetFrame(pitFrame);
  }
}

function getPitMap() {
  const pitMap = new Map<int, GridEntity>();
  for (const gridEntity of getGridEntities()) {
    const gridEntityType = gridEntity.GetType();
    if (gridEntityType === GridEntityType.GRID_PIT) {
      const gridIndex = gridEntity.GetGridIndex();
      pitMap.set(gridIndex, gridEntity);
    }
  }

  return pitMap;
}

// Copied from Basement Renovator
function getPitFrame(
  L: boolean,
  R: boolean,
  U: boolean,
  D: boolean,
  UL: boolean,
  UR: boolean,
  DL: boolean,
  DR: boolean,
) {
  let F = 0;

  // First bitwise frames (works for all combinations of just left up right and down)
  if (L) {
    F |= 1;
  }
  if (U) {
    F |= 2;
  }
  if (R) {
    F |= 4;
  }
  if (D) {
    F |= 8;
  }

  // Then a bunch of other combinations
  if (U && L && !UL && !R && !D) {
    F = 17;
  }
  if (U && R && !UR && !L && !D) {
    F = 18;
  }
  if (L && D && !DL && !U && !R) {
    F = 19;
  }
  if (R && D && !DR && !L && !U) {
    F = 20;
  }
  if (L && U && R && D && !UL) {
    F = 21;
  }
  if (L && U && R && D && !UR) {
    F = 22;
  }
  if (U && R && D && !L && !UR) {
    F = 25;
  }
  if (L && U && D && !R && !UL) {
    F = 26;
  }

  if (L && U && R && D && !DL && !DR) {
    F = 24;
  }
  if (L && U && R && D && !UR && !UL) {
    F = 23;
  }
  if (L && U && R && UL && !UR && !D) {
    F = 27;
  }
  if (L && U && R && UR && !UL && !D) {
    F = 28;
  }
  if (L && U && R && !D && !UR && !UL) {
    F = 29;
  }
  if (L && R && D && DL && !U && !DR) {
    F = 30;
  }
  if (L && R && D && DR && !U && !DL) {
    F = 31;
  }
  if (L && R && D && !U && !DL && !DR) {
    F = 32;
  }

  return F;
}

export function getRoomDebug(
  devil: boolean,
  specificRoomVariant: int,
  subType = NORMAL_ROOM_SUBTYPE,
): JSONRoom {
  const roomsJSON = devil ? devilRooms : angelRooms;
  const rooms = roomsJSON.rooms.room;
  const luaRooms = getRoomsWithSubType(rooms, subType);

  for (const luaRoom of luaRooms) {
    const roomVariantString = luaRoom["@variant"];
    const roomVariant = tonumber(roomVariantString);
    if (roomVariant === undefined) {
      error(`Failed to parse the variant of a room: ${roomVariantString}`);
    }

    if (roomVariant === specificRoomVariant) {
      return luaRoom;
    }
  }

  error(`Failed to get a room with specific variant: ${specificRoomVariant}`);
  return luaRooms[0];
}
