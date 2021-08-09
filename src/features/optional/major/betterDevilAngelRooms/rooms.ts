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
import * as angelRooms from "./angelRooms.json";
import { NORMAL_ROOM_SUBTYPE } from "./constants";
import convertXMLGridEntityType from "./convertXMLGridEntityType";
import * as devilRooms from "./devilRooms.json";

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
  const entity = g.g.Spawn(
    entityType,
    variant,
    position,
    Vector.Zero,
    null,
    subtype,
    seed,
  );

  // removePitfallAnimationPostSpawn(entity);
  setAngelItemOptions(entity);
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

function setAngelItemOptions(entity: Entity) {
  const roomType = g.r.GetType();

  // Pedestal items in Angel Rooms should disappear as soon as one of them is taken
  if (
    entity.Type === EntityType.ENTITY_PICKUP &&
    entity.Variant === PickupVariant.PICKUP_COLLECTIBLE &&
    roomType === RoomType.ROOM_ANGEL
  ) {
    const pickup = entity.ToPickup();
    if (pickup !== null) {
      pickup.OptionsPickupIndex = 1;
    }
  }
}

// By default, when spawning multiple pits next to each other, the graphics will not "meld" together
// Thus, now that all of the entities in the room are spawned, we must iterate over the pits in the
// room and manually fix their sprites, if necessary
function fixPitGraphics() {
  // TODO
  const pitMap = getPitMap();

  for (const gridEntity of getGridEntities()) {
    const gridEntityType = gridEntity.GetType();
    if (gridEntityType === GridEntityType.GRID_PIT) {
      Isaac.DebugString(pitMap);
    }
  }
}

function getPitMap() {
  return "1";
}
