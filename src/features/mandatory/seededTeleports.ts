import {
  getRandomArrayElement,
  getRandomInt,
  log,
  saveDataManager,
} from "isaacscript-common";
import g from "../../globals";
import { incrementRNG } from "../../util";
import { teleport } from "../../utilGlobals";

const v = {
  level: {
    teleportSeed: 0,
    telepillsSeed: 0,
  },
};

export function init(): void {
  saveDataManager("seededTeleports", v);
}

// ModCallbacks.MC_USE_ITEM (3)
// CollectibleType.COLLECTIBLE_TELEPORT (44)
// This callback is used naturally by Broken Remote
export function useItemTeleport(): void {
  seededTeleport();
}

// This callback is manually called for Cursed Eye
function seededTeleport() {
  const rooms = g.l.GetRooms();

  // Filter out the Ultra Secret room
  // We could also filter out our current room, but this would cause problems in seeded races,
  // so seeded races would have to be exempt
  // Thus, don't bother with this in order to keep the behavior consistent through the different
  // types of races
  const roomIndexes: int[] = [];
  for (let i = 0; i < rooms.Size; i++) {
    const room = rooms.Get(i);
    if (
      room !== null &&
      room.Data !== null &&
      room.Data.Type !== RoomType.ROOM_ULTRASECRET
    ) {
      // We must use the safe grid index or else teleporting to L rooms will fail
      roomIndexes.push(room.SafeGridIndex);
    }
  }

  v.level.teleportSeed = incrementRNG(v.level.teleportSeed);
  const roomIndex = getRandomArrayElement(roomIndexes, v.level.teleportSeed);

  teleport(roomIndex, Direction.NO_DIRECTION, RoomTransitionAnim.TELEPORT);
  log(`Seeded teleport to room: ${roomIndex}`);

  // Even though the player has already started teleporting to a different room,
  // the above call will override the existing effect
}

// ModCallbacks.MC_USE_PILL (10)
// PillEffect.PILLEFFECT_TELEPILLS (19)
export function usePillTelepills(): void {
  seededTelepills();
}

function seededTelepills() {
  const stage = g.l.GetStage();
  const rooms = g.l.GetRooms();

  // Telepills works in a way similar to Teleport!, but the possibilities can also include the
  // I AM ERROR room and the Black Market
  // Thus, we have to build a room index array manually, which makes the logic more complicated

  // It is not possible to teleport to I AM ERROR rooms and Black Markets on The Chest / Dark Room
  let insertErrorRoom = false;
  let insertBlackMarket = false;
  if (stage !== 11) {
    insertErrorRoom = true;

    // There is a 2% chance have a Black Market inserted into the list of possibilities
    // (according to Blade)
    v.level.telepillsSeed = incrementRNG(v.level.telepillsSeed);
    const blackMarketRoll = getRandomInt(1, 100, v.level.telepillsSeed);
    if (blackMarketRoll <= 2) {
      insertBlackMarket = true;
    }
  }

  // Find the indexes for all of the room possibilities
  const roomIndexes: int[] = [];
  for (let i = 0; i < rooms.Size; i++) {
    const room = rooms.Get(i); // This is 0 indexed
    if (room === null) {
      continue;
    }

    // We need to use SafeGridIndex instead of GridIndex because we will crash when teleporting to
    // L rooms otherwise
    roomIndexes.push(room.SafeGridIndex);
  }
  if (insertErrorRoom) {
    roomIndexes.push(GridRooms.ROOM_ERROR_IDX);
  }
  if (insertBlackMarket) {
    roomIndexes.push(GridRooms.ROOM_BLACK_MARKET_IDX);
  }

  // Get a random room index
  v.level.telepillsSeed = incrementRNG(v.level.telepillsSeed);
  const gridIndex = getRandomArrayElement(roomIndexes, v.level.telepillsSeed);

  teleport(gridIndex, Direction.NO_DIRECTION, RoomTransitionAnim.TELEPORT);
}

// ModCallbacks.MC_POST_NEW_LEVEL (18)
export function postNewLevel(): void {
  const levelSeed = g.l.GetDungeonPlacementSeed();

  let incrementedLevelSeed = levelSeed;
  for (let i = 0; i < 100; i++) {
    // Increment the RNG 100 times so that players cannot use knowledge of Teleport! teleports
    // to determine where the Telepills destination will be
    incrementedLevelSeed = incrementRNG(incrementedLevelSeed);
  }

  v.level.teleportSeed = levelSeed;
  v.level.telepillsSeed = incrementedLevelSeed;
}

// ModCallbacksCustom.MC_POST_CURSED_TELEPORT
export function postCursedTeleport(_player: EntityPlayer): void {
  log("Cursed Eye / Cursed Skull teleport detected.");
  seededTeleport();
}
