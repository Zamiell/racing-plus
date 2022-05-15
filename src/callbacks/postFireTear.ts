import { ModCallback } from "isaac-typescript-definitions";
import * as leadPencilChargeBar from "../features/optional/quality/leadPencilChargeBar";

export function init(mod: Mod): void {
  mod.AddCallback(ModCallback.POST_FIRE_TEAR, main);
}

function main(tear: EntityTear) {
  // QoL
  leadPencilChargeBar.postFireTear(tear);
}
