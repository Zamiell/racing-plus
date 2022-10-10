import { ModCallback, TearVariant } from "isaac-typescript-definitions";
import * as fadeVasculitisTears from "../features/optional/quality/fadeVasculitisTears";
import { mod } from "../mod";

export function init(): void {
  mod.AddCallback(
    ModCallback.POST_TEAR_UPDATE,
    blood,
    TearVariant.BLOOD, // 1
  );
}

function blood(tear: EntityTear) {
  fadeVasculitisTears.postTearUpdateBlood(tear);
}
