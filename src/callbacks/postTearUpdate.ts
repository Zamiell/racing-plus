import { ModCallback, TearVariant } from "isaac-typescript-definitions";
import * as fadeVasculitisTears from "../features/optional/quality/fadeVasculitisTears";

export function init(mod: Mod): void {
  mod.AddCallback(
    ModCallback.POST_TEAR_UPDATE,
    blood,
    TearVariant.BLOOD, // 1
  );
}

function blood(tear: EntityTear) {
  fadeVasculitisTears.postTearUpdateBlood(tear);
}
