import * as sb from "../features/items/sawblade";
import { FamiliarVariantCustom } from "../types/enums";

export function init(mod: Mod): void {
  mod.AddCallback(
    ModCallbacks.MC_PRE_FAMILIAR_COLLISION,
    sawblade,
    FamiliarVariantCustom.SAWBLADE,
  );
}

function sawblade(_familiar: EntityFamiliar, collider: Entity, _low: boolean) {
  sb.preFamiliarCollisionSawblade(collider);
}