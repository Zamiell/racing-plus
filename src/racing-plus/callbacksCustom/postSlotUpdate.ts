import { ModCallbacksCustom, ModUpgraded } from "isaacscript-common";
import * as chargePocketItemFirst from "../features/optional/quality/chargePocketItemFirst";

export function init(mod: ModUpgraded): void {
  mod.AddCallbackCustom(
    ModCallbacksCustom.MC_POST_SLOT_UPDATE,
    batteryBum,
    SlotVariant.BATTERY_BUM, // 13
  );
}

// SlotVariant.BATTERY_BUM (13)
function batteryBum(slot: Entity) {
  chargePocketItemFirst.postSlotUpdateBatteryBum(slot);
}
