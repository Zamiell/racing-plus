import { ModCallback } from "isaac-typescript-definitions";
import { FamiliarVariantCustom } from "../enums/FamiliarVariantCustom";
import * as sb from "../features/items/sawblade";
import { mod } from "../mod";

export function init(): void {
  mod.AddCallback(
    ModCallback.PRE_FAMILIAR_COLLISION,
    sawblade,
    FamiliarVariantCustom.SAWBLADE,
  );
}

function sawblade(
  _familiar: EntityFamiliar,
  collider: Entity,
  _low: boolean,
): boolean | undefined {
  sb.preFamiliarCollisionSawblade(collider);

  return undefined;
}
