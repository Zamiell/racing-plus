import { TearVariant } from "isaac-typescript-definitions";
import { ModCallbackCustom } from "isaacscript-common";
import * as fadeVasculitisTears from "../features/optional/quality/fadeVasculitisTears";
import { mod } from "../mod";

export function init(): void {
  mod.AddCallbackCustom(
    ModCallbackCustom.POST_TEAR_INIT_LATE,
    blood,
    TearVariant.BLOOD, // 1
  );
}

function blood(tear: EntityTear) {
  fadeVasculitisTears.postTearInitLateBlood(tear);
}
