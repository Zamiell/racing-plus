import { CollectibleType, TearVariant } from "isaac-typescript-definitions";
import {
  anyPlayerHasCollectible,
  CallbackCustom,
  ModCallbackCustom,
  setEntityOpacity,
} from "isaacscript-common";
import { Config } from "../../../Config";
import { ConfigurableModFeature } from "../../../ConfigurableModFeature";

export const FADE_TEAR_AMOUNT = 0.1;

/**
 * Vasculitis causes tears to explode out of enemies. This is very confusing and makes it hard to
 * see real projectiles. Fade all tears of this nature so that they are easy to distinguish.
 */
export class FadeVasculitisTears extends ConfigurableModFeature {
  configKey: keyof Config = "FadeVasculitisTears";

  /** Setting the fade does not work in the `POST_TEAR_INIT` callback, so we have to do it here. */
  @CallbackCustom(ModCallbackCustom.POST_TEAR_INIT_LATE)
  postTearInitLate(tear: EntityTear): void {
    if (this.isVasculitisTear(tear)) {
      setEntityOpacity(tear, FADE_TEAR_AMOUNT);
    }
  }

  /**
   * Normal tears have both `tear.Parent` and `tear.SpawnerEntity` equal to the player. However,
   * both `tear.Parent` and `tear.SpawnerEntity` will be equal to undefined if it is a Vasculitis
   * tear, because it is originating from the entity (and not the player or any familiar).
   */
  isVasculitisTear(tear: EntityTear): boolean {
    return (
      tear.Variant === TearVariant.BLOOD &&
      tear.Parent === undefined &&
      tear.SpawnerEntity === undefined &&
      anyPlayerHasCollectible(CollectibleType.VASCULITIS)
    );
  }
}
