import { ModCallbackCustom, PickingUpItem } from "isaacscript-common";
import * as streakText from "../features/mandatory/streakText";
import { automaticItemInsertionPreItemPickup } from "../features/optional/quality/automaticItemInsertion/callbacks/preItemPickup";
import { mod } from "../mod";

export function init(): void {
  mod.AddCallbackCustom(ModCallbackCustom.PRE_ITEM_PICKUP, main);
}

function main(player: EntityPlayer, pickingUpItem: PickingUpItem) {
  // Mandatory
  streakText.preItemPickup(pickingUpItem);

  // QoL
  automaticItemInsertionPreItemPickup(player, pickingUpItem);
}
