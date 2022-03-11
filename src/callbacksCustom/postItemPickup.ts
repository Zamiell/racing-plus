import {
  ModCallbacksCustom,
  ModUpgraded,
  PickingUpItem,
} from "isaacscript-common";
import * as startWithD6 from "../features/optional/major/startWithD6";
import * as chargePocketItemFirst from "../features/optional/quality/chargePocketItemFirst";
import * as racePostItemPickup from "../features/race/callbacks/postItemPickup";

export function init(mod: ModUpgraded): void {
  mod.AddCallbackCustom(ModCallbacksCustom.MC_POST_ITEM_PICKUP, main);

  mod.AddCallbackCustom(
    ModCallbacksCustom.MC_POST_ITEM_PICKUP,
    nineVolt,
    ItemType.ITEM_PASSIVE, // 1
    CollectibleType.COLLECTIBLE_9_VOLT, // 116
  );

  mod.AddCallbackCustom(
    ModCallbacksCustom.MC_POST_ITEM_PICKUP,
    threeDollarBill,
    ItemType.ITEM_PASSIVE, // 1
    CollectibleType.COLLECTIBLE_3_DOLLAR_BILL, // 191
  );

  mod.AddCallbackCustom(
    ModCallbacksCustom.MC_POST_ITEM_PICKUP,
    magic8Ball,
    ItemType.ITEM_PASSIVE, // 1
    CollectibleType.COLLECTIBLE_MAGIC_8_BALL, // 194
  );

  mod.AddCallbackCustom(
    ModCallbacksCustom.MC_POST_ITEM_PICKUP,
    batteryPack,
    ItemType.ITEM_PASSIVE, // 1
    CollectibleType.COLLECTIBLE_BATTERY_PACK, // 603
  );

  mod.AddCallbackCustom(
    ModCallbacksCustom.MC_POST_ITEM_PICKUP,
    birthright,
    ItemType.ITEM_PASSIVE, // 1
    CollectibleType.COLLECTIBLE_BIRTHRIGHT, // 619
  );
}

function main(player: EntityPlayer, pickingUpItem: PickingUpItem) {
  racePostItemPickup.main(player, pickingUpItem);
}

// ItemType.ITEM_PASSIVE (1)
// CollectibleType.COLLECTIBLE_9_VOLT (116)
function nineVolt(player: EntityPlayer, _pickingUpItem: PickingUpItem) {
  chargePocketItemFirst.postItemPickup9Volt(player);
}

// ItemType.ITEM_PASSIVE (1)
// CollectibleType.COLLECTIBLE_3_DOLLAR_BILL (191)
function threeDollarBill(player: EntityPlayer, _pickingUpItem: PickingUpItem) {
  racePostItemPickup.threeDollarBill(player);
}

// ItemType.ITEM_PASSIVE (1)
// CollectibleType.COLLECTIBLE_MAGIC_8_BALL (194)
function magic8Ball(player: EntityPlayer, _pickingUpItem: PickingUpItem) {
  racePostItemPickup.magic8Ball(player);
}

// ItemType.ITEM_PASSIVE (1)
// CollectibleType.COLLECTIBLE_BATTERY_PACK (603)
function batteryPack(player: EntityPlayer, _pickingUpItem: PickingUpItem) {
  chargePocketItemFirst.postItemPickupBatteryPack(player);
}

// ItemType.ITEM_PASSIVE (1)
// CollectibleType.COLLECTIBLE_BATTERY_PACK (603)
function birthright(player: EntityPlayer, _pickingUpItem: PickingUpItem) {
  startWithD6.postItemPickupBirthright(player);
}
