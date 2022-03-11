import { ModCallbacksCustom, ModUpgraded } from "isaacscript-common";
import * as flipCustom from "../features/items/flipCustom";
import * as chargePocketItemFirst from "../features/optional/quality/chargePocketItemFirst";

export function init(mod: ModUpgraded): void {
  mod.AddCallbackCustom(ModCallbacksCustom.MC_POST_PURCHASE, main);
}

function main(player: EntityPlayer, pickup: EntityPickup) {
  // QoL
  chargePocketItemFirst.postPurchase(player, pickup);

  // Items
  flipCustom.postPurchase(player, pickup);
}
