import { ModCallback, PickupVariant } from "isaac-typescript-definitions";
import { PickupVariantCustom } from "../enums/PickupVariantCustom";
import * as seededGBBug from "../features/mandatory/seededGBBug";
import { betterDevilAngelRoomsPostPickupInitRedChest } from "../features/optional/major/betterDevilAngelRooms/callbacks/postPickupInit";
import * as fastTravelPostPickupInit from "../features/optional/major/fastTravel/callbacks/postPickupInit";
import { automaticItemInsertionPostPickupInit } from "../features/optional/quality/automaticItemInsertion/callbacks/postPickupInit";
import * as removePerfectionVelocity from "../features/optional/quality/removePerfectionVelocity";
import * as speedrunPostPickupInit from "../features/speedrun/callbacks/postPickupInit";
import { mod } from "../mod";

export function init(): void {
  mod.AddCallback(ModCallback.POST_PICKUP_INIT, main);

  mod.AddCallback(
    ModCallback.POST_PICKUP_INIT,
    bigChest,
    PickupVariant.BIG_CHEST, // 340
  );

  mod.AddCallback(
    ModCallback.POST_PICKUP_INIT,
    trinketCallback,
    PickupVariant.TRINKET, // 350
  );

  mod.AddCallback(
    ModCallback.POST_PICKUP_INIT,
    redChest,
    PickupVariant.RED_CHEST, // 360
  );

  mod.AddCallback(
    ModCallback.POST_PICKUP_INIT,
    trophy,
    PickupVariant.TROPHY, // 370
  );

  mod.AddCallback(
    ModCallback.POST_PICKUP_INIT,
    invisiblePickup,
    PickupVariantCustom.INVISIBLE_PICKUP,
  );
}

function main(pickup: EntityPickup) {
  seededGBBug.postPickupInit(pickup);
  automaticItemInsertionPostPickupInit(pickup);
}

// PickupVariant.BIG_CHEST (340)
function bigChest(pickup: EntityPickup) {
  fastTravelPostPickupInit.bigChest(pickup);
}

// PickupVariant.TRINKET (350)
function trinketCallback(pickup: EntityPickup) {
  const trinket = pickup as EntityPickupTrinket;

  removePerfectionVelocity.postPickupInitTrinket(trinket);
}

// PickupVariant.RED_CHEST (360)
function redChest(_pickup: EntityPickup) {
  betterDevilAngelRoomsPostPickupInitRedChest();
}

// PickupVariant.TROPHY (370)
function trophy(pickup: EntityPickup) {
  speedrunPostPickupInit.trophy(pickup);
}

// PickupVariantCustom.INVISIBLE_PICKUP
function invisiblePickup(pickup: EntityPickup) {
  pickup.Remove();
}
