import * as sb from "../features/items/sawblade";
import { FamiliarVariantCustom } from "../types/enums";

export function init(mod: Mod): void {
  mod.AddCallback(
    ModCallbacks.MC_POST_FAMILIAR_RENDER,
    sawblade,
    FamiliarVariantCustom.SAWBLADE,
  );
}

function sawblade(familiar: EntityFamiliar, _renderOffset: Vector) {
  sb.postFamiliarRenderSawblade(familiar);
}
