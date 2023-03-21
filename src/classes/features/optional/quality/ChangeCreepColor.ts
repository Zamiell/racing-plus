import {
  CollectibleType,
  EffectVariant,
  EntityType,
  FamiliarVariant,
  ModCallback,
} from "isaac-typescript-definitions";
import { Callback, asNumber, copyColor } from "isaacscript-common";
import { Config } from "../../../Config";
import { ConfigurableModFeature } from "../../../ConfigurableModFeature";

export class ChangeCreepColor extends ConfigurableModFeature {
  configKey: keyof Config = "ChangeCreepColor";

  // 8, 1 << 6
  @Callback(ModCallback.EVALUATE_CACHE)
  evaluateCacheTearColor(player: EntityPlayer): void {
    this.changeMysteriousLiquidColor(player);
  }

  changeMysteriousLiquidColor(player: EntityPlayer): void {
    if (!player.HasCollectible(CollectibleType.MYSTERIOUS_LIQUID)) {
      return;
    }

    // After taking Mysterious Liquid, the color values are all equal to 1.0 except for BO, which is
    // equal to 0.2. Start by coping the existing color and then swap the green and blue values.
    const color = player.TearColor;
    player.TearColor = Color(
      color.R,
      color.G,
      color.B,
      color.A,
      color.RO,
      color.GO - 0.2,
      color.BO + 0.2,
    );
  }

  // 54, 53
  @Callback(ModCallback.POST_EFFECT_INIT, EffectVariant.PLAYER_CREEP_GREEN)
  postEffectInitPlayerCreepGreen(effect: EntityEffect): void {
    this.changeGreenCreepToBlue(effect);
  }

  /**
   * This has to be done on every update frame in order for it to work properly, so we cannot use
   * `POST_EFFECT_INIT` or `POST_EFFECT_INIT_LATE`.
   */
  changeGreenCreepToBlue(effect: EntityEffect): void {
    // Ignore creep generated from Lil Spewer.
    if (
      effect.SpawnerType === EntityType.FAMILIAR &&
      effect.SpawnerVariant === asNumber(FamiliarVariant.LIL_SPEWER)
    ) {
      return;
    }

    const sprite = effect.GetSprite();

    // We can't call the `SetColorize` method on the existing color object, so create a new one.
    const newColor = copyColor(sprite.Color);

    // Set the color to blue. (These values were determined through trial and error.)
    newColor.SetColorize(0, 0, 255, 1);
    sprite.Color = newColor;
  }

  // 55, 22
  @Callback(ModCallback.POST_EFFECT_UPDATE, EffectVariant.CREEP_RED)
  postEffectUpdateCreepRed(effect: EntityEffect): void {
    this.changeRedCreepToGreen(effect);
  }

  /**
   * This has to be done on every update frame in order for it to work properly, so we cannot use
   * `POST_EFFECT_INIT` or `POST_EFFECT_INIT_LATE`.
   */
  changeRedCreepToGreen(effect: EntityEffect): void {
    const sprite = effect.GetSprite();

    // We can't call the `SetColorize` method on the existing color object, so create a new one.
    const newColor = copyColor(sprite.Color);

    // Set the color to green. These values were determined through trial and error to make creep
    // that looks roughly similar to green creep (from e.g. Pestilence).
    newColor.SetColorize(0, 2.9, 0, 1);
    sprite.Color = newColor;
  }

  /**
   * Some green creep uses `EffectVariant.PLAYER_CREEP_RED` for some reason. When this happens, the
   * `R` color value is always 0.0. This check can only be done in the update callback, since on
   * init the `R` value is 1.0.
   */
  // 55, 46
  @Callback(ModCallback.POST_EFFECT_UPDATE, EffectVariant.PLAYER_CREEP_RED)
  postEffectUpdatePlayerCreepRed(effect: EntityEffect): void {
    const color = effect.GetColor();
    if (color.R === 0) {
      this.changeRedCreepToBlue(effect);
    }
  }

  changeRedCreepToBlue(effect: EntityEffect): void {
    const sprite = effect.GetSprite();

    // We can't call the `SetColorize` method on the existing color object, so create a new one.
    const newColor = copyColor(sprite.Color);

    // Set the color to blue. (These values were determined through trial and error.)
    newColor.SetColorize(0, 0, 255, 1);
    sprite.Color = newColor;
  }
}
