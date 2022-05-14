import { ModCallback } from "isaac-typescript-definitions";
import { FamiliarVariantCustom } from "../enums/FamiliarVariantCustom";
import * as sb from "../features/items/sawblade";

export function init(mod: Mod): void {
  mod.AddCallback(
    ModCallback.POST_FAMILIAR_UPDATE,
    sawBlade,
    FamiliarVariantCustom.SAWBLADE,
  );
}

function sawBlade(familiar: EntityFamiliar) {
  sb.postFamiliarUpdateSawblade(familiar);
}
