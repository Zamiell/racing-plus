import { ModCallback } from "isaac-typescript-definitions";
import { Callback } from "isaacscript-common";
import { debugFunction } from "../../../../debugCode";
import { CollectibleTypeCustom } from "../../../../enums/CollectibleTypeCustom";
import { MandatoryModFeature } from "../../../MandatoryModFeature";

export class DebugItem extends MandatoryModFeature {
  // 3
  @Callback(ModCallback.POST_USE_ITEM, CollectibleTypeCustom.DEBUG)
  postUseItemDebug(): boolean {
    debugFunction();
    return true; // Display the "use" animation
  }
}
