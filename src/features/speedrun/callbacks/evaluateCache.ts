import { season2EvaluateCacheFlying } from "../season2/callbacks/evaluateCache";
import { inSpeedrun } from "../speedrun";

// CacheFlag.FLYING (1 << 7)
export function speedrunEvaluateCacheFlying(player: EntityPlayer): void {
  if (!inSpeedrun()) {
    return;
  }

  season2EvaluateCacheFlying(player);
}
