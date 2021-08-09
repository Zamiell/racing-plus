import * as flyItemSprites from "../features/optional/graphics/flyItemSprites";
import * as starOfBethlehem from "../features/optional/graphics/starOfBethlehem";
import * as twentyTwenty from "../features/optional/graphics/twentyTwenty";
import * as fastTravelPostPickupInit from "../features/optional/major/fastTravel/callbacks/postPickupInit";
import * as removePerfectionVelocity from "../features/optional/quality/removePerfectionVelocity";

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

  mod.AddCallback(
    ModCallbacks.MC_POST_PICKUP_INIT,
    trinket,
    PickupVariant.PICKUP_TRINKET, // 350
  );
}

// PickupVariant.PICKUP_COLLECTIBLE (100)
function collectible(pickup: EntityPickup) {
  flyItemSprites.postPickupInit(pickup);
  twentyTwenty.postPickupInit(pickup);
  starOfBethlehem.postPickupInit(pickup);
}

// PickupVariant.PICKUP_BIGCHEST (340)
function bigChest(pickup: EntityPickup) {
  fastTravelPostPickupInit.bigChest(pickup);
}

// PickupVariant.PICKUP_TRINKET (350)
function trinket(pickup: EntityPickup) {
  removePerfectionVelocity.postPickupInitTrinket(pickup);
}
