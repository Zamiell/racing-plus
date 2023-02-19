import { FamiliarVariant, ModCallback } from "isaac-typescript-definitions";
import { FamiliarVariantCustom } from "../enums/FamiliarVariantCustom";
import * as sb from "../features/items/sawblade";
import * as fadeFriendlyEnemies from "../features/optional/enemies/fadeFriendlyEnemies";
import { mod } from "../mod";

export function init(): void {
  mod.AddCallback(
    ModCallback.POST_FAMILIAR_UPDATE,
    babyPlum,
    FamiliarVariant.BABY_PLUM,
  );

  mod.AddCallback(
    ModCallback.POST_FAMILIAR_UPDATE,
    sawBlade,
    FamiliarVariantCustom.SAWBLADE,
  );
}

// FamiliarVariant.BABY_PLUM (224)
function babyPlum(familiar: EntityFamiliar) {
  fadeFriendlyEnemies.postFamiliarUpdateBabyPlum(familiar);
}

// FamiliarVariantCustom.SAWBLADE
function sawBlade(familiar: EntityFamiliar) {
  sb.postFamiliarUpdateSawblade(familiar);
}
