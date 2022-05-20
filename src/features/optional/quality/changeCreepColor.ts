import {
  CollectibleType,
  EntityType,
  FamiliarVariant,
} from "isaac-typescript-definitions";
import { copyColor } from "isaacscript-common";
import { config } from "../../../modConfigMenu";

// ModCallback.EVALUATE_CACHE (8)
// CacheFlag.TEARCOLOR (1 << 6)
export function evaluateCacheTearColor(player: EntityPlayer): void {
  if (!config.changeCreepColor) {
    return;
  }

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

// ModCallback.POST_EFFECT_INIT (54)
// EffectVariant.CREEP_RED (22)
export function postEffectInitCreepRed(effect: EntityEffect): void {
  if (!config.changeCreepColor) {
    return;
  }

  const sprite = effect.GetSprite();

  // We can't call the `SetColorize` method on the existing color object, so create a new one.
  const newColor = copyColor(sprite.Color);

  // Set the color to green. These values were determined through trial and error to make creep that
  // looks roughly similar to green creep (from e.g. Pestilence).
  newColor.SetColorize(0, 2.9, 0, 1);
  sprite.Color = newColor;
}

// ModCallback.POST_EFFECT_INIT (54)
// EffectVariant.PLAYER_CREEP_GREEN (53)
export function postEffectInitPlayerCreepGreen(effect: EntityEffect): void {
  if (!config.changeCreepColor) {
    return;
  }

  // Ignore creep generated from Lil Spewer.
  if (
    effect.SpawnerType === EntityType.FAMILIAR &&
    effect.SpawnerVariant === (FamiliarVariant.LIL_SPEWER as int)
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
