import { FamiliarVariant, ModCallback } from "isaac-typescript-definitions";
import * as pc from "../features/optional/graphics/paschalCandle";
import { mod } from "../mod";

export function init(): void {
  mod.AddCallback(
    ModCallback.POST_FAMILIAR_INIT,
    paschalCandle,
    FamiliarVariant.PASCHAL_CANDLE, // 221
  );
}

// FamiliarVariant.PASCHAL_CANDLE (221)
function paschalCandle(familiar: EntityFamiliar) {
  pc.postFamiliarInitPaschalCandle(familiar);
}
