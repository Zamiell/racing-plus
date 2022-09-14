import {
  Direction,
  GridRoom,
  LevelStage,
  RoomTransitionAnim,
  RoomType,
} from "isaac-typescript-definitions";
import {
  getRandomArrayElement,
  getRandomInt,
  getRooms,
  log,
  newRNG,
  repeat,
  saveDataManager,
  setSeed,
  teleport,
} from "isaacscript-common";
import g from "../../globals";

const v = {
  level: {
    rng: {
      teleport: newRNG(),
      telepills: newRNG(),
    },
  },
};

export function init(): void {
  saveDataManager("seededTeleports", v);
}

// ModCallback.POST_USE_ITEM (3)
// CollectibleType.TELEPORT (44)
// This callback is used naturally by Broken Remote.
export function postUseItemTeleport(): void {
  seededTeleport();
}

/** This callback is manually called for Cursed Eye. */
function seededTeleport() {
  const roomGridIndexes = getAllRoomGridIndexesForNormalRooms();

  const roomGridIndex = getRandomArrayElement(
    roomGridIndexes,
    v.level.rng.teleport,
  );

  teleport(roomGridIndex, Direction.NO_DIRECTION, RoomTransitionAnim.TELEPORT);
  log(`Seeded teleport to room: ${roomGridIndex}`);

  // Even though the player has already started teleporting to a different room, the above call will
  // override the existing effect.
}

// ModCallback.POST_USE_PILL (10)
// PillEffect.TELEPILLS (19)
export function usePillTelepills(): void {
  seededTelepills();
}

function seededTelepills() {
  const stage = g.l.GetStage();

  // Telepills works in a way similar to Teleport!, but the possibilities can also include the I AM
  // ERROR room and the Black Market. Thus, we have to build a room index array manually, which
  // makes the logic more complicated.

  // It is not possible to teleport to I AM ERROR rooms and Black Markets on The Chest / Dark Room.
  let insertErrorRoom = false;
  let insertBlackMarket = false;
  if (stage !== LevelStage.DARK_ROOM_CHEST) {
    insertErrorRoom = true;

    // There is a 2% chance have a Black Market inserted into the list of possibilities (according
    // to Blade).
    const blackMarketRoll = getRandomInt(1, 100, v.level.rng.telepills);
    if (blackMarketRoll <= 2) {
      insertBlackMarket = true;
    }
  }

  const roomGridIndexes = getAllRoomGridIndexesForNormalRooms();
  if (insertErrorRoom) {
    roomGridIndexes.push(GridRoom.ERROR);
  }
  if (insertBlackMarket) {
    roomGridIndexes.push(GridRoom.BLACK_MARKET);
  }

  // Get a random room index.
  const roomGridIndex = getRandomArrayElement(
    roomGridIndexes,
    v.level.rng.telepills,
  );

  teleport(roomGridIndex, Direction.NO_DIRECTION, RoomTransitionAnim.TELEPORT);
}

// ModCallback.POST_NEW_LEVEL (18)
export function postNewLevel(): void {
  const levelSeed = g.l.GetDungeonPlacementSeed();

  setSeed(v.level.rng.teleport, levelSeed);
  setSeed(v.level.rng.telepills, levelSeed);

  // We want to ensure that the RNG object for Telepills does not overlap with the teleport one.
  // (The most teleports that you could do per floor in a typical speedrun would be around 100.)
  repeat(100, () => {
    v.level.rng.telepills.Next();
  });
}

// ModCallbackCustom.POST_CURSED_TELEPORT
export function postCursedTeleport(_player: EntityPlayer): void {
  log("Cursed Eye / Cursed Skull teleport detected.");
  seededTeleport();
}

function getAllRoomGridIndexesForNormalRooms() {
  // We could filter out our current room, but this would cause problems in seeded races, so seeded
  // races would have to be exempt. Thus, don't bother with this in order to keep the behavior
  // consistent through the different types of races.
  const roomGridIndexes: int[] = [];
  for (const roomDesc of getRooms()) {
    if (
      roomDesc.SafeGridIndex >= 0 &&
      // Additionally, filter out the Ultra Secret room.
      roomDesc.Data !== undefined &&
      roomDesc.Data.Type !== RoomType.ULTRA_SECRET
    ) {
      // We must use the safe grid index or else teleporting to L rooms will fail.
      roomGridIndexes.push(roomDesc.SafeGridIndex);
    }
  }

  return roomGridIndexes;
}
