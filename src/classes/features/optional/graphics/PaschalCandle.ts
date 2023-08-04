import { FamiliarVariant, ModCallback } from "isaac-typescript-definitions";
import { Callback } from "isaacscript-common";
import type { Config } from "../../../Config";
import { ConfigurableModFeature } from "../../../ConfigurableModFeature";

const CUSTOM_ANM2_PATH = "gfx/003.221_paschal candle custom.anm2";

export class PaschalCandle extends ConfigurableModFeature {
  configKey: keyof Config = "PaschalCandle";

  // 7, 221
  @Callback(ModCallback.POST_FAMILIAR_INIT, FamiliarVariant.PASCHAL_CANDLE)
  postFamiliarInitPaschalCandle(familiar: EntityFamiliar): void {
    const sprite = familiar.GetSprite();
    const fileName = sprite.GetFilename();
    if (fileName !== CUSTOM_ANM2_PATH) {
      sprite.Load(CUSTOM_ANM2_PATH, true);
    }
  }
}
