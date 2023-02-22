import { CollectibleType, ItemType } from "isaac-typescript-definitions";
import { ModCallbackCustom, PickingUpItem } from "isaacscript-common";
import * as chargePocketItemFirst from "../features/optional/quality/chargePocketItemFirst";
import * as racePostItemPickup from "../features/race/callbacks/postItemPickup";
import { mod } from "../mod";

export function init(): void {
  mod.AddCallbackCustom(ModCallbackCustom.POST_ITEM_PICKUP, main);

  mod.AddCallbackCustom(
    ModCallbackCustom.POST_ITEM_PICKUP,
    nineVolt,
    ItemType.PASSIVE, // 1
    CollectibleType.NINE_VOLT, // 116
  );

  mod.AddCallbackCustom(
    ModCallbackCustom.POST_ITEM_PICKUP,
    batteryPack,
    ItemType.PASSIVE, // 1
    CollectibleType.BATTERY_PACK, // 603
  );
}

function main(player: EntityPlayer, pickingUpItem: PickingUpItem) {
  racePostItemPickup.main(player, pickingUpItem);
}

// ItemType.PASSIVE (1)
// CollectibleType.9_VOLT (116)
function nineVolt(player: EntityPlayer, _pickingUpItem: PickingUpItem) {
  chargePocketItemFirst.postItemPickup9Volt(player);
}

// ItemType.PASSIVE (1)
// CollectibleType.BATTERY_PACK (603)
function batteryPack(player: EntityPlayer, _pickingUpItem: PickingUpItem) {
  chargePocketItemFirst.postItemPickupBatteryPack(player);
}
