import { ModCallbacksCustom, ModUpgraded } from "isaacscript-common";
import * as debugDisplay from "../features/mandatory/debugDisplay";

export function init(mod: ModUpgraded): void {
  mod.AddCallbackCustom(ModCallbacksCustom.MC_POST_SLOT_RENDER, main);
}

// SlotVariant.BATTERY_BUM (13)
function main(slot: Entity) {
  debugDisplay.postSlotRender(slot);
}
