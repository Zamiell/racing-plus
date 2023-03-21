import {
  CollectibleType,
  ModCallback,
  PickupVariant,
  RoomType,
} from "isaac-typescript-definitions";
import {
  Callback,
  ReadonlySet,
  game,
  isGlitchedCollectible,
} from "isaacscript-common";
import { mod } from "../../../../mod";
import { MandatoryModFeature } from "../../../MandatoryModFeature";

const DEFAULT_REPLACEMENT_COLLECTIBLE = CollectibleType.SAD_ONION;

const ROOM_TYPES_TO_CHECK = new ReadonlySet<RoomType>([
  RoomType.SECRET,
  RoomType.ERROR,
]);

const v = {
  room: {
    /** Indexed by InitSeed. */
    collectibleMap: new Map<int, CollectibleType>(),
  },
};

export class RemoveGlitchedItems extends MandatoryModFeature {
  v = v;

  // 35, 100
  @Callback(ModCallback.POST_PICKUP_UPDATE, PickupVariant.COLLECTIBLE)
  postPickupUpdateCollectible(pickup: EntityPickup): void {
    const collectible = pickup as EntityPickupCollectible;
    this.checkGlitchedItem(collectible);
  }

  /**
   * Prevent glitched items from appearing in secret rooms and I AM ERROR rooms (which happens from
   * the "Corrupted Data" achievement). Glitched items in these rooms are weird in that they
   * initially spawn as normal items, and then swap to a glitched item after exactly 4 frames.
   */
  checkGlitchedItem(collectible: EntityPickupCollectible): void {
    const room = game.GetRoom();

    const roomType = room.GetType();
    if (!ROOM_TYPES_TO_CHECK.has(roomType)) {
      return;
    }

    const glitchedCollectible = isGlitchedCollectible(collectible);

    const storedCollectibleType = v.room.collectibleMap.get(
      collectible.InitSeed,
    );
    if (storedCollectibleType === undefined) {
      // This is a new collectible that we haven't seen yet, so store what sub-type it is for later.
      // If this is a glitched item, that means that it was freshly spawned and did not morph from a
      // previous item, which should never happen (since TMTRAINER is globally banned). In this
      // case, fall back to recording that it is an arbitrary default item.
      const subTypeToStore = glitchedCollectible
        ? DEFAULT_REPLACEMENT_COLLECTIBLE
        : collectible.SubType;
      v.room.collectibleMap.set(collectible.InitSeed, subTypeToStore);
      return;
    }

    if (glitchedCollectible) {
      // If we simply change the sub-type of the existing collectible, then it will turn into a
      // glitched item again 4 frames from now. Thus, we are forced to remove the collectible and
      // spawn a new one. Even if we use the same `InitSeed`, it will still not change back to a
      // glitched item.
      collectible.Remove();
      mod.spawnCollectible(
        storedCollectibleType,
        collectible.Position,
        collectible.InitSeed,
      );
    }
  }
}
