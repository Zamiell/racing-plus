import { ModCallbackCustom, ModUpgraded } from "isaacscript-common";
import * as leadPencilChargeBar from "../features/optional/quality/leadPencilChargeBar";

export function init(mod: ModUpgraded): void {
  mod.AddCallbackCustom(ModCallbackCustom.POST_TEAR_INIT_VERY_LATE, main);
}

function main(tear: EntityTear) {
  leadPencilChargeBar.postTearInitVeryLate(tear);
}
