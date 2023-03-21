import {
  ActiveSlot,
  CollectibleType,
  ModCallback,
  UseFlag,
} from "isaac-typescript-definitions";
import { Callback, hasFlag } from "isaacscript-common";
import { config } from "../../../../modConfigMenu";
import { Config } from "../../../Config";
import { ConfigurableModFeature } from "../../../ConfigurableModFeature";

export class FastForgetMeNow extends ConfigurableModFeature {
  configKey: keyof Config = "FastForgetMeNow";

  @Callback(ModCallback.PRE_USE_ITEM, CollectibleType.FORGET_ME_NOW)
  preUseItemForgetMeNow(
    _collectibleType: CollectibleType,
    _rng: RNG,
    player: EntityPlayer,
    useFlags: BitFlags<UseFlag>,
    activeSlot: ActiveSlot,
    _customVarData: int,
  ): boolean | undefined {
    // This feature depends on fast-travel.
    if (!config.FastTravel) {
      return;
    }

    if (!hasFlag(useFlags, UseFlag.OWNED)) {
      return;
    }

    player.RemoveCollectible(
      CollectibleType.FORGET_ME_NOW,
      undefined,
      activeSlot,
    );

    // Cancel the original effect.
    return true;
  }
}
