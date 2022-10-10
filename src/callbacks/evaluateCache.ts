import { CacheFlag, ModCallback } from "isaac-typescript-definitions";
import * as magic8BallSeeded from "../features/items/magic8BallSeeded";
import * as nLuck from "../features/items/nLuck";
import * as sawblade from "../features/items/sawblade";
import * as solCustom from "../features/items/solCustom";
import * as changeCreepColor from "../features/optional/quality/changeCreepColor";
import { speedrunEvaluateCacheFlying } from "../features/speedrun/callbacks/evaluateCache";
import { mod } from "../mod";

export function init(): void {
  mod.AddCallback(ModCallback.EVALUATE_CACHE, damage, CacheFlag.DAMAGE); // 1 << 0
  mod.AddCallback(ModCallback.EVALUATE_CACHE, shotSpeed, CacheFlag.SHOT_SPEED); // 1 << 2
  mod.AddCallback(ModCallback.EVALUATE_CACHE, tearColor, CacheFlag.TEAR_COLOR); // 1 << 6
  mod.AddCallback(ModCallback.EVALUATE_CACHE, flying, CacheFlag.FLYING); // 1 << 7
  mod.AddCallback(ModCallback.EVALUATE_CACHE, familiars, CacheFlag.FAMILIARS); // 1 << 9
  mod.AddCallback(ModCallback.EVALUATE_CACHE, luck, CacheFlag.LUCK); // 1 << 10
}

// CacheFlag.DAMAGE (1 << 0)
function damage(player: EntityPlayer) {
  solCustom.evaluateCacheDamage(player);
}

// CacheFlag.SHOT_SPEED (1 << 2)
function shotSpeed(player: EntityPlayer) {
  magic8BallSeeded.evaluateCacheShotSpeed(player);
}

// CacheFlag.TEAR_COLOR (1 << 6)
function tearColor(player: EntityPlayer) {
  changeCreepColor.evaluateCacheTearColor(player);
}

// CacheFlag.FLYING (1 << 7)
function flying(player: EntityPlayer) {
  speedrunEvaluateCacheFlying(player);
}

// CacheFlag.FAMILIARS (1 << 9)
function familiars(player: EntityPlayer) {
  sawblade.evaluateCacheFamiliars(player);
}

// CacheFlag.LUCK (1 << 10)
function luck(player: EntityPlayer) {
  nLuck.evaluateCacheLuck(player);
  solCustom.evaluateCacheLuck(player);
}
