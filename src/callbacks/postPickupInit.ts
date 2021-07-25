import * as flyItemSprites from "../features/optional/graphics/flyItemSprites";
import * as starOfBethlehem from "../features/optional/graphics/starOfBethlehem";
import * as twentyTwenty from "../features/optional/graphics/twentyTwenty";
import * as fastTravelPostPickupInit from "../features/optional/major/fastTravel/callbacks/postPickupInit";

export function init(mod: Mod): void {
  mod.AddCallback(
    ModCallbacks.MC_POST_PICKUP_INIT,
    collectible,
    PickupVariant.PICKUP_COLLECTIBLE, // 100
  );

  mod.AddCallback(
    ModCallbacks.MC_POST_PICKUP_INIT,
    bigChest,
    PickupVariant.PICKUP_BIGCHEST, // 340
  );
}

// PickupVariant.PICKUP_COLLECTIBLE (100)
export function collectible(pickup: EntityPickup): void {
  flyItemSprites.postPickupInit(pickup);
  twentyTwenty.postPickupInit(pickup);
  starOfBethlehem.postPickupInit(pickup);
}

// PickupVariant.PICKUP_BIGCHEST (340)
export function bigChest(pickup: EntityPickup): void {
  fastTravelPostPickupInit.bigChest(pickup);
}
