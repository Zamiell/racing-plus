import * as flyItemSprites from "../features/optional/graphics/flyItemSprites";
import * as starOfBethlehem from "../features/optional/graphics/starOfBethlehem";
import * as twentyTwenty from "../features/optional/graphics/twentyTwenty";
import * as fastTravelPostPickupInit from "../features/optional/major/fastTravel/callbacks/postPickupInit";

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
