import { HeartSubType, PickupVariant } from "isaac-typescript-definitions";
import { CallbackCustom, ModCallbackCustom } from "isaacscript-common";
import { Config } from "../../../Config";
import { ConfigurableModFeature } from "../../../ConfigurableModFeature";

export class ScaredHeart extends ConfigurableModFeature {
  configKey: keyof Config = "ScaredHeart";

  @CallbackCustom(
    ModCallbackCustom.POST_PICKUP_INIT_FILTER,
    PickupVariant.HEART,
    HeartSubType.SCARED,
  )
  postPickupInitHeart(pickup: EntityPickup): void {
    const sprite = pickup.GetSprite();
    const animation = sprite.GetAnimation();
    sprite.Load("gfx/005.020_scared heart custom.anm2", true);
    sprite.Play(animation, true);
  }
}
