import {
  ModCallbacksCustom,
  ModUpgraded,
  PickingUpItem,
} from "isaacscript-common";
import * as sb from "../features/items/sawblade";
import racePostItemPickup from "../features/race/callbacks/postItemPickup";
import { CollectibleTypeCustom } from "../types/enums";

export function init(mod: ModUpgraded): void {
  mod.AddCallbackCustom(
    ModCallbacksCustom.MC_POST_ITEM_PICKUP,
    sawblade,
    ItemType.ITEM_FAMILIAR,
    CollectibleTypeCustom.COLLECTIBLE_SAWBLADE,
  );
}

export function main(
  _player: EntityPlayer,
  pickingUpItem: PickingUpItem,
): void {
  racePostItemPickup(pickingUpItem);
}

function sawblade(player: EntityPlayer, _pickingUpItem: PickingUpItem) {
  sb.postItemPickupSawblade(player);
}
