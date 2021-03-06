import { PickupVariant } from "isaac-typescript-definitions";
import { ModCallbackCustom, ModUpgraded } from "isaacscript-common";
import * as flipCustom from "../features/items/flipCustom";
import * as chargePocketItemFirst from "../features/optional/quality/chargePocketItemFirst";

export function init(mod: ModUpgraded): void {
  mod.AddCallbackCustom(ModCallbackCustom.POST_PURCHASE, main);

  mod.AddCallbackCustom(
    ModCallbackCustom.POST_PURCHASE,
    collectible,
    PickupVariant.COLLECTIBLE, // 100
  );
}

function main(player: EntityPlayer, pickup: EntityPickup) {
  chargePocketItemFirst.postPurchase(player, pickup);
}

// PickupVariant.COLLECTIBLE (100)
function collectible(player: EntityPlayer, pickup: EntityPickup) {
  flipCustom.postPurchaseCollectible(player, pickup);
}
