import { ModCallbackCustom } from "isaacscript-common";
import * as chargePocketItemFirst from "../features/optional/quality/chargePocketItemFirst";
import { mod } from "../mod";

export function init(): void {
  mod.AddCallbackCustom(ModCallbackCustom.POST_PURCHASE, main);
}

function main(player: EntityPlayer, pickup: EntityPickup) {
  chargePocketItemFirst.postPurchase(player, pickup);
}
