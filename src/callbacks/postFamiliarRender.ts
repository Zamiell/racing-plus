import * as debugFunction from "../debugFunction";
import * as seededGBBug from "../features/mandatory/seededGBBug";

export function init(mod: Mod): void {
  mod.AddCallback(
    ModCallbacks.MC_POST_FAMILIAR_RENDER,
    GBBug,
    FamiliarVariant.GB_BUG, // 93
  );
}

export function main(familiar: EntityFamiliar): void {
  debugFunction.postFamiliarRender(familiar);
}

function GBBug(familiar: EntityFamiliar) {
  seededGBBug.postFamiliarRenderGBBug(familiar);
}
