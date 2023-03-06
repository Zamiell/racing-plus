import { CollectibleType } from "isaac-typescript-definitions";
import {
  anyPlayerHasCollectible,
  CallbackCustom,
  ModCallbackCustom,
  setEntityOpacity,
} from "isaacscript-common";
import { Config } from "../../../Config";
import { ConfigurableModFeature } from "../../../ConfigurableModFeature";
import { FADE_TEAR_AMOUNT } from "./FadeVasculitisTears";

/**
 * Since Lachryphagy/hungry tears fire on a delay, they can be confused with enemy tears. Fade all
 * tears of this nature so that they are easy to distinguish.
 */
export class FadeHungryTears extends ConfigurableModFeature {
  configKey: keyof Config = "FadeHungryTears";

  /** Setting the fade does not work in the `POST_TEAR_INIT` callback, so we have to do it here. */
  @CallbackCustom(ModCallbackCustom.POST_TEAR_INIT_LATE)
  postTearInitLate(tear: EntityTear): void {
    if (this.isHungryTear(tear)) {
      setEntityOpacity(tear, FADE_TEAR_AMOUNT);
    }
  }

  /**
   * Normal tears have both `tear.Parent` and `tear.SpawnerEntity` equal to the player. However,
   * Lachryphagy/hungry tears will have `tear.Parent` equal to the undefined and
   * `tear.SpawnerEntity` equal to the player.
   */
  isHungryTear(tear: EntityTear): boolean {
    return (
      tear.Parent === undefined &&
      tear.SpawnerEntity !== undefined &&
      anyPlayerHasCollectible(CollectibleType.LACHRYPHAGY)
    );
  }
}
