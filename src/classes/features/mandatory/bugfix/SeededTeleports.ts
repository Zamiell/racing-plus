import {
  CollectibleType,
  Direction,
  GridRoom,
  LevelStage,
  ModCallback,
  PillEffect,
  RoomTransitionAnim,
  RoomType,
} from "isaac-typescript-definitions";
import {
  Callback,
  CallbackCustom,
  game,
  getRandomArrayElement,
  getRandomInt,
  getRooms,
  ModCallbackCustom,
  newRNG,
  onStage,
  repeat,
  setSeed,
  teleport,
} from "isaacscript-common";
import { MandatoryModFeature } from "../../../MandatoryModFeature";

const v = {
  level: {
    rng: {
      teleport: newRNG(),
      telepills: newRNG(),
    },
  },
};

export class SeededTeleports extends MandatoryModFeature {
  v = v;

  /** This callback is used naturally by Broken Remote. */
  // 3, 44
  @Callback(ModCallback.POST_USE_ITEM, CollectibleType.TELEPORT)
  postUseItemTeleport(): boolean | undefined {
    seededTeleport();
    return undefined;
  }

  // 10, 19
  @Callback(ModCallback.POST_USE_PILL, PillEffect.TELEPILLS)
  postUsePillTelepills(): void {
    this.seededTelepills();
  }

  /**
   * Telepills works in a way similar to Teleport!, but the possibilities can also include the I AM
   * ERROR room and the Black Market. Thus, we have to build a room index array manually, which
   * makes the logic more complicated.
   */
  seededTelepills(): void {
    // It is not possible to teleport to I AM ERROR rooms and Black Markets on The Chest / Dark
    // Room.
    let insertErrorRoom = false;
    let insertBlackMarket = false;
    if (!onStage(LevelStage.DARK_ROOM_CHEST)) {
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

    teleport(
      roomGridIndex,
      Direction.NO_DIRECTION,
      RoomTransitionAnim.TELEPORT,
    );
  }

  @CallbackCustom(ModCallbackCustom.POST_CURSED_TELEPORT)
  postCursedTeleport(_player: EntityPlayer): void {
    seededTeleport();
  }

  @CallbackCustom(ModCallbackCustom.POST_NEW_LEVEL_REORDERED)
  postNewLevelReordered(): void {
    const level = game.GetLevel();
    const levelSeed = level.GetDungeonPlacementSeed();

    setSeed(v.level.rng.teleport, levelSeed);
    setSeed(v.level.rng.telepills, levelSeed);

    // We want to ensure that the RNG object for Telepills does not overlap with the teleport one.
    // (The most teleports that you could do per floor in a typical speedrun would be around 100.)
    repeat(100, () => {
      v.level.rng.telepills.Next();
    });
  }
}

function seededTeleport() {
  const roomGridIndexes = getAllRoomGridIndexesForNormalRooms();

  const roomGridIndex = getRandomArrayElement(
    roomGridIndexes,
    v.level.rng.teleport,
  );

  teleport(roomGridIndex, Direction.NO_DIRECTION, RoomTransitionAnim.TELEPORT);

  // Even though the player has already started teleporting to a different room, the above call will
  // override the existing effect.
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
