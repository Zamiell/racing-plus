import type { PickingUpItem } from "isaacscript-common";
import { ModCallbackCustom } from "isaacscript-common";
import * as racePostItemPickup from "../features/race/callbacks/postItemPickup";
import { mod } from "../mod";

export function postItemPickupInit(): void {
  mod.AddCallbackCustom(ModCallbackCustom.POST_ITEM_PICKUP, main);
}

function main(player: EntityPlayer, pickingUpItem: PickingUpItem) {
  racePostItemPickup.main(player, pickingUpItem);
}
