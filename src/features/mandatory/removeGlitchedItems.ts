import {
  isGlitchedCollectible,
  log,
  saveDataManager,
  spawnCollectible,
} from "isaacscript-common";
import g from "../../globals";

const DEFAULT_REPLACEMENT_COLLECTIBLE = CollectibleType.COLLECTIBLE_SAD_ONION;

const ROOM_TYPES_TO_CHECK: ReadonlySet<RoomType> = new Set([
  RoomType.ROOM_SECRET,
  RoomType.ROOM_ERROR,
]);

const v = {
  room: {
    collectibleMap: new Map<int, CollectibleType>(),
  },
};

export function init(): void {
  saveDataManager("removeGlitchedItems", v);
}

// ModCallbacks.MC_POST_PICKUP_UPDATE (35)
// PickupVariant.PICKUP_COLLECTIBLE (100)
export function postPickupUpdateCollectible(pickup: EntityPickup): void {
  checkGlitchedItem(pickup);
}

/**
 * Prevent glitched items from appearing in secret rooms and I AM ERROR rooms (which happens from
 * the "Corrupted Data" achievement). Glitched items in these rooms are weird in that they initially
 * spawn as normal items, and then swap to a glitched item after exactly 4 frames.
 */
function checkGlitchedItem(pickup: EntityPickup) {
  const roomType = g.r.GetType();
  if (!ROOM_TYPES_TO_CHECK.has(roomType)) {
    return;
  }

  const glitchedCollectible = isGlitchedCollectible(pickup);

  const storedCollectibleType = v.room.collectibleMap.get(pickup.InitSeed);
  if (storedCollectibleType === undefined) {
    // This is a new collectible that we haven't seen yet, so store what sub-type it is for later
    // If this is a glitched item, that means that it was freshly spawned and did not morph from a
    // previous item, which should never happen (since TMTRAINER is globally banned)
    // In this case, fall back to recording that it is an arbitrary default item
    const subTypeToStore = glitchedCollectible
      ? DEFAULT_REPLACEMENT_COLLECTIBLE
      : pickup.SubType;
    v.room.collectibleMap.set(pickup.InitSeed, subTypeToStore);
    return;
  }

  if (glitchedCollectible) {
    // If we simply change the sub-type of the existing collectible, then it will turn into a
    // glitched item again 4 frames from now
    // Thus, we are forced to remove the collectible and spawn a new one
    // Even if we use the same InitSeed, it will still not change back to a glitched item
    pickup.Remove();
    spawnCollectible(storedCollectibleType, pickup.Position, pickup.InitSeed);
    log(
      `Deleted a glitched collectible on frame ${pickup.FrameCount} and replaced it with the previous item of: ${storedCollectibleType}`,
    );
  }
}
