import g from "../../../globals";

const CUSTOM_ANM2_PATH = "gfx/003.221_paschal candle custom.anm2";

export function postFamiliarInit(familiar: EntityFamiliar): void {
  if (!g.config.paschalCandle) {
    return;
  }

  const sprite = familiar.GetSprite();
  const fileName = sprite.GetFilename();
  if (fileName !== CUSTOM_ANM2_PATH) {
    sprite.Load(CUSTOM_ANM2_PATH, true);
  }
}
