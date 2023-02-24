import { CacheFlag, ModCallback } from "isaac-typescript-definitions";
import * as changeCreepColor from "../features/optional/quality/changeCreepColor";
import { mod } from "../mod";

export function init(): void {
  mod.AddCallback(ModCallback.EVALUATE_CACHE, tearColor, CacheFlag.TEAR_COLOR); // 1 << 6
}

// CacheFlag.TEAR_COLOR (1 << 6)
function tearColor(player: EntityPlayer) {
  changeCreepColor.evaluateCacheTearColor(player);
}
