import { FamiliarVariant, ModCallback } from "isaac-typescript-definitions";
import * as seededGBBug from "../features/mandatory/seededGBBug";

export function init(mod: Mod): void {
  mod.AddCallback(
    ModCallback.POST_FAMILIAR_RENDER,
    GBBug,
    FamiliarVariant.GB_BUG, // 93
  );
}

function GBBug(familiar: EntityFamiliar) {
  seededGBBug.postFamiliarRenderGBBug(familiar);
}
