import {
  getRandomArrayElement,
  getRandomInt,
  getRooms,
  log,
  nextSeed,
  saveDataManager,
  teleport,
} from "isaacscript-common";
import g from "../../globals";

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
  const roomGridIndexes = getAllRoomGridIndexesForNormalRooms();

  v.level.teleportSeed = nextSeed(v.level.teleportSeed);
  const roomGridIndex = getRandomArrayElement(
    roomGridIndexes,
    v.level.teleportSeed,
  );

  teleport(roomGridIndex, Direction.NO_DIRECTION, RoomTransitionAnim.TELEPORT);
  log(`Seeded teleport to room: ${roomGridIndex}`);

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
    v.level.telepillsSeed = nextSeed(v.level.telepillsSeed);
    const blackMarketRoll = getRandomInt(1, 100, v.level.telepillsSeed);
    if (blackMarketRoll <= 2) {
      insertBlackMarket = true;
    }
  }

  const roomGridIndexes = getAllRoomGridIndexesForNormalRooms();
  if (insertErrorRoom) {
    roomGridIndexes.push(GridRooms.ROOM_ERROR_IDX);
  }
  if (insertBlackMarket) {
    roomGridIndexes.push(GridRooms.ROOM_BLACK_MARKET_IDX);
  }

  // Get a random room index
  v.level.telepillsSeed = nextSeed(v.level.telepillsSeed);
  const roomGridIndex = getRandomArrayElement(
    roomGridIndexes,
    v.level.telepillsSeed,
  );

  teleport(roomGridIndex, Direction.NO_DIRECTION, RoomTransitionAnim.TELEPORT);
}

// ModCallbacks.MC_POST_NEW_LEVEL (18)
export function postNewLevel(): void {
  const levelSeed = g.l.GetDungeonPlacementSeed();

  let incrementedLevelSeed = levelSeed;
  for (let i = 0; i < 100; i++) {
    // Increment the RNG 100 times so that players cannot use knowledge of Teleport! teleports
    // to determine where the Telepills destination will be
    incrementedLevelSeed = nextSeed(incrementedLevelSeed);
  }

  v.level.teleportSeed = levelSeed;
  v.level.telepillsSeed = incrementedLevelSeed;
}

// ModCallbacksCustom.MC_POST_CURSED_TELEPORT
export function postCursedTeleport(_player: EntityPlayer): void {
  log("Cursed Eye / Cursed Skull teleport detected.");
  seededTeleport();
}

function getAllRoomGridIndexesForNormalRooms() {
  // We could filter out our current room, but this would cause problems in seeded races,
  // so seeded races would have to be exempt
  // Thus, don't bother with this in order to keep the behavior consistent through the different
  // types of races
  const roomGridIndexes: int[] = [];
  for (const roomDesc of getRooms()) {
    if (
      roomDesc.SafeGridIndex >= 0 &&
      // Additionally, filter out the Ultra Secret room
      roomDesc.Data !== undefined &&
      roomDesc.Data.Type !== RoomType.ROOM_ULTRASECRET
    ) {
      // We must use the safe grid index or else teleporting to L rooms will fail
      roomGridIndexes.push(roomDesc.SafeGridIndex);
    }
  }

  return roomGridIndexes;
}
