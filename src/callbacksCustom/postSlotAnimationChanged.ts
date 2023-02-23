import { SlotVariant } from "isaac-typescript-definitions";
import { ModCallbackCustom } from "isaacscript-common";
import * as chargePocketItemFirst from "../features/optional/quality/chargePocketItemFirst";
import { mod } from "../mod";

export function init(): void {
  mod.AddCallbackCustom(
    ModCallbackCustom.POST_SLOT_ANIMATION_CHANGED,
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
  // QoL
  chargePocketItemFirst.postSlotAnimationChangedBatteryBum(
    slot,
    previousAnimation,
    currentAnimation,
  );
}
