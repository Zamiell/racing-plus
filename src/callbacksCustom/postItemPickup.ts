import { ModCallbackCustom, PickingUpItem } from "isaacscript-common";
import * as racePostItemPickup from "../features/race/callbacks/postItemPickup";
import { mod } from "../mod";

export function init(): void {
  mod.AddCallbackCustom(ModCallbackCustom.POST_ITEM_PICKUP, main);
}

function main(player: EntityPlayer, pickingUpItem: PickingUpItem) {
  racePostItemPickup.main(player, pickingUpItem);
}
