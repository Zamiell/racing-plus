import { ModCallbackCustom, ModUpgraded } from "isaacscript-common";
import * as chargePocketItemFirst from "../features/optional/quality/chargePocketItemFirst";

export function init(mod: ModUpgraded): void {
  mod.AddCallbackCustom(ModCallbackCustom.POST_PICKUP_COLLECT, main);
}

function main(pickup: EntityPickup, player: EntityPlayer) {
  chargePocketItemFirst.postPickupCollect(pickup, player);
}
