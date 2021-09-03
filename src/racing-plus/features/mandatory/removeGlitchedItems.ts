import { isGlitchedCollectible, saveDataManager } from "isaacscript-common";
import { changeCollectibleSubType } from "../../utilCollectible";

const DEFAULT_REPLACEMENT_COLLECTIBLE = CollectibleType.COLLECTIBLE_SAD_ONION;

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
  const glitchedCollectible = isGlitchedCollectible(pickup);

  // Prevent glitched items from appearing in secret rooms and I AM ERROR rooms
  // (which happens from the "Corrupted Data" achievement)
  // Glitched items in these rooms are weird in that they initially spawn as normal items,
  // and then swap to a glitched item after exactly 4 frames
  const storedCollectibleType = v.room.collectibleMap.get(pickup.InitSeed);
  if (storedCollectibleType === undefined) {
    // This is a new collectible that we haven't seen yet, so store what subtype it is for later
    // If this is a glitched item, that means that it was freshly spawned and did not morphed from a
    // previous item, which should never happen (since TMTRAINER is globally banned)
    // In this case, fall back to recording that it is an arbitrary default item
    const subtypeToStore = glitchedCollectible
      ? DEFAULT_REPLACEMENT_COLLECTIBLE
      : pickup.SubType;
    v.room.collectibleMap.set(pickup.InitSeed, subtypeToStore);
    return;
  }

  if (glitchedCollectible) {
    changeCollectibleSubType(pickup, storedCollectibleType);
  }
}
