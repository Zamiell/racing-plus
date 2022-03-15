import { ModCallbacksCustom, ModUpgraded } from "isaacscript-common";
import * as chargePocketItemFirst from "../features/optional/quality/chargePocketItemFirst";

export function init(mod: ModUpgraded): void {
  mod.AddCallbackCustom(
    ModCallbacksCustom.MC_POST_SLOT_ANIMATION_CHANGED,
    batteryBum,
    SlotVariant.BATTERY_BUM, // 13
  );
}

// SlotVariant.BATTERY_BUM (13)
function batteryBum(
  slot: Entity,
  previousAnimation: string,
  currentAnimation: string,
) {
  chargePocketItemFirst.postSlotAnimationChangedBatteryBum(
    slot,
    previousAnimation,
    currentAnimation,
  );
}
