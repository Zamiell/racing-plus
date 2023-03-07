import { ModCallbackCustom, PickingUpItem } from "isaacscript-common";
import * as streakText from "../features/mandatory/streakText";
import { mod } from "../mod";

export function init(): void {
  mod.AddCallbackCustom(ModCallbackCustom.PRE_ITEM_PICKUP, main);
}

function main(_player: EntityPlayer, pickingUpItem: PickingUpItem) {
  streakText.preItemPickup(pickingUpItem);
}
