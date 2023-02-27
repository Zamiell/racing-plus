import {
  EffectVariant,
  HeavenLightDoorSubType,
} from "isaac-typescript-definitions";
import { CallbackCustom, ModCallbackCustom } from "isaacscript-common";
import { Config } from "../../../Config";
import { ConfigurableModFeature } from "../../../ConfigurableModFeature";

const ACTIVATION_STATE = 60;

/**
 * The state of Moonlight starts at 0 and increments by 1 on every frame. The player is only able to
 * step into it on frame 60 at beyond. This limit makes no sense, so we immediately set the state to
 * 60 as soon as it ticks upwards for the first time.
 */
export class FastLuna extends ConfigurableModFeature {
  configKey: keyof Config = "FastLuna";

  // 55, 39
  @CallbackCustom(
    ModCallbackCustom.POST_EFFECT_UPDATE_FILTER,
    EffectVariant.HEAVEN_LIGHT_DOOR,
    HeavenLightDoorSubType.MOONLIGHT,
  )
  postEffectUpdateMoonlight(effect: EntityEffect): void {
    if (effect.State === 1) {
      effect.State = ACTIVATION_STATE;
    }
  }
}
