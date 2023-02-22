import { config } from "../../../modConfigMenu";

const CUSTOM_ANM2_PATH = "gfx/003.221_paschal candle custom.anm2";

// ModCallback.POST_FAMILIAR_INIT (7)
// FamiliarVariant.PASCHAL_CANDLE (221)
export function postFamiliarInitPaschalCandle(familiar: EntityFamiliar): void {
  if (!config.PaschalCandle) {
    return;
  }

  const sprite = familiar.GetSprite();
  const fileName = sprite.GetFilename();
  if (fileName !== CUSTOM_ANM2_PATH) {
    sprite.Load(CUSTOM_ANM2_PATH, true);
  }
}
