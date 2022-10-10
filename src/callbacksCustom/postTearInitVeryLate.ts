import { ModCallbackCustom } from "isaacscript-common";
import * as leadPencilChargeBar from "../features/optional/quality/leadPencilChargeBar";
import { mod } from "../mod";

export function init(): void {
  mod.AddCallbackCustom(ModCallbackCustom.POST_TEAR_INIT_VERY_LATE, main);
}

function main(tear: EntityTear) {
  leadPencilChargeBar.postTearInitVeryLate(tear);
}
