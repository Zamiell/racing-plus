import * as debugDisplay from "../features/mandatory/debugDisplay";
import * as seededGBBug from "../features/mandatory/seededGBBug";

export function init(mod: Mod): void {
  mod.AddCallback(ModCallbacks.MC_POST_FAMILIAR_RENDER, main); // 25

  mod.AddCallback(
    ModCallbacks.MC_POST_FAMILIAR_RENDER,
    GBBug,
    FamiliarVariant.GB_BUG, // 93
  );
}

function main(familiar: EntityFamiliar) {
  debugDisplay.postFamiliarRender(familiar);
}

function GBBug(familiar: EntityFamiliar) {
  seededGBBug.postFamiliarRenderGBBug(familiar);
}
