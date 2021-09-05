import * as flyItemSprites from "../features/optional/graphics/flyItemSprites";
import * as scaredHeart from "../features/optional/graphics/scaredHeart";
import * as starOfBethlehem from "../features/optional/graphics/starOfBethlehem";
import * as stickyNickel from "../features/optional/graphics/stickyNickel";
import * as twentyTwenty from "../features/optional/graphics/twentyTwenty";
import * as fastTravelPostPickupInit from "../features/optional/major/fastTravel/callbacks/postPickupInit";
import * as automaticItemInsertion from "../features/optional/quality/automaticItemInsertion/automaticItemInsertion";
import * as removePerfectionOnEndFloors from "../features/optional/quality/removePerfectionOnEndFloors";
import * as removePerfectionVelocity from "../features/optional/quality/removePerfectionVelocity";
import * as speedrunPostPickupInit from "../features/speedrun/callbacks/postPickupInit";

export function init(mod: Mod): void {
  mod.AddCallback(
    ModCallbacks.MC_POST_PICKUP_INIT,
    heart,
    PickupVariant.PICKUP_HEART, // 10
  );

  mod.AddCallback(
    ModCallbacks.MC_POST_PICKUP_INIT,
    coin,
    PickupVariant.PICKUP_COIN, // 20
  );

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

  mod.AddCallback(
    ModCallbacks.MC_POST_PICKUP_INIT,
    trophy,
    PickupVariant.PICKUP_TROPHY, // 370
  );
}

export function main(pickup: EntityPickup): void {
  automaticItemInsertion.postPickupInit(pickup);
}

// PickupVariant.PICKUP_HEART (10)
function heart(pickup: EntityPickup) {
  scaredHeart.postPickupInitHeart(pickup);
}

// PickupVariant.PICKUP_COIN (20)
function coin(pickup: EntityPickup) {
  stickyNickel.postPickupInitCoin(pickup);
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
  removePerfectionOnEndFloors.postPickupInitTrinket(pickup);
}

// PickupVariant.PICKUP_TROPHY (370)
function trophy(pickup: EntityPickup) {
  speedrunPostPickupInit.trophy(pickup);
}
