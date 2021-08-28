import * as sb from "../features/items/sawblade";
import * as pc from "../features/optional/graphics/paschalCandle";
import { FamiliarVariantCustom } from "../types/enums";

export function init(mod: Mod): void {
  mod.AddCallback(
    ModCallbacks.MC_FAMILIAR_INIT,
    paschalCandle,
    FamiliarVariant.PASCHAL_CANDLE, // 221
  );

  mod.AddCallback(
    ModCallbacks.MC_FAMILIAR_INIT,
    sawblade,
    FamiliarVariantCustom.SAWBLADE,
  );
}

function paschalCandle(familiar: EntityFamiliar) {
  pc.postFamiliarInit(familiar);
}

function sawblade(familiar: EntityFamiliar) {
  sb.postFamiliarInit(familiar);
}
