import * as sb from "../features/items/sawblade";
import { FamiliarVariantCustom } from "../types/FamiliarVariantCustom";

export function init(mod: Mod): void {
  mod.AddCallback(
    ModCallbacks.MC_FAMILIAR_UPDATE,
    sawBlade,
    FamiliarVariantCustom.SAWBLADE,
  );
}

function sawBlade(familiar: EntityFamiliar) {
  sb.postFamiliarUpdateSawblade(familiar);
}
