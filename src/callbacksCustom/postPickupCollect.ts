import { ModCallbackCustom } from "isaacscript-common";
import * as chargePocketItemFirst from "../features/optional/quality/chargePocketItemFirst";
import { mod } from "../mod";

export function init(): void {
  mod.AddCallbackCustom(ModCallbackCustom.POST_PICKUP_COLLECT, main);
}

function main(pickup: EntityPickup, player: EntityPlayer) {
  chargePocketItemFirst.postPickupCollect(pickup, player);
}
