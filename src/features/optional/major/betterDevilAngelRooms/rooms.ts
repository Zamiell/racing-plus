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
import LuaRoom, { LuaSpawn } from "../../../../types/LuaRoom";
import { incrementRNG } from "../../../../util";
import * as angelRooms from "./angelRooms";
import { NORMAL_ROOM_SUBTYPE } from "./constants";
import convertXMLGridEntityType from "./convertXMLGridEntityType";
import * as devilRooms from "./devilRooms";

export function getRoomSelection(
  devil: boolean,
  seed: int,
  subType = NORMAL_ROOM_SUBTYPE,
): LuaRoom {
  // We cannot import Lua arrays in TSTL,
  // so we instead craft the Lua file to return a table with a single attribute of "room"
  const luaRooms = devil ? devilRooms.room : angelRooms.room;
  const luaRoomsWithSubType = getRoomsWithSubType(luaRooms, subType);

  // Since each room has an individual weight, we need to get a random weighted selection
  // Algorithm from: https://stackoverflow.com/questions/1761626/weighted-random-numbers
  const totalWeight = getTotalWeight(luaRoomsWithSubType);
  const chosenWeight = getRandomFloat(0, totalWeight, seed);
  return getRoomWithChosenWeight(luaRoomsWithSubType, chosenWeight);
}

function getTotalWeight(luaRooms: LuaRoom[]) {
  let totalWeight = 0;
  for (const luaRoom of luaRooms) {
    // eslint-disable-next-line no-underscore-dangle
    const roomWeightString = luaRoom._attr.weight;
    const roomWeight = tonumber(roomWeightString);
    if (roomWeight === undefined) {
      error(`Failed to parse the weight of a room: ${roomWeightString}.`);
    }

    totalWeight += roomWeight;
  }

  return totalWeight;
}

function getRoomWithChosenWeight(luaRooms: LuaRoom[], chosenWeight: float) {
  for (const luaRoom of luaRooms) {
    // eslint-disable-next-line no-underscore-dangle
    const roomWeightString = luaRoom._attr.weight;
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

function getRoomsWithSubType(luaRooms: LuaRoom[], subType: int) {
  const matchingRooms: LuaRoom[] = [];

  for (const room of luaRooms) {
    // eslint-disable-next-line no-underscore-dangle
    const roomSubTypeString = room._attr.subtype;
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

export function spawnLuaRoom(luaRoom: LuaRoom, devil: boolean): void {
  const roomName = luaRoom._attr.name; // eslint-disable-line no-underscore-dangle
  const roomVariant = luaRoom._attr.variant; // eslint-disable-line no-underscore-dangle
  const roomType = devil ? "Devil" : "Angel";
  const spawns = luaRoom.spawn;

  log(`Selected ${roomType} Room #${roomVariant}: ${roomName}`);
  spawnAllEntities(spawns, devil);
  fixPitGraphics();
}

function spawnAllEntities(spawns: LuaSpawn[], devil: boolean) {
  for (const spawn of spawns) {
    // eslint-disable-next-line no-underscore-dangle
    const xString = spawn._attr.x;
    const x = tonumber(xString);
    if (x === undefined) {
      error(
        `Failed to convert the following x coordinate for a spawn a number: ${xString}`,
      );
    }

    // eslint-disable-next-line no-underscore-dangle
    const yString = spawn._attr.y;
    const y = tonumber(yString);
    if (y === undefined) {
      error(
        `Failed to convert the following y coordinate for a spawn a number: ${yString}`,
      );
    }

    // eslint-disable-next-line no-underscore-dangle
    const entityTypeString = spawn.entity._attr.type;
    const entityType = tonumber(entityTypeString);
    if (entityType === undefined) {
      error(
        `Failed to convert the entity type to a number: ${entityTypeString}`,
      );
    }

    // eslint-disable-next-line no-underscore-dangle
    const variantString = spawn.entity._attr.variant;
    const variant = tonumber(variantString);
    if (variant === undefined) {
      error(`Failed to convert the entity variant to a number: ${variant}`);
    }

    // eslint-disable-next-line no-underscore-dangle
    const subtypeString = spawn.entity._attr.subtype;
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
  const [entityType, variant] = convertXMLGridEntityType(
    xmlEntityType,
    xmlEntityVariant,
  );
  const position = gridToPos(x, y);
  const gridEntity = Isaac.GridSpawn(entityType, variant, position, true);

  // For some reason, spawned pits start with a collision class of COLLISION_NONE,
  // so we have to manually set it
  if (entityType === GridEntityType.GRID_PIT) {
    gridEntity.CollisionClass = GridCollisionClass.COLLISION_PIT;
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
  g.g.Spawn(entityType, variant, position, Vector.Zero, null, subtype, seed);
}

function getEntitySeed(devil: boolean) {
  if (devil) {
    g.run.seededRooms.RNG.devilEntities = incrementRNG(
      g.run.seededRooms.RNG.devilEntities,
    );
    return g.run.seededRooms.RNG.devilEntities;
  }

  g.run.seededRooms.RNG.angelEntities = incrementRNG(
    g.run.seededRooms.RNG.angelEntities,
  );
  return g.run.seededRooms.RNG.angelEntities;
}

// By default, when spawning multiple pits next to each other, the graphics will not "meld" together
// Thus, now that all of the entities in the room are spawned, we must iterate over the pits in the
// room and manually fix their sprites, if necessary
function fixPitGraphics() {
  // TODO
  // const getPitMap

  for (const gridEntity of getGridEntities()) {
    const saveState = gridEntity.GetSaveState();
    if (saveState.Type === GridEntityType.GRID_PIT) {
    }
  }
}
