import { ModCallback } from "isaac-typescript-definitions";
import { FamiliarVariantCustom } from "../enums/FamiliarVariantCustom";
import * as sb from "../features/items/sawblade";

export function init(mod: Mod): void {
  mod.AddCallback(
    ModCallback.PRE_FAMILIAR_COLLISION,
    sawblade,
    FamiliarVariantCustom.SAWBLADE,
  );
}

function sawblade(_familiar: EntityFamiliar, collider: Entity, _low: boolean) {
  sb.preFamiliarCollisionSawblade(collider);
}
