import { ModCallback, PillEffect } from "isaac-typescript-definitions";
import { Callback } from "isaacscript-common";
import { Config } from "../../../Config";
import { ConfigurableModFeature } from "../../../ConfigurableModFeature";

/**
 * There are only two pills in the game that cannot cancel animations. Manually play either
 * `AnimateHappy` or `AnimateSad` to grant the ability to these two pills.
 */
export class PillsCancelAnimations extends ConfigurableModFeature {
  configKey: keyof Config = "PillsCancelAnimations";

  // 10, 36
  @Callback(ModCallback.POST_USE_PILL, PillEffect.POWER)
  postUsePillPowerPill(_pillEffect: PillEffect, player: EntityPlayer): void {
    player.AnimateHappy();
  }

  // 10, 44
  @Callback(ModCallback.POST_USE_PILL, PillEffect.HORF)
  postUsePillHorf(_pillEffect: PillEffect, player: EntityPlayer): void {
    player.AnimateSad();
  }
}
